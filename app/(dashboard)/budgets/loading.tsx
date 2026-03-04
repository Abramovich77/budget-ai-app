import { GridSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the Budgets page
 * Shows skeleton loaders for budget cards while data loads
 */
export default function BudgetsLoading() {
  return (
    <div className="animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Budget Cards Grid Skeleton */}
      <GridSkeleton items={3} />
    </div>
  );
}
