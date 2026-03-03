/**
 * API Request Logger
 *
 * Logs API requests for monitoring, analytics, and debugging.
 * Tracks request details, response status, timing, and errors.
 */

import { NextRequest, NextResponse } from "next/server";

/**
 * Log levels for different types of messages
 */
export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

/**
 * API request log entry
 */
export interface ApiLogEntry {
  timestamp: string;
  level: LogLevel;
  method: string;
  path: string;
  query?: string;
  status?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  userId?: string;
  error?: string;
  requestId: string;
}

/**
 * In-memory log storage (in production, use database or external service)
 */
class LogStore {
  private logs: ApiLogEntry[] = [];
  private maxLogs = 10000; // Keep last 10k logs
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Cleanup old logs every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);
  }

  add(log: ApiLogEntry): void {
    this.logs.push(log);

    // Trim if exceeds max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  getAll(): ApiLogEntry[] {
    return [...this.logs];
  }

  getByLevel(level: LogLevel): ApiLogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  getByPath(path: string): ApiLogEntry[] {
    return this.logs.filter((log) => log.path === path);
  }

  getByUser(userId: string): ApiLogEntry[] {
    return this.logs.filter((log) => log.userId === userId);
  }

  getRecent(count: number = 100): ApiLogEntry[] {
    return this.logs.slice(-count);
  }

  getErrors(): ApiLogEntry[] {
    return this.logs.filter((log) => log.level === LogLevel.ERROR || (log.status && log.status >= 400));
  }

  /**
   * Get analytics summary
   */
  getAnalytics() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const recentLogs = this.logs.filter(
      (log) => new Date(log.timestamp).getTime() > oneHourAgo
    );

    const dailyLogs = this.logs.filter(
      (log) => new Date(log.timestamp).getTime() > oneDayAgo
    );

    // Calculate metrics
    const totalRequests = this.logs.length;
    const hourlyRequests = recentLogs.length;
    const dailyRequests = dailyLogs.length;

    const errorCount = this.logs.filter(
      (log) => log.level === LogLevel.ERROR || (log.status && log.status >= 400)
    ).length;

    const avgDuration =
      this.logs.reduce((sum, log) => sum + (log.duration || 0), 0) / (this.logs.length || 1);

    // Status code distribution
    const statusCodes: Record<number, number> = {};
    this.logs.forEach((log) => {
      if (log.status) {
        statusCodes[log.status] = (statusCodes[log.status] || 0) + 1;
      }
    });

    // Endpoint popularity
    const endpoints: Record<string, number> = {};
    this.logs.forEach((log) => {
      endpoints[log.path] = (endpoints[log.path] || 0) + 1;
    });

    // Sort endpoints by popularity
    const topEndpoints = Object.entries(endpoints)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    return {
      totalRequests,
      hourlyRequests,
      dailyRequests,
      errorCount,
      errorRate: totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0,
      avgDuration: Math.round(avgDuration),
      statusCodes,
      topEndpoints,
    };
  }

  clear(): void {
    this.logs = [];
  }

  private cleanup(): void {
    // Remove logs older than 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.logs = this.logs.filter(
      (log) => new Date(log.timestamp).getTime() > sevenDaysAgo
    );
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Global log store instance
export const logStore = new LogStore();

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract client IP from request
 */
function getClientIp(request: NextRequest): string | undefined {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

/**
 * Log API request
 */
export function logRequest(
  request: NextRequest,
  level: LogLevel = LogLevel.INFO,
  additionalData?: Partial<ApiLogEntry>
): string {
  const requestId = generateRequestId();

  const logEntry: ApiLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    method: request.method,
    path: request.nextUrl.pathname,
    query: request.nextUrl.search || undefined,
    ip: getClientIp(request),
    userAgent: request.headers.get("user-agent") || undefined,
    requestId,
    ...additionalData,
  };

  logStore.add(logEntry);

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    const logMessage = `[${level}] ${logEntry.method} ${logEntry.path}${
      logEntry.query || ""
    } ${logEntry.status || ""} ${logEntry.duration ? `${logEntry.duration}ms` : ""}`;

    if (level === LogLevel.ERROR) {
      console.error(logMessage, logEntry.error || "");
    } else if (level === LogLevel.WARN) {
      console.warn(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  return requestId;
}

/**
 * Update log entry with response details
 */
export function logResponse(
  requestId: string,
  status: number,
  duration: number
): void {
  const logs = logStore.getAll();
  const logEntry = logs.find((log) => log.requestId === requestId);

  if (logEntry) {
    logEntry.status = status;
    logEntry.duration = duration;

    // Update level based on status
    if (status >= 500) {
      logEntry.level = LogLevel.ERROR;
    } else if (status >= 400) {
      logEntry.level = LogLevel.WARN;
    }
  }
}

/**
 * Log error
 */
export function logError(
  request: NextRequest,
  error: Error | string,
  additionalData?: Partial<ApiLogEntry>
): void {
  logRequest(request, LogLevel.ERROR, {
    error: error instanceof Error ? error.message : error,
    ...additionalData,
  });
}

/**
 * Middleware wrapper to automatically log requests
 */
export function withLogging<T>(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = logRequest(request);

    try {
      const response = await handler(request);
      const duration = Date.now() - startTime;

      logResponse(requestId, response.status, duration);

      // Add request ID to response headers for debugging
      response.headers.set("X-Request-Id", requestId);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      logError(request, error as Error, {
        requestId,
        duration,
        status: 500,
      });

      throw error;
    }
  };
}

/**
 * Get log analytics for admin dashboard
 */
export function getLogAnalytics() {
  return logStore.getAnalytics();
}

/**
 * Get recent logs for admin dashboard
 */
export function getRecentLogs(count: number = 100) {
  return logStore.getRecent(count);
}

/**
 * Get error logs for admin dashboard
 */
export function getErrorLogs() {
  return logStore.getErrors();
}
