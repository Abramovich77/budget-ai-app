import {
  StatCardSkeleton,
  CategoryChartSkeleton,
  RecentTransactionsSkeleton,
  InsightsCardSkeleton,
  QuickActionsSkeleton,
} from "@/components/ui/Skeleton";

/**
 * Loading state for the dashboard page
 * Displays skeleton loaders that match the structure of the actual dashboard
 * Provides better perceived performance by showing placeholders while data loads
 */
export default function DashboardLoading() {
  return (
    <div className="animate-fade-in">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
        <div className="h-5 w-80 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCardSkeleton delay="0s" />
        <StatCardSkeleton delay="0.1s" />
        <StatCardSkeleton delay="0.2s" />
        <StatCardSkeleton delay="0.3s" />
      </div>

      {/* AI Insights & Quick Actions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <InsightsCardSkeleton maxInsights={3} />
        </div>
        <QuickActionsSkeleton />
      </div>

      {/* Category Chart & Recent Transactions Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <CategoryChartSkeleton />
        <RecentTransactionsSkeleton />
      </div>
    </div>
  );
}
