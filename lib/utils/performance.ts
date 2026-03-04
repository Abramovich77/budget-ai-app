/**
 * Performance Optimization Utilities
 *
 * Provides helpers for lazy loading, memoization, and performance monitoring
 */

import { useEffect, useRef, useState, DependencyList } from "react";

/**
 * Debounce function to limit how often a function is called
 * Useful for search inputs, resize handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to ensure a function is called at most once per interval
 * Useful for scroll handlers, window resize, etc.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook to detect if component is in viewport
 * Useful for lazy loading content below the fold
 */
export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

/**
 * Hook to debounce a value
 * Useful for search inputs to avoid excessive API calls
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to throttle a value
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now - lastUpdated.current >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timeoutId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdated.current));

      return () => clearTimeout(timeoutId);
    }
  }, [value, interval]);

  return throttledValue;
}

/**
 * Memoize expensive calculations
 * Simple in-memory cache with size limit
 */
export class MemoCache<K, V> {
  private cache = new Map<string, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const stringKey = JSON.stringify(key);
    return this.cache.get(stringKey);
  }

  set(key: K, value: V): void {
    const stringKey = JSON.stringify(key);

    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(stringKey, value);
  }

  has(key: K): boolean {
    const stringKey = JSON.stringify(key);
    return this.cache.has(stringKey);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

/**
 * Memoize function results
 */
export function memoize<Args extends any[], Result>(
  fn: (...args: Args) => Result,
  maxCacheSize: number = 100
): (...args: Args) => Result {
  const cache = new MemoCache<Args, Result>(maxCacheSize);

  return (...args: Args): Result => {
    if (cache.has(args)) {
      return cache.get(args)!;
    }

    const result = fn(...args);
    cache.set(args, result);
    return result;
  };
}

/**
 * Measure component render time (development only)
 */
export function useRenderTime(componentName: string, deps: DependencyList = []) {
  const renderCount = useRef(0);
  const startTime = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderTime = performance.now() - startTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[${componentName}] Render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
      );
    }
  }, deps);

  useEffect(() => {
    startTime.current = performance.now();
  });
}

/**
 * Preload component for better perceived performance
 */
export function preloadComponent(importFunc: () => Promise<any>) {
  // Start loading the component immediately
  importFunc();
}

/**
 * Batch multiple state updates together
 * Reduces re-renders
 */
export function batchUpdates(updates: Array<() => void>) {
  // In React 18+, updates are automatically batched
  // This function maintains compatibility with older versions
  updates.forEach((update) => update());
}

/**
 * Check if user prefers reduced motion
 * Useful for respecting accessibility preferences
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get device performance class
 * Useful for conditionally enabling features based on device capability
 */
export function getDevicePerformance(): "high" | "medium" | "low" {
  if (typeof window === "undefined") return "medium";

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;

  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;

  // Check connection speed
  const connection = (navigator as any).connection;
  const effectiveType = connection?.effectiveType || "4g";

  if (cores >= 8 && memory >= 8 && effectiveType === "4g") {
    return "high";
  }

  if (cores >= 4 && memory >= 4) {
    return "medium";
  }

  return "low";
}

/**
 * Lazy load images with IntersectionObserver
 */
export function lazyLoadImage(
  img: HTMLImageElement,
  src: string,
  options: IntersectionObserverInit = {}
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  }, options);

  observer.observe(img);
}

/**
 * Request idle callback wrapper with fallback
 */
export function requestIdleCallback(callback: () => void, options?: { timeout?: number }) {
  if (typeof window === "undefined") {
    callback();
    return;
  }

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(id: number) {
  if (typeof window === "undefined") return;

  if ("cancelIdleCallback" in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}
