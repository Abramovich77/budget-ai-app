/**
 * Chart Performance Utilities
 *
 * Utilities for optimizing chart performance through lazy loading and preloading
 */

/**
 * Preload recharts library for better perceived performance
 * Call this function early (e.g., on page load, route change, or user interaction)
 * to start loading charts before they're needed
 *
 * @example
 * // Preload on component mount
 * useEffect(() => {
 *   preloadCharts();
 * }, []);
 *
 * @example
 * // Preload on hover (for better UX)
 * <button onMouseEnter={preloadCharts}>View Reports</button>
 */
export function preloadCharts() {
  if (typeof window !== "undefined") {
    import("recharts");
  }
}

/**
 * Preload specific chart components
 * More granular control over what gets preloaded
 */
export function preloadChartComponents(components: string[]) {
  if (typeof window !== "undefined") {
    components.forEach((component) => {
      import("recharts").then((mod) => {
        // Component is now cached
      });
    });
  }
}

/**
 * Best practices for chart performance:
 *
 * 1. Lazy Load Charts
 *    - Use dynamic imports with Next.js
 *    - Load charts only when needed (below fold, on tab click, etc.)
 *
 * 2. Preload Strategically
 *    - Call preloadCharts() on page load for reports page
 *    - Preload on hover for nav items that lead to chart pages
 *
 * 3. Virtualize Large Datasets
 *    - Limit data points to 50-100 for line/bar charts
 *    - Use pagination or data aggregation
 *
 * 4. Memoize Data
 *    - Use useMemo() for chart data transformations
 *    - Prevent unnecessary recalculations
 *
 * 5. Debounce Interactions
 *    - Debounce filters, search, date range changes
 *    - Reduce re-renders during user interaction
 */
