import { TableRowSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the Transactions page
 * Shows skeleton loaders for transaction table while data loads
 */
export default function TransactionsLoading() {
  return (
    <div className="animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-44 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Controls Bar Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
          {/* Search */}
          <div className="flex-1 w-full lg:w-auto">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 flex-wrap">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Transaction Table Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-5 gap-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[...Array(10)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="mt-6 flex items-center justify-between">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
