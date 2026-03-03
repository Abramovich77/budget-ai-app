/**
 * Client-Side Error Handling
 *
 * Utilities for handling and displaying errors in the UI.
 */

// Toast notification interface (compatible with most toast libraries)
interface ToastOptions {
  description?: string;
  duration?: number;
}

// Stub toast implementation (replace with your toast library)
const toast = {
  error: (message: string, options?: ToastOptions) => {
    console.error(`[Toast Error] ${message}`, options?.description);
  },
  success: (message: string, options?: ToastOptions) => {
    console.log(`[Toast Success] ${message}`, options?.description);
  },
  info: (message: string, options?: ToastOptions) => {
    console.info(`[Toast Info] ${message}`, options?.description);
  },
  warning: (message: string, options?: ToastOptions) => {
    console.warn(`[Toast Warning] ${message}`, options?.description);
  },
};

/**
 * Error types for user-friendly messages
 */
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  TIMEOUT: "Request timed out. Please try again.",

  // Authentication errors
  UNAUTHORIZED: "Please sign in to continue.",
  FORBIDDEN: "You don't have permission to perform this action.",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",

  // Validation errors
  VALIDATION_ERROR: "Please check your input and try again.",
  REQUIRED_FIELD: "This field is required.",

  // Resource errors
  NOT_FOUND: "The requested item was not found.",
  ALREADY_EXISTS: "This item already exists.",

  // Rate limiting
  RATE_LIMIT: "Too many requests. Please wait a moment and try again.",

  // Server errors
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  SERVICE_UNAVAILABLE: "Service is temporarily unavailable. Please try again later.",

  // Generic
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
} as const;

/**
 * Parse API error response
 */
export interface ParsedError {
  message: string;
  code?: string;
  details?: unknown;
  status?: number;
}

export async function parseApiError(error: unknown): Promise<ParsedError> {
  // Handle Response objects
  if (error instanceof Response) {
    try {
      const data = await error.json();

      return {
        message: data.error?.message || ERROR_MESSAGES.SERVER_ERROR,
        code: data.error?.code,
        details: data.error?.details,
        status: error.status,
      };
    } catch {
      return {
        message: getErrorMessageForStatus(error.status),
        status: error.status,
      };
    }
  }

  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      code: "NETWORK_ERROR",
    };
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
    };
  }

  // Handle unknown errors
  return {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
  };
}

/**
 * Get user-friendly error message for status code
 */
export function getErrorMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request. Please check your input.";
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 409:
      return ERROR_MESSAGES.ALREADY_EXISTS;
    case 422:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 429:
      return ERROR_MESSAGES.RATE_LIMIT;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    case 503:
      return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    default:
      if (status >= 500) return ERROR_MESSAGES.SERVER_ERROR;
      if (status >= 400) return ERROR_MESSAGES.UNKNOWN_ERROR;
      return "An error occurred";
  }
}

/**
 * Display error toast notification
 */
export async function showErrorToast(error: unknown, customMessage?: string): Promise<void> {
  const parsed = await parseApiError(error);
  const message = customMessage || parsed.message;

  toast.error(message, {
    description: parsed.details && typeof parsed.details === "object"
      ? JSON.stringify(parsed.details, null, 2)
      : undefined,
    duration: 5000,
  });
}

/**
 * Display success toast notification
 */
export function showSuccessToast(message: string, description?: string): void {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

/**
 * Display info toast notification
 */
export function showInfoToast(message: string, description?: string): void {
  toast.info(message, {
    description,
    duration: 3000,
  });
}

/**
 * Display warning toast notification
 */
export function showWarningToast(message: string, description?: string): void {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

/**
 * Handle form submission errors
 */
export async function handleFormError(error: unknown, formName: string = "form"): Promise<void> {
  const parsed = await parseApiError(error);

  // Check if it's a validation error with field details
  if (parsed.code === "VALIDATION_ERROR" && Array.isArray(parsed.details)) {
    const fieldErrors = parsed.details as Array<{ field: string; message: string }>;
    const errorList = fieldErrors.map((e) => `${e.field}: ${e.message}`).join("\n");

    toast.error("Validation Error", {
      description: errorList,
      duration: 6000,
    });
  } else {
    toast.error(`Failed to submit ${formName}`, {
      description: parsed.message,
      duration: 5000,
    });
  }
}

/**
 * Retry wrapper with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx), only server errors (5xx)
      if (error instanceof Response && error.status < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
    }
  }

  throw lastError;
}

/**
 * Safe async wrapper that catches and displays errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorMessage?: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      await showErrorToast(error, errorMessage);
      throw error; // Re-throw for caller to handle if needed
    }
  }) as T;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(
  errors: Array<{ field: string; message: string }>
): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0].message;

  return errors.map((e, i) => `${i + 1}. ${e.field}: ${e.message}`).join("\n");
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message.includes("fetch");
}

/**
 * Check if error is an auth error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof Response) {
    return error.status === 401 || error.status === 403;
  }
  return false;
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof Response) {
    return error.status === 422 || error.status === 400;
  }
  return false;
}
