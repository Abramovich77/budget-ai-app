/**
 * Error display components for showing user-friendly error messages
 */

"use client";

import { AlertTriangle, WifiOff, ServerCrash, RefreshCw, Home } from "lucide-react";
import { getUserErrorMessage, isNetworkError, isAuthError } from "@/lib/utils/errorHandling";

interface ErrorDisplayProps {
  error: Error | unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  showHomeButton?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  showHomeButton = false,
}: ErrorDisplayProps) {
  const errorMessage = getUserErrorMessage(error);
  const isNetwork = isNetworkError(error);
  const isAuth = isAuthError(error);

  // Choose icon based on error type
  const Icon = isNetwork ? WifiOff : isAuth ? AlertTriangle : ServerCrash;

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <Icon className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {isNetwork
            ? "Connection Error"
            : isAuth
            ? "Authentication Required"
            : "Something Went Wrong"}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMessage}</p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}

          {showHomeButton && (
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
            >
              <Home className="h-4 w-4" />
              Go Home
            </button>
          )}

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline error message for forms and smaller components
 */
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-red-800 dark:text-red-300">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Network status indicator
 */
export function NetworkStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-3 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg shadow-lg">
        <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
          You're offline. Some features may be unavailable.
        </p>
      </div>
    </div>
  );
}

// Add missing import for useState and useEffect
import { useState, useEffect } from "react";
