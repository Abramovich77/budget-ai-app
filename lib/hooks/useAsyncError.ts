import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseAsyncErrorReturn<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for handling async operations with error states
 * Provides loading, error, and data states with automatic error handling
 */
export function useAsyncError<T>(
  asyncFunction: (...args: any[]) => Promise<T>
): UseAsyncErrorReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState({ data: null, error: null, loading: true });

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, error: null, loading: false });
        return result;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, error: errorObj, loading: false });
        return null;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling form submissions with error states
 */
export function useFormSubmit<T>(
  submitFunction: (data: T) => Promise<void>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      try {
        await submitFunction(data);
        setSuccess(true);
        setIsSubmitting(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        setIsSubmitting(false);
      }
    },
    [submitFunction]
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
    setIsSubmitting(false);
  }, []);

  return {
    submit,
    isSubmitting,
    error,
    success,
    reset,
  };
}

/**
 * Hook for handling API calls with retry logic
 */
export function useApiCall<T>(
  apiFunction: () => Promise<T>,
  options: {
    retries?: number;
    retryDelay?: number;
    onError?: (error: Error) => void;
  } = {}
) {
  const { retries = 3, retryDelay = 1000, onError } = options;
  const [attemptCount, setAttemptCount] = useState(0);

  const executeWithRetry = useCallback(
    async (): Promise<T | null> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          setAttemptCount(attempt + 1);
          const result = await apiFunction();
          setAttemptCount(0);
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          if (attempt < retries) {
            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }

      // All retries failed
      if (lastError && onError) {
        onError(lastError);
      }

      setAttemptCount(0);
      return null;
    },
    [apiFunction, retries, retryDelay, onError]
  );

  return {
    execute: executeWithRetry,
    attemptCount,
  };
}
