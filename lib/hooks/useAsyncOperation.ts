/**
 * Custom hook for handling async operations with loading, error states, and retry logic
 */

import { useState, useCallback } from "react";
import { withRetry, parseError, logError, AppError } from "@/lib/utils/errorHandling";

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: AppError) => void;
  enableRetry?: boolean;
  maxRetries?: number;
}

interface AsyncOperationState<T> {
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useAsyncOperation<T = any>(
  options: UseAsyncOperationOptions = {}
) {
  const { onSuccess, onError, enableRetry = true, maxRetries = 3 } = options;

  const [state, setState] = useState<AsyncOperationState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const execute = useCallback(
    async (asyncFn: () => Promise<T>) => {
      setState({
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
      });

      try {
        let result: T;

        if (enableRetry) {
          result = await withRetry(asyncFn, { maxRetries });
        } else {
          result = await asyncFn();
        }

        setState({
          data: result,
          error: null,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });

        onSuccess?.(result);
        return result;
      } catch (error) {
        const parsedError = parseError(error);
        logError(parsedError);

        setState({
          data: null,
          error: parsedError,
          isLoading: false,
          isSuccess: false,
          isError: true,
        });

        onError?.(parsedError);
        throw parsedError;
      }
    },
    [enableRetry, maxRetries, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  const retry = useCallback(
    async (asyncFn: () => Promise<T>) => {
      return execute(asyncFn);
    },
    [execute]
  );

  return {
    ...state,
    execute,
    reset,
    retry,
  };
}

/**
 * Hook for mutations (create, update, delete operations)
 */
export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseAsyncOperationOptions = {}
) {
  const operation = useAsyncOperation<TData>(options);

  const mutate = useCallback(
    async (variables: TVariables) => {
      return operation.execute(() => mutationFn(variables));
    },
    [mutationFn, operation]
  );

  return {
    ...operation,
    mutate,
  };
}

/**
 * Hook for queries (fetch operations)
 */
export function useQuery<T = any>(
  queryFn: () => Promise<T>,
  options: UseAsyncOperationOptions & { enabled?: boolean } = {}
) {
  const { enabled = true, ...restOptions } = options;
  const operation = useAsyncOperation<T>(restOptions);

  const refetch = useCallback(() => {
    return operation.execute(queryFn);
  }, [queryFn, operation]);

  // Auto-fetch on mount if enabled
  useState(() => {
    if (enabled) {
      refetch();
    }
  });

  return {
    ...operation,
    refetch,
  };
}
