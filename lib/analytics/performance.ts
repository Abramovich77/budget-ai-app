/**
 * Performance Monitoring
 *
 * Track performance metrics, web vitals, and user interactions.
 */

/**
 * Performance metric types
 */
export type MetricType =
  | "page-load"
  | "api-call"
  | "component-render"
  | "user-interaction"
  | "navigation"
  | "web-vital";

/**
 * Web Vitals metric names
 */
export type WebVitalMetric = "CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "INP";

/**
 * Performance entry
 */
export interface PerformanceEntry {
  id: string;
  type: MetricType;
  name: string;
  value: number;
  unit: "ms" | "score" | "bytes" | "count";
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Performance monitoring configuration
 */
interface PerformanceConfig {
  enabled: boolean;
  sampleRate: number; // 0-1, percentage of events to track
  endpoint?: string; // API endpoint to send metrics
  batchSize: number; // Number of metrics to batch before sending
  flushInterval: number; // Interval to flush metrics (ms)
}

/**
 * Performance monitor class
 */
class PerformanceMonitor {
  private config: PerformanceConfig;
  private metrics: PerformanceEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private observers: PerformanceObserver[] = [];

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      enabled: process.env.NODE_ENV === "production",
      sampleRate: 0.1, // Track 10% of events by default
      batchSize: 20,
      flushInterval: 30000, // 30 seconds
      ...config,
    };

    if (this.config.enabled && typeof window !== "undefined") {
      this.init();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private init(): void {
    // Set up flush interval
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);

    // Monitor web vitals
    this.observeWebVitals();

    // Monitor navigation timing
    this.observeNavigationTiming();

    // Monitor resource timing
    this.observeResourceTiming();

    // Clean up on page unload
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.flush();
        this.cleanup();
      });
    }
  }

  /**
   * Check if event should be sampled
   */
  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track a performance metric
   */
  track(
    type: MetricType,
    name: string,
    value: number,
    unit: PerformanceEntry["unit"] = "ms",
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enabled || !this.shouldSample()) {
      return;
    }

    const entry: PerformanceEntry = {
      id: this.generateId(),
      type,
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(entry);

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${type}:${name} = ${value}${unit}`, metadata);
    }

    // Flush if batch size reached
    if (this.metrics.length >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Track page load time
   */
  trackPageLoad(pageName: string): void {
    if (typeof window === "undefined" || !window.performance) return;

    const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    const domInteractive = navigation.domInteractive - navigation.fetchStart;

    this.track("page-load", pageName, loadTime, "ms", {
      domContentLoaded,
      domInteractive,
      transferSize: navigation.transferSize,
    });
  }

  /**
   * Track API call performance
   */
  trackApiCall(endpoint: string, duration: number, status: number, method: string = "GET"): void {
    this.track("api-call", endpoint, duration, "ms", {
      status,
      method,
      success: status >= 200 && status < 300,
    });
  }

  /**
   * Track component render time
   */
  trackComponentRender(componentName: string, duration: number, phase: "mount" | "update" = "mount"): void {
    this.track("component-render", componentName, duration, "ms", { phase });
  }

  /**
   * Track user interaction
   */
  trackInteraction(action: string, target: string, metadata?: Record<string, any>): void {
    this.track("user-interaction", action, 1, "count", {
      target,
      ...metadata,
    });
  }

  /**
   * Track navigation between pages
   */
  trackNavigation(from: string, to: string, duration: number): void {
    this.track("navigation", `${from} -> ${to}`, duration, "ms");
  }

  /**
   * Observe Web Vitals metrics
   */
  private observeWebVitals(): void {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          this.track("web-vital", "LCP", lastEntry.renderTime || lastEntry.loadTime, "ms");
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.track("web-vital", "FID", entry.processingStart - entry.startTime, "ms");
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);

      // Report CLS on visibility change
      if (typeof document !== "undefined") {
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            this.track("web-vital", "CLS", clsValue, "score");
          }
        });
      }
    } catch (e) {
      // CLS not supported
    }
  }

  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    if (typeof window === "undefined" || !window.performance) return;

    window.addEventListener("load", () => {
      const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (!navigation) return;

      // Time to First Byte (TTFB)
      const ttfb = navigation.responseStart - navigation.requestStart;
      this.track("web-vital", "TTFB", ttfb, "ms");

      // First Contentful Paint (FCP)
      const paintEntries = window.performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find((entry) => entry.name === "first-contentful-paint");
      if (fcpEntry) {
        this.track("web-vital", "FCP", fcpEntry.startTime, "ms");
      }
    });
  }

  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          // Track slow resources (>1s)
          if (entry.duration > 1000) {
            this.track("page-load", `slow-resource:${entry.name}`, entry.duration, "ms", {
              type: entry.initiatorType,
              size: entry.transferSize,
            });
          }
        });
      });
      resourceObserver.observe({ entryTypes: ["resource"] });
      this.observers.push(resourceObserver);
    } catch (e) {
      // Resource timing not supported
    }
  }

  /**
   * Flush metrics to storage/endpoint
   */
  private async flush(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      if (this.config.endpoint) {
        // Send to analytics endpoint
        await fetch(this.config.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ metrics: metricsToSend }),
          keepalive: true,
        });
      } else {
        // Store in local storage for development
        if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
          const stored = localStorage.getItem("performance-metrics");
          const existing = stored ? JSON.parse(stored) : [];
          localStorage.setItem("performance-metrics", JSON.stringify([...existing, ...metricsToSend]));
        }
      }
    } catch (error) {
      console.error("Failed to flush performance metrics:", error);
      // Put metrics back if send failed
      this.metrics.unshift(...metricsToSend);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceEntry[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * Clean up observers and timers
   */
  cleanup(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Global instance
let performanceMonitor: PerformanceMonitor | null = null;

/**
 * Get or create performance monitor instance
 */
export function getPerformanceMonitor(config?: Partial<PerformanceConfig>): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor(config);
  }
  return performanceMonitor;
}

/**
 * Quick access functions
 */
export const perf = {
  trackPageLoad: (pageName: string) => getPerformanceMonitor().trackPageLoad(pageName),
  trackApiCall: (endpoint: string, duration: number, status: number, method?: string) =>
    getPerformanceMonitor().trackApiCall(endpoint, duration, status, method),
  trackComponentRender: (componentName: string, duration: number, phase?: "mount" | "update") =>
    getPerformanceMonitor().trackComponentRender(componentName, duration, phase),
  trackInteraction: (action: string, target: string, metadata?: Record<string, any>) =>
    getPerformanceMonitor().trackInteraction(action, target, metadata),
  trackNavigation: (from: string, to: string, duration: number) =>
    getPerformanceMonitor().trackNavigation(from, to, duration),
};

/**
 * React hook for component performance tracking
 */
export function usePerformanceTracking(componentName: string): void {
  if (typeof window === "undefined") return;

  const startTime = performance.now();

  // Track on mount
  React.useEffect(() => {
    const mountTime = performance.now() - startTime;
    perf.trackComponentRender(componentName, mountTime, "mount");

    return () => {
      // Could track unmount if needed
    };
  }, [componentName, startTime]);
}

// Note: React import is assumed to be available in the consuming component
declare const React: any;
