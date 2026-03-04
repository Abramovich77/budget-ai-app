# Error Handling Guide

Comprehensive error handling system for API routes with typed responses.

## Overview

This system provides:
- ✅ Type-safe error classes
- ✅ Automatic error formatting
- ✅ Consistent error responses
- ✅ Typed success responses
- ✅ Error handler middleware
- ✅ Prisma error mapping
- ✅ Zod validation error formatting

## Error Classes

### Available Error Classes

```typescript
import {
  ApiError,
  BadRequestError,        // 400
  UnauthorizedError,      // 401
  ForbiddenError,         // 403
  NotFoundError,          // 404
  ConflictError,          // 409
  ValidationError,        // 422
  RateLimitError,         // 429
  InternalServerError,    // 500
  ServiceUnavailableError // 503
} from '@/lib/errors/apiErrors';
```

### Usage Examples

```typescript
// Throw specific errors
throw new NotFoundError("Transaction");
throw new UnauthorizedError("Invalid credentials");
throw new ValidationError("Invalid email format", { field: "email" });
throw new ConflictError("Email already exists");
```

## Error Handler Middleware

### Basic Usage

Wrap your API route handler with `withErrorHandler` to automatically catch and format errors:

```typescript
import { withErrorHandler, NotFoundError, successResponses } from '@/lib/errors/apiErrors';
import { NextRequest } from 'next/server';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    throw new BadRequestError("ID is required");
  }

  const item = await prisma.item.findUnique({ where: { id } });

  if (!item) {
    throw new NotFoundError("Item");
  }

  return successResponses.ok(item);
});
```

### Error Response Format

All errors are automatically formatted to this structure:

```typescript
{
  "success": false,
  "error": {
    "message": "Transaction not found",
    "code": "NOT_FOUND",
    "details": { /* optional */ },
    "timestamp": "2024-03-04T16:30:00.000Z",
    "path": "/api/transactions"
  }
}
```

## Success Response Helpers

### Using createSuccessResponse

```typescript
import { createSuccessResponse, HttpStatusCode } from '@/lib/errors/apiErrors';

// Simple success response
return createSuccessResponse(data);

// With custom status and message
return createSuccessResponse(
  data,
  HttpStatusCode.Created,
  "User created successfully"
);
```

### Using successResponses Shortcuts

```typescript
import { successResponses } from '@/lib/errors/apiErrors';

// 200 OK
return successResponses.ok(data);
return successResponses.ok(data, "Fetched successfully");

// 201 Created
return successResponses.created(newUser);
return successResponses.created(newUser, "User registered");

// 204 No Content
return successResponses.noContent();
```

### Paginated Responses

```typescript
import { createPaginatedResponse } from '@/lib/errors/apiErrors';

const transactions = await prisma.transaction.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

const total = await prisma.transaction.count();

return createPaginatedResponse(
  transactions,
  {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  }
);
```

## Assertions

Use assertions to validate conditions and throw errors:

```typescript
import { assert, assertAuthenticated, assertAuthorized } from '@/lib/errors/apiErrors';

// Basic assertion
assert(user !== null, "User not found");
assert(amount > 0, new BadRequestError("Amount must be positive"));

// Authentication check
const session = await auth();
assertAuthenticated(session);

// Authorization check
assertAuthorized(userId === session.user.id, "You can only update your own profile");
```

## Complete API Route Example

