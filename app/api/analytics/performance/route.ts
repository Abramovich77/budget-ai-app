/**
 * Performance Analytics API
 *
 * Endpoint for receiving performance metrics from the client.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics/performance
 *
 * Receive performance metrics from clients
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.mutation);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { metrics } = body;

    if (!Array.isArray(metrics)) {
      return NextResponse.json(
        { error: "Invalid metrics format" },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      received: metrics.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing performance metrics:", error);
    return NextResponse.json(
      {
        error: "Failed to process metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/performance
 *
 * Get aggregated performance metrics (admin only)
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // TODO: Add authentication check
    // const session = await auth();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

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
    return NextResponse.json({
      success: true,
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
  } catch (error) {
    console.error("Error fetching performance metrics:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
