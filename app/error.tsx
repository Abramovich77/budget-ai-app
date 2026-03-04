"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Global error boundary
 * Catches errors that occur at the root level of the app
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("Global error:", error);

    // In production, log to error reporting service
    // e.g., Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-4 animate-pulse">
                <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                We encountered an unexpected error
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Don't worry, your data is safe. Let's get you back on track.
              </p>
            </div>

            {/* Error details (collapsible) */}
            <details className="mb-6 group">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 mb-2 flex items-center justify-between">
                <span>View technical details</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-words mb-2">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Error ID: <span className="font-mono">{error.digest}</span>
                  </p>
                )}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                      Stack trace
                    </summary>
                    <pre className="mt-2 text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            </details>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              <a
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all font-medium"
              >
                <Home className="h-5 w-5" />
                Go to Home
              </a>
            </div>

            {/* Help text */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100 mb-2 font-medium">
                  💡 What to try:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Refresh the page</li>
                  <li>Clear your browser cache</li>
                  <li>Try again in a few minutes</li>
                  <li>Contact support if the issue persists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
