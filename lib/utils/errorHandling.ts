/**
 * Enhanced error handling utilities for API calls and async operations
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network error. Please check your connection.") {
    super(message, "NETWORK_ERROR", 0, true);
    this.name = "NetworkError";
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, "VALIDATION_ERROR", 400, false);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed. Please log in again.") {
    super(message, "AUTH_ERROR", 401, false);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "The requested resource was not found.") {
    super(message, "NOT_FOUND", 404, false);
    this.name = "NotFoundError";
  }
}

export class ServerError extends AppError {
  constructor(message: string = "Server error. Please try again later.") {
    super(message, "SERVER_ERROR", 500, true);
    this.name = "ServerError";
  }
}

/**
 * Parse error into user-friendly message
 */
export function parseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new NetworkError();
    }

    // Generic error
    return new AppError(error.message, "UNKNOWN_ERROR", 0, false);
  }

  // Unknown error type
  return new AppError("An unexpected error occurred", "UNKNOWN_ERROR", 0, false);
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  backoffMultiplier: number;
  retryableStatuses: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  backoffMultiplier: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

/**
 * Execute async function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const { maxRetries, retryDelay, backoffMultiplier, retryableStatuses } = {
    ...DEFAULT_RETRY_CONFIG,
    ...config,
  };

  let lastError: Error | null = null;
  let delay = retryDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const parsedError = parseError(error);

      // Don't retry if not retryable
      if (!parsedError.isRetryable) {
        throw parsedError;
      }

      // Don't retry if status code is not in retryable list
      if (
        parsedError.statusCode &&
        !retryableStatuses.includes(parsedError.statusCode)
      ) {
        throw parsedError;
      }

      // Last attempt failed
      if (attempt === maxRetries) {
        throw parsedError;
      }

      // Wait before retry with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= backoffMultiplier;
    }
  }

  throw parseError(lastError);
}

/**
 * Execute async function with timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new AppError("Request timeout", "TIMEOUT", 408, true));
    }, timeoutMs);
  });

  return Promise.race([fn(), timeoutPromise]);
}

/**
 * Safe async wrapper that catches errors
 */
export async function safeAsync<T>(
  fn: () => Promise<T>
): Promise<[T | null, AppError | null]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, parseError(error)];
  }
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: unknown): string {
  const parsedError = parseError(error);

  // Custom messages for specific error types
  switch (parsedError.name) {
    case "NetworkError":
      return "Unable to connect. Please check your internet connection and try again.";
    case "AuthenticationError":
      return "Your session has expired. Please log in again.";
    case "ValidationError":
      return parsedError.message || "Please check your input and try again.";
    case "NotFoundError":
      return "The requested information could not be found.";
    case "ServerError":
      return "We're experiencing technical difficulties. Please try again in a few moments.";
    default:
      return parsedError.message || "Something went wrong. Please try again.";
  }
}

/**
 * Log error to console (in development) or error tracking service (in production)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const parsedError = parseError(error);

  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", {
      name: parsedError.name,
      message: parsedError.message,
      code: parsedError.code,
      statusCode: parsedError.statusCode,
      isRetryable: parsedError.isRetryable,
      context,
      stack: parsedError.stack,
    });
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // sentry.captureException(parsedError, { extra: context });
    console.error("Error:", parsedError.message);
  }
}

/**
 * Check if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  const parsedError = parseError(error);
  return parsedError instanceof NetworkError || parsedError.code === "NETWORK_ERROR";
}

/**
 * Check if error is authentication-related
 */
export function isAuthError(error: unknown): boolean {
  const parsedError = parseError(error);
  return (
    parsedError instanceof AuthenticationError || parsedError.statusCode === 401
  );
}

/**
 * Check if operation should be retried
 */
export function shouldRetry(error: unknown, attemptCount: number = 0): boolean {
  const parsedError = parseError(error);
  return parsedError.isRetryable && attemptCount < 3;
}
