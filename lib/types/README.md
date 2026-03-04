# Type Definitions

This directory contains comprehensive TypeScript type definitions for the Budget AI application.

## Structure

- **`index.ts`** - Central export file (import from here)
- **`models.ts`** - Core data models (Transaction, Budget, Goal, User)
- **`api.ts`** - API requests, responses, and HTTP types
- **`ui.ts`** - React components, forms, and UI interaction types
- **`utils.ts`** - Generic utilities, async operations, and error types
- **`ai.ts`** - AI insights, predictions, and analysis types

## Usage

### Importing Types

Always import from the index file for consistency:

```typescript
import { Transaction, Budget, Goal, User } from '@/lib/types';
import { ApiResponse, CreateTransactionRequest } from '@/lib/types';
import { ToastType, FormState, TableProps } from '@/lib/types';
import { AIInsight, SpendingPrediction } from '@/lib/types';
```

### Type Guards

Use provided type guards for runtime type checking:

```typescript
import { isTransaction, isApiResponse, isAIInsight } from '@/lib/types';

if (isTransaction(data)) {
  // TypeScript knows data is Transaction
  console.log(data.amount);
}

if (isApiResponse(response)) {
  // TypeScript knows response is ApiResponse
  console.log(response.success);
}
```

### Form Validation

Use form types for consistent form handling:

```typescript
import { FormState, FormHandlers } from '@/lib/types';

interface MyFormData {
  email: string;
  amount: number;
}

const formState: FormState<MyFormData> = {
  values: { email: '', amount: 0 },
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: false,
  isDirty: false,
};
```

### API Requests

Use API types for type-safe API calls:

```typescript
import { CreateTransactionRequest, ApiResponse, Transaction } from '@/lib/types';

async function createTransaction(
  data: CreateTransactionRequest
): Promise<ApiResponse<Transaction>> {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}
```

### Component Props

Use UI types for consistent component interfaces:

```typescript
import { BaseComponentProps, InteractiveComponentProps } from '@/lib/types';

interface ButtonProps extends InteractiveComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, disabled, loading, onClick, ...props }: ButtonProps) {
  // Implementation
}
```

### Async Operations

Use async operation types for loading states:

```typescript
import { AsyncState, AsyncOperation } from '@/lib/types';

const [state, setState] = useState<AsyncState<Transaction[]>>({
  data: null,
  error: null,
  status: 'idle',
  isLoading: false,
  isSuccess: false,
  isError: false,
});
```

## Best Practices

### 1. Use Specific Types

```typescript
// ❌ Avoid
const data: any = await fetchData();

// ✅ Prefer
const data: Transaction[] = await fetchData();
```

### 2. Use Type Guards

```typescript
// ❌ Avoid
if ((data as Transaction).amount) {
  // Unsafe type assertion
}

// ✅ Prefer
if (isTransaction(data)) {
  // Type-safe with guard
  console.log(data.amount);
}
```

### 3. Use Utility Types

```typescript
import { WithRequired, DeepPartial, Nullable } from '@/lib/types';

// Make specific fields required
type TransactionWithMerchant = WithRequired<Transaction, 'merchant'>;

// Make all fields optional (recursively)
type PartialBudget = DeepPartial<Budget>;

// Allow null values
type NullableUser = Nullable<User>;
```

### 4. Extend Existing Types

```typescript
import { Transaction } from '@/lib/types';

// Add UI-specific fields
interface TransactionWithUI extends Transaction {
  isSelected: boolean;
  isEditing: boolean;
}
```

### 5. Use Discriminated Unions

```typescript
type AsyncResult<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function handleResult<T>(result: AsyncResult<T>) {
  switch (result.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <Data data={result.data} />; // data is typed
    case 'error':
      return <Error error={result.error} />; // error is typed
  }
}
```

## Type Coverage

### Models (models.ts)
- ✅ Transaction
- ✅ Budget
- ✅ Goal
- ✅ User
- ✅ Categories & Enums
- ✅ Summary & Progress types

### API (api.ts)
- ✅ Request/Response types
- ✅ Error handling
- ✅ HTTP status codes
- ✅ WebSocket messages
- ✅ CRUD operations

### UI (ui.ts)
- ✅ Component props
- ✅ Form handling
- ✅ Toast notifications
- ✅ Modals & dialogs
- ✅ Tables & charts
- ✅ Theme & navigation

### Utils (utils.ts)
- ✅ Async operations
- ✅ Validation
- ✅ Event handlers
- ✅ Storage & cache
- ✅ Date/time utilities
- ✅ Error classes
- ✅ Type guards

### AI (ai.ts)
- ✅ Insights & recommendations
- ✅ Spending analysis
- ✅ Predictions
- ✅ Anomaly detection
- ✅ Pattern recognition
- ✅ Merchant analysis

## Migration Guide

If you have existing code with inline types, migrate gradually:

### Step 1: Import Core Types

```typescript
// Before
interface Transaction {
  id: string;
  amount: number;
  // ...
}

// After
import { Transaction } from '@/lib/types';
```

### Step 2: Replace `any` Types

```typescript
// Before
const data: any = await fetch();

// After
import { ApiResponse, Transaction } from '@/lib/types';
const data: ApiResponse<Transaction> = await fetch();
```

### Step 3: Add Type Guards

```typescript
// Before
if (data && data.id) {
  // Unsafe check
}

// After
import { isTransaction } from '@/lib/types';
if (isTransaction(data)) {
  // Type-safe
}
```

## Contributing

When adding new types:

1. Add to appropriate file (models, api, ui, utils, ai)
2. Export from `index.ts`
3. Add type guards if needed
4. Update this README
5. Add JSDoc comments for complex types
6. Ensure all types are used (no dead code)

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
