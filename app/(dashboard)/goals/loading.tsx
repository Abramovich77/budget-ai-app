import { ListSkeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the Goals page
 * Shows skeleton loaders for goal cards while data loads
 */
export default function GoalsLoading() {
  return (
    <div className="animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-5 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Goal Cards List Skeleton */}
      <ListSkeleton rows={4} />
    </div>
  );
}
