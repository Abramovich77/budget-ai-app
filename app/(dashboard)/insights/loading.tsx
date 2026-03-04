import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Loading state for the Insights page
 * Shows skeleton loaders for insights cards while data loads
 */
export default function InsightsLoading() {
  return (
    <div className="animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-9 w-36" />
        </div>
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Info Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg flex-shrink-0" />
        ))}
      </div>

      {/* Insights List Skeleton */}
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            style={{
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />

              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Description lines */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </div>

              {/* Action button */}
              <Skeleton className="h-9 w-24 rounded flex-shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
