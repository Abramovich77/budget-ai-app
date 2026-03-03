/**
 * API Error Handling
 *
 * Centralized error classes and handlers for consistent API error responses.
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request", details?: unknown) {
    super(400, message, "BAD_REQUEST", details);
    this.name = "BadRequestError";
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized access", details?: unknown) {
    super(401, message, "UNAUTHORIZED", details);
    this.name = "UnauthorizedError";
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = "Access forbidden", details?: unknown) {
    super(403, message, "FORBIDDEN", details);
    this.name = "ForbiddenError";
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource: string = "Resource", details?: unknown) {
    super(404, `${resource} not found`, "NOT_FOUND", details);
    this.name = "NotFoundError";
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends ApiError {
  constructor(message: string = "Resource already exists", details?: unknown) {
    super(409, message, "CONFLICT", details);
    this.name = "ConflictError";
  }
}

/**
 * 422 Unprocessable Entity (Validation Error)
 */
export class ValidationError extends ApiError {
  constructor(message: string = "Validation failed", details?: unknown) {
    super(422, message, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

/**
 * 429 Too Many Requests
 */
export class RateLimitError extends ApiError {
  constructor(message: string = "Rate limit exceeded", retryAfter?: number) {
    super(429, message, "RATE_LIMIT_EXCEEDED", { retryAfter });
    this.name = "RateLimitError";
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message: string = "Internal server error", details?: unknown) {
    super(500, message, "INTERNAL_ERROR", details);
    this.name = "InternalServerError";
  }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(service: string = "Service", details?: unknown) {
    super(503, `${service} is temporarily unavailable`, "SERVICE_UNAVAILABLE", details);
    this.name = "ServiceUnavailableError";
  }
}

/**
 * Error response format
 */
interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
    timestamp: string;
    path?: string;
  };
}

/**
 * Convert error to API response format
 */
export function formatErrorResponse(
  error: unknown,
  path?: string
): { response: ErrorResponse; status: number } {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    return {
      response: {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          timestamp: new Date().toISOString(),
          path,
        },
      },
      status: error.statusCode,
    };
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return {
      response: {
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: formattedErrors,
          timestamp: new Date().toISOString(),
          path,
        },
      },
      status: 422,
    };
  }

  // Handle Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: unknown };

    // P2002: Unique constraint violation
    if (prismaError.code === "P2002") {
      return {
        response: {
          error: {
            message: "A record with this value already exists",
            code: "DUPLICATE_ENTRY",
            details: prismaError.meta,
            timestamp: new Date().toISOString(),
            path,
          },
        },
        status: 409,
      };
    }

    // P2025: Record not found
    if (prismaError.code === "P2025") {
      return {
        response: {
          error: {
            message: "Record not found",
            code: "NOT_FOUND",
            details: prismaError.meta,
            timestamp: new Date().toISOString(),
            path,
          },
        },
        status: 404,
      };
    }

    // P2003: Foreign key constraint violation
    if (prismaError.code === "P2003") {
      return {
        response: {
          error: {
            message: "Related record not found",
            code: "INVALID_REFERENCE",
            details: prismaError.meta,
            timestamp: new Date().toISOString(),
            path,
          },
        },
        status: 400,
      };
    }
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    const isDevelopment = process.env.NODE_ENV === "development";

    return {
      response: {
        error: {
          message: isDevelopment ? error.message : "An unexpected error occurred",
          code: "INTERNAL_ERROR",
          details: isDevelopment ? { stack: error.stack } : undefined,
          timestamp: new Date().toISOString(),
          path,
        },
      },
      status: 500,
    };
  }

  // Handle unknown errors
  return {
    response: {
      error: {
        message: "An unexpected error occurred",
        code: "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
        path,
      },
    },
    status: 500,
  };
}

/**
 * Create error response
 */
export function createErrorResponse(error: unknown, path?: string): NextResponse {
  const { response, status } = formatErrorResponse(error, path);

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("API Error:", {
      status,
      error: response.error,
      originalError: error,
    });
  }

  return NextResponse.json(response, { status });
}

/**
 * Async error handler wrapper for API routes
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<NextResponse>>(
  handler: T
): T {
  return (async (...args: Parameters<T>): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      // Extract path from request if available
      const request = args[0];
      const path = request?.nextUrl?.pathname;

      return createErrorResponse(error, path);
    }
  }) as T;
}

/**
 * Assert condition or throw error
 */
export function assert(
  condition: boolean,
  error: ApiError | string,
  details?: unknown
): asserts condition {
  if (!condition) {
    if (typeof error === "string") {
      throw new BadRequestError(error, details);
    }
    throw error;
  }
}

/**
 * Assert resource exists or throw 404
 */
export function assertExists<T>(
  resource: T | null | undefined,
  resourceName: string = "Resource"
): asserts resource is T {
  if (resource === null || resource === undefined) {
    throw new NotFoundError(resourceName);
  }
}

/**
 * Assert user is authorized or throw 401
 */
export function assertAuthorized(
  condition: boolean,
  message: string = "Unauthorized access"
): asserts condition {
  if (!condition) {
    throw new UnauthorizedError(message);
  }
}

/**
 * Assert user has permission or throw 403
 */
export function assertPermission(
  condition: boolean,
  message: string = "Insufficient permissions"
): asserts condition {
  if (!condition) {
    throw new ForbiddenError(message);
  }
}
