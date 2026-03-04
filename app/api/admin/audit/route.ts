/**
 * Admin API endpoint for viewing audit logs
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, getAuditStats, AuditEventType } from "@/lib/audit/auditLogger";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";
import {
  withErrorHandler,
  successResponses,
  BadRequestError,
} from "@/lib/errors/apiErrors";

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
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // TODO: Add admin authentication middleware
  // const session = await auth();
  // assertAuthorized(!!session?.user?.isAdmin, "Admin access required");

  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "logs";

  // Validate type parameter
  if (type !== "logs" && type !== "stats") {
    throw new BadRequestError("Invalid type parameter. Must be 'logs' or 'stats'");
  }

  if (type === "stats") {
    const stats = await getAuditStats();
    return successResponses.ok({
      stats,
      timestamp: new Date().toISOString(),
    });
  }

  // Get logs with filters
  interface AuditFilters {
    userId?: string;
    eventType?: AuditEventType;
    resourceType?: string;
    startDate?: Date;
    endDate?: Date;
    limit: number;
    offset: number;
  }

  const filters: AuditFilters = {
    limit: 100,
    offset: 0,
  };

  const userId = searchParams.get("userId");
  if (userId) filters.userId = userId;

  const eventType = searchParams.get("eventType");
  if (eventType) {
    if (!Object.values(AuditEventType).includes(eventType as AuditEventType)) {
      throw new BadRequestError(`Invalid eventType. Must be one of: ${Object.values(AuditEventType).join(", ")}`);
    }
    filters.eventType = eventType as AuditEventType;
  }

  const resourceType = searchParams.get("resourceType");
  if (resourceType) filters.resourceType = resourceType;

  const startDate = searchParams.get("startDate");
  if (startDate) {
    const parsed = new Date(startDate);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestError("Invalid startDate format. Must be ISO date string");
    }
    filters.startDate = parsed;
  }

  const endDate = searchParams.get("endDate");
  if (endDate) {
    const parsed = new Date(endDate);
    if (isNaN(parsed.getTime())) {
      throw new BadRequestError("Invalid endDate format. Must be ISO date string");
    }
    filters.endDate = parsed;
  }

  const limitParam = searchParams.get("limit");
  if (limitParam) {
    const limit = parseInt(limitParam, 10);
    if (isNaN(limit) || limit < 1) {
      throw new BadRequestError("Invalid limit. Must be a positive number");
    }
    filters.limit = Math.min(limit, 500); // Max 500
  }

  const offsetParam = searchParams.get("offset");
  if (offsetParam) {
    const offset = parseInt(offsetParam, 10);
    if (isNaN(offset) || offset < 0) {
      throw new BadRequestError("Invalid offset. Must be a non-negative number");
    }
    filters.offset = offset;
  }

  const result = await getAuditLogs(filters);

  return successResponses.ok({
    logs: result.logs,
    total: result.total,
    limit: filters.limit,
    offset: filters.offset,
    timestamp: new Date().toISOString(),
  });
});
