"use client";

import { Suspense, ComponentType, lazy, useRef, useEffect, useState } from "react";
import { useIntersectionObserver } from "@/lib/utils/performance";

/**
 * Lazy Load Wrapper Component
 *
 * Loads components only when they're about to enter the viewport
 * Improves initial page load performance
 */

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Lazy load component with intersection observer
 * Only renders children when component is near viewport
 */
export function LazyLoad({
  children,
  fallback = <LoadingFallback />,
  threshold = 0.1,
  rootMargin = "200px",
}: LazyLoadProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, {
    threshold,
    rootMargin,
  });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isIntersecting, hasLoaded]);

  return (
    <div ref={ref} className="min-h-[100px]">
      {hasLoaded ? children : fallback}
    </div>
  );
}

/**
 * Default loading fallback
 */
function LoadingFallback() {
  return (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-400 dark:text-gray-600 text-sm">Loading...</div>
    </div>
  );
}

/**
 * Lazy load a dynamic import with Suspense
 */
interface LazyComponentProps {
  importFunc: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  fallback?: React.ReactNode;
  componentProps?: Record<string, unknown>;
}

export function LazyComponent({
  importFunc,
  fallback = <LoadingFallback />,
  componentProps = {},
}: LazyComponentProps) {
  const LazyComp = lazy(importFunc);

  return (
    <Suspense fallback={fallback}>
      <LazyComp {...componentProps} />
    </Suspense>
  );
}

/**
 * Skeleton loader for charts
 */
export function ChartSkeleton() {
  return (
    <div className="w-full h-80 bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
      <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded" />
    </div>
  );
}

/**
 * Skeleton loader for data table
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton loader for card grid
 */
export function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 animate-pulse"
        >
          <div className="h-6 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
}
