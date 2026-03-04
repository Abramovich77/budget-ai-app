/**
 * Rate limiting middleware to prevent API abuse
 * Uses sliding window algorithm with in-memory storage
 */

import { NextRequest, NextResponse } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
  requests: number[]; // Timestamps of requests for sliding window
}

// In-memory storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Custom key generator function (default: uses IP address)
   */
  keyGenerator?: (request: NextRequest) => string;

  /**
   * Skip rate limiting for certain conditions
   */
  skip?: (request: NextRequest) => boolean;

  /**
   * Custom error message
   */
  message?: string;
}

/**
 * Default rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
  // Strict limits for authentication endpoints
  auth: {
    maxRequests: 5,
    windowSeconds: 60 * 15, // 5 requests per 15 minutes
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },

  // Moderate limits for data modification endpoints
  mutation: {
    maxRequests: 30,
    windowSeconds: 60, // 30 requests per minute
    message: "Too many requests. Please slow down.",
  },

  // Relaxed limits for read-only endpoints
  query: {
    maxRequests: 60,
    windowSeconds: 60, // 60 requests per minute
    message: "Rate limit exceeded. Please try again in a minute.",
  },

  // Very strict limits for AI endpoints (expensive)
  ai: {
    maxRequests: 10,
    windowSeconds: 60, // 10 requests per minute
    message: "AI request limit exceeded. Please wait before trying again.",
  },
} as const;

/**
 * Get client identifier from request (IP address)
 */
function getClientKey(request: NextRequest): string {
  // Try to get real IP from headers (for proxy/load balancer scenarios)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip"); // Cloudflare

  const ip = forwardedFor?.split(",")[0] || realIp || cfConnectingIp || "unknown";

  return ip.trim();
}

/**
 * Apply rate limiting to a request
 * Returns null if allowed, or a NextResponse with 429 status if rate limited
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): NextResponse | null {
  // Check if we should skip rate limiting
  if (config.skip?.(request)) {
    return null;
  }

  // Get client identifier
  const clientKey = config.keyGenerator?.(request) || getClientKey(request);
  const key = `ratelimit:${clientKey}:${request.nextUrl.pathname}`;

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
      requests: [],
    };
    rateLimitStore.set(key, entry);
  }

  // Sliding window: remove requests outside the current window
  entry.requests = entry.requests.filter(
    (timestamp) => timestamp > now - windowMs
  );

  // Check if rate limit exceeded
  if (entry.requests.length >= config.maxRequests) {
    const oldestRequest = entry.requests[0];
    const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);

    return NextResponse.json(
      {
        error: config.message || "Rate limit exceeded",
        retryAfter,
        limit: config.maxRequests,
        window: config.windowSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": Math.ceil((oldestRequest + windowMs) / 1000).toString(),
        },
      }
    );
  }

  // Add current request to the window
  entry.requests.push(now);
  entry.count = entry.requests.length;

  // Update reset time
  entry.resetTime = now + windowMs;

  return null; // Allow request
}

/**
 * Get rate limit headers to include in successful responses
 */
export function getRateLimitHeaders(
  request: NextRequest,
  config: RateLimitConfig
): Record<string, string> {
  const clientKey = config.keyGenerator?.(request) || getClientKey(request);
  const key = `ratelimit:${clientKey}:${request.nextUrl.pathname}`;
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return {
      "X-RateLimit-Limit": config.maxRequests.toString(),
      "X-RateLimit-Remaining": config.maxRequests.toString(),
      "X-RateLimit-Reset": Math.ceil((Date.now() + config.windowSeconds * 1000) / 1000).toString(),
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.requests.length);

  return {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(entry.resetTime / 1000).toString(),
  };
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function withRateLimit<T extends (request: NextRequest, ...args: unknown[]) => Promise<NextResponse>>(
  handler: T,
  config: RateLimitConfig
): T {
  return (async (request: NextRequest, ...args: unknown[]) => {
    // Check rate limit
    const rateLimitResponse = rateLimit(request, config);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Call original handler
    const response = await handler(request, ...args);

    // Add rate limit headers to response
    const headers = getRateLimitHeaders(request, config);
    for (const [key, value] of Object.entries(headers)) {
      response.headers.set(key, value);
    }

    return response;
  }) as T;
}