```typescript
import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  withErrorHandler,
  assertAuthenticated,
  NotFoundError,
  successResponses,
} from '@/lib/errors/apiErrors';
import { validateBody } from '@/lib/validation/validate';
import { transactionSchema } from '@/lib/validation/schemas';

// GET /api/transactions/:id
export const GET = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  // Check authentication
  const session = await auth();
  assertAuthenticated(session);

  // Find transaction
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: params.id,
      userId: session.user.id, // Ensure user can only access their own data
    },
  });

  // Handle not found
  if (!transaction) {
    throw new NotFoundError("Transaction");
  }

  // Return success
  return successResponses.ok(transaction);
});

// POST /api/transactions
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Check authentication
  const session = await auth();
  assertAuthenticated(session);

  // Validate request body (throws ValidationError on failure)
  const data = await validateBody(request, transactionSchema);

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  // Return created response
  return successResponses.created(transaction, "Transaction created successfully");
});

// DELETE /api/transactions/:id
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await auth();
  assertAuthenticated(session);

  // Verify ownership
  const transaction = await prisma.transaction.findUnique({
    where: { id: params.id },
  });

  if (!transaction) {
    throw new NotFoundError("Transaction");
  }

  assertAuthorized(
    transaction.userId === session.user.id,
    "You can only delete your own transactions"
  );

  // Delete transaction
  await prisma.transaction.delete({
    where: { id: params.id },
  });

  // Return no content
  return successResponses.noContent();
});
```

## Automatic Error Handling

The system automatically handles:

### Zod Validation Errors

```typescript
// Automatically caught and formatted
const data = await validateBody(request, schema);
// If validation fails, returns 422 with formatted field errors
```

### Prisma Errors

Common Prisma errors are automatically mapped:

- `P2002` (Unique constraint) → 409 Conflict
- `P2025` (Record not found) → 404 Not Found
- `P2003` (Foreign key violation) → 400 Bad Request

### Uncaught Errors

All uncaught errors are automatically:
- Logged in development (with stack trace)
- Formatted as 500 Internal Server Error
- Hidden in production (no stack traces leaked)

## Type Safety

All responses are fully typed:

```typescript
// Success responses use ApiResponse<T>
const response = successResponses.ok(transaction);
// Type: NextResponse<ApiResponse<Transaction>>

// Error responses use ApiResponse<never>
const error = createErrorResponse(new NotFoundError("Item"));
// Type: NextResponse with error format
```

## Best Practices

### 1. Use Specific Error Classes

```typescript
// ❌ Don't
throw new Error("Not found");

// ✅ Do
throw new NotFoundError("Transaction");
```

### 2. Use Assertions for Validation

```typescript
// ❌ Don't
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ✅ Do
assertAuthenticated(session);
```

### 3. Use Success Response Helpers

```typescript
// ❌ Don't
return NextResponse.json({ data: user }, { status: 200 });

// ✅ Do
return successResponses.ok(user);
```

### 4. Always Wrap API Routes

```typescript
// ❌ Don't
export async function GET(request: NextRequest) {
  try {
    // handler logic
  } catch (error) {
    // manual error handling
  }
}

// ✅ Do
export const GET = withErrorHandler(async (request: NextRequest) => {
  // handler logic (errors automatically caught)
});
```

### 5. Provide Meaningful Error Messages

```typescript
// ❌ Don't
throw new BadRequestError("Invalid");

// ✅ Do
throw new BadRequestError("Invalid email format. Please provide a valid email address.");
```

## Testing Errors

```typescript
import { formatErrorResponse } from '@/lib/errors/apiErrors';

// Test error formatting
const { response, status } = formatErrorResponse(
  new NotFoundError("Transaction"),
  "/api/transactions/123"
);

expect(status).toBe(404);
expect(response.error.code).toBe("NOT_FOUND");
expect(response.error.message).toBe("Transaction not found");
```

## Migration from Old Error Handling

### Before (Manual)

```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await fetchData();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### After (With Error Handling System)

```typescript
export const GET = withErrorHandler(async (request: NextRequest) => {
  const session = await auth();
  assertAuthenticated(session);

  const data = await fetchData();
  return successResponses.ok(data);
});
```

## Summary

- **Use `withErrorHandler`** for all API routes
- **Throw specific error classes** instead of generic errors
- **Use `successResponses`** for consistent success responses
- **Use assertions** for validation
- **Let the system handle** error formatting and logging
- **All responses are type-safe** with TypeScript

This system ensures consistent, type-safe, and maintainable error handling across all API routes.
