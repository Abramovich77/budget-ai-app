/**
 * Admin API endpoint for viewing audit logs
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, getAuditStats, AuditEventType } from "@/lib/audit/auditLogger";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";

/**
 * GET /api/admin/audit
 *
 * Get audit logs and statistics
 * Query params:
 * - type: "logs" | "stats"
 * - userId: Filter by user ID
 * - eventType: Filter by event type
 * - resourceType: Filter by resource type
 * - startDate: ISO date string
 * - endDate: ISO date string
 * - limit: number (default 100)
 * - offset: number (default 0)
 */
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // TODO: Add admin authentication middleware
    // For now, this is a basic implementation for development

    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type") || "logs";

    if (type === "stats") {
      const stats = await getAuditStats();
      return NextResponse.json({
        success: true,
        stats,
        timestamp: new Date().toISOString(),
      });
    }

    // Get logs with filters
    const filters: any = {};

    const userId = searchParams.get("userId");
    if (userId) filters.userId = userId;

    const eventType = searchParams.get("eventType");
    if (eventType && Object.values(AuditEventType).includes(eventType as AuditEventType)) {
      filters.eventType = eventType as AuditEventType;
    }

    const resourceType = searchParams.get("resourceType");
    if (resourceType) filters.resourceType = resourceType;

    const startDate = searchParams.get("startDate");
    if (startDate) filters.startDate = new Date(startDate);

    const endDate = searchParams.get("endDate");
    if (endDate) filters.endDate = new Date(endDate);

    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    filters.limit = Math.min(limit, 500); // Max 500
    filters.offset = Math.max(offset, 0);

    const result = await getAuditLogs(filters);

    return NextResponse.json({
      success: true,
      logs: result.logs,
      total: result.total,
      limit: filters.limit,
      offset: filters.offset,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch audit logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
