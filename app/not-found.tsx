"use client";

import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

/**
 * Custom 404 Not Found page
 * Displayed when a route doesn't exist
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-full p-6 shadow-xl">
              <FileQuestion className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-bounce-slow" />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-lg hover:shadow-xl"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Looking for something?
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/dashboard"
              className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition"
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition"
            >
              Transactions
            </Link>
            <Link
              href="/budgets"
              className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition"
            >
              Budgets
            </Link>
            <Link
              href="/goals"
              className="text-left px-3 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded transition"
            >
              Goals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
