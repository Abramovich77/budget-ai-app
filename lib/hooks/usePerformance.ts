/**
 * Performance Tracking Hooks
 *
 * React hooks for tracking performance metrics.
 */

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { perf } from "@/lib/analytics/performance";

/**
 * Track page view performance
 */
export function usePagePerformance(pageName?: string) {
  const pathname = usePathname();
  const effectivePageName = pageName || pathname;

  useEffect(() => {
    // Track page load after a short delay to ensure paint metrics are captured
    const timer = setTimeout(() => {
      perf.trackPageLoad(effectivePageName);
    }, 0);

    return () => clearTimeout(timer);
  }, [effectivePageName]);
}

/**
 * Track component mount/render performance
 */
export function useComponentPerformance(componentName: string) {
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef(performance.now());

  useEffect(() => {
    renderCountRef.current += 1;

    if (renderCountRef.current === 1) {
      // First render (mount)
      const mountDuration = performance.now() - mountTimeRef.current;
      perf.trackComponentRender(componentName, mountDuration, "mount");
    } else {
      // Subsequent renders (updates)
      const updateStart = performance.now();
      return () => {
        const updateDuration = performance.now() - updateStart;
        perf.trackComponentRender(componentName, updateDuration, "update");
      };
    }
  });
}

/**
 * Track API call performance
 */
export function useApiPerformance() {
  const trackApiCall = useCallback(
    async <T,>(
      endpoint: string,
      fetchFn: () => Promise<T>,
      method: string = "GET"
    ): Promise<T> => {
      const startTime = performance.now();
      let status = 0;

      try {
        const result = await fetchFn();
        status = 200; // Assume success if no error
        return result;
      } catch (error) {
        status = error instanceof Response ? error.status : 500;
        throw error;
      } finally {
        const duration = performance.now() - startTime;
        perf.trackApiCall(endpoint, duration, status, method);
      }
    },
    []
  );

  return { trackApiCall };
}

/**
 * Track user interactions (clicks, inputs, etc.)
 */
export function useInteractionTracking() {
  const trackClick = useCallback((target: string, metadata?: Record<string, any>) => {
    perf.trackInteraction("click", target, metadata);
  }, []);

  const trackFormSubmit = useCallback((formName: string, metadata?: Record<string, any>) => {
    perf.trackInteraction("form-submit", formName, metadata);
  }, []);

  const trackInput = useCallback((inputName: string, metadata?: Record<string, any>) => {
    perf.trackInteraction("input", inputName, metadata);
  }, []);

  const trackCustom = useCallback((action: string, target: string, metadata?: Record<string, any>) => {
    perf.trackInteraction(action, target, metadata);
  }, []);

  return {
    trackClick,
    trackFormSubmit,
    trackInput,
    trackCustom,
  };
}

/**
 * Track navigation performance
 */
export function useNavigationPerformance() {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const navigationStartRef = useRef(performance.now());

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      const duration = performance.now() - navigationStartRef.current;
      perf.trackNavigation(previousPathnameRef.current, pathname, duration);

      previousPathnameRef.current = pathname;
      navigationStartRef.current = performance.now();
    }
  }, [pathname]);
}

/**
 * Measure execution time of a function
 */
export function useMeasure() {
  const measure = useCallback(
    async <T,>(name: string, fn: () => T | Promise<T>): Promise<T> => {
      const startTime = performance.now();

      try {
        const result = await fn();
        return result;
      } finally {
        const duration = performance.now() - startTime;
        perf.trackComponentRender(name, duration);
      }
    },
    []
  );

  return { measure };
}

/**
 * Track specific performance mark
 */
export function usePerformanceMark(markName: string) {
  const mark = useCallback(() => {
    if (typeof performance !== "undefined" && performance.mark) {
      performance.mark(markName);
    }
  }, [markName]);

  const measureFromMark = useCallback(
    (measureName: string) => {
      if (typeof performance !== "undefined" && performance.measure) {
        try {
          performance.measure(measureName, markName);
          const measure = performance.getEntriesByName(measureName)[0];
          if (measure) {
            perf.trackComponentRender(measureName, measure.duration);
          }
        } catch (error) {
          // Mark might not exist yet
          console.warn(`Could not measure from mark: ${markName}`, error);
        }
      }
    },
    [markName]
  );

  return { mark, measureFromMark };
}

/**
 * Track slow renders (renders that take longer than threshold)
 */
export function useSlowRenderTracking(componentName: string, threshold: number = 16) {
  const renderStartRef = useRef(0);

  useEffect(() => {
    renderStartRef.current = performance.now();

    return () => {
      const renderDuration = performance.now() - renderStartRef.current;
      if (renderDuration > threshold) {
        perf.trackComponentRender(`slow-render:${componentName}`, renderDuration);
      }
    };
  });
}

/**
 * Track data fetching performance
 */
export function useFetchPerformance<T>(
  key: string,
  fetchFn: () => Promise<T>,
  dependencies: any[] = []
) {
  const { trackApiCall } = useApiPerformance();

  useEffect(() => {
    const fetchData = async () => {
      await trackApiCall(key, fetchFn);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
