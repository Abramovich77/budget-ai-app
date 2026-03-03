/**
 * Admin API endpoint for viewing logs and analytics
 */

import { NextRequest, NextResponse } from "next/server";
import { getLogAnalytics, getRecentLogs, getErrorLogs } from "@/lib/middleware/logger";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";

/**
 * GET /api/admin/logs
 *
 * Get logs and analytics
 * Query params:
 * - type: "recent" | "errors" | "analytics"
 * - limit: number (for recent logs)
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") || "analytics";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    // In production, you'd add authentication here
    // For now, this is a basic implementation
    // TODO: Add admin authentication middleware

    let data;

    switch (type) {
      case "recent":
        data = getRecentLogs(limit);
        break;

      case "errors":
        data = getErrorLogs();
        break;

      case "analytics":
      default:
        data = getLogAnalytics();
        break;
    }

    return NextResponse.json({
      success: true,
      type,
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
