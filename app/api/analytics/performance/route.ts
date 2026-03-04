/**
 * Performance Analytics API
 *
 * Endpoint for receiving performance metrics from the client.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";
import {
  withErrorHandler,
  successResponses,
  BadRequestError,
} from "@/lib/errors/apiErrors";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics/performance
 *
 * Receive performance metrics from clients
 */
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.mutation);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const body = await request.json();
  const { metrics } = body;

  if (!Array.isArray(metrics)) {
    throw new BadRequestError("Metrics must be an array");
  }

  if (metrics.length === 0) {
    throw new BadRequestError("Metrics array cannot be empty");
  }

  // In production, you would:
  // 1. Store metrics in database
  // 2. Send to analytics service (e.g., Google Analytics, Mixpanel, PostHog)
  // 3. Aggregate metrics for dashboards

  // For now, just log in development
  if (process.env.NODE_ENV === "development") {
    console.log("Received performance metrics:", {
      count: metrics.length,
      types: [...new Set(metrics.map((m: any) => m.type))],
      sample: metrics.slice(0, 3),
    });
  }

  // TODO: Store metrics in database
  // await prisma.performanceMetric.createMany({ data: metrics });

  // TODO: Send to analytics service
  // await analyticsService.track(metrics);

  return successResponses.ok({
    received: metrics.length,
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/analytics/performance
 *
 * Get aggregated performance metrics (admin only)
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // TODO: Add authentication check
  // const session = await auth();
  // assertAuthorized(!!session?.user?.isAdmin, "Admin access required");

  // TODO: Query aggregated metrics from database
  // const metrics = await prisma.performanceMetric.aggregate({
  //   _avg: { value: true },
  //   _max: { value: true },
  //   _min: { value: true },
  //   where: {
  //     timestamp: { gte: oneDayAgo }
  //   },
  //   by: ['type', 'name']
  // });

  // Return mock data for now
  return successResponses.ok({
    metrics: {
      pageLoad: {
        avg: 1250,
        p50: 1100,
        p95: 2300,
        p99: 3500,
      },
      apiCall: {
        avg: 320,
        p50: 280,
        p95: 650,
        p99: 1200,
      },
      webVitals: {
        LCP: { avg: 1800, threshold: 2500 },
        FID: { avg: 45, threshold: 100 },
        CLS: { avg: 0.08, threshold: 0.1 },
      },
    },
    timestamp: new Date().toISOString(),
  });
});
