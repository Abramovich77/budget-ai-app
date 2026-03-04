"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

/**
 * Error boundary for dashboard routes
 * Catches and displays errors that occur in dashboard pages
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Dashboard error:", error);

    // In production, log to error reporting service
    // e.g., Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We encountered an error while loading the dashboard. Your data is safe.
          </p>
        </div>

        {/* Error details (collapsible) */}
        <details className="mb-6">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-2">
            Technical details
          </summary>
          <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </details>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
          >
            <Home className="h-4 w-4" />
            Dashboard Home
          </a>
        </div>

        {/* Additional help */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            If this problem persists, try{" "}
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              refreshing the page
            </button>{" "}
            or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
