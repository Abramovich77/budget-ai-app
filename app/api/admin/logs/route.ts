/**
 * Admin API endpoint for viewing logs and analytics
 */

import { NextRequest, NextResponse } from "next/server";
import { getLogAnalytics, getRecentLogs, getErrorLogs } from "@/lib/middleware/logger";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";
import {
  withErrorHandler,
  successResponses,
  BadRequestError,
} from "@/lib/errors/apiErrors";

/**
 * GET /api/admin/logs
 *
 * Get logs and analytics
 * Query params:
 * - type: "recent" | "errors" | "analytics" (default: "analytics")
 * - limit: number (for recent logs, default: 100, max: 1000)
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
  const type = searchParams.get("type") || "analytics";

  // Validate type parameter
  const validTypes = ["recent", "errors", "analytics"] as const;
  type LogType = typeof validTypes[number];

  if (!validTypes.includes(type as LogType)) {
    throw new BadRequestError(
      `Invalid type parameter. Must be one of: ${validTypes.join(", ")}`
    );
  }

  // Validate and parse limit parameter
  let limit = 100; // Default limit
  const limitParam = searchParams.get("limit");

  if (limitParam) {
    const parsedLimit = parseInt(limitParam, 10);

    if (isNaN(parsedLimit)) {
      throw new BadRequestError("Invalid limit parameter. Must be a number");
    }

    if (parsedLimit < 1) {
      throw new BadRequestError("Invalid limit parameter. Must be at least 1");
    }

    if (parsedLimit > 1000) {
      throw new BadRequestError("Invalid limit parameter. Maximum is 1000");
    }

    limit = parsedLimit;
  }

  // Fetch data based on type
  let data: unknown;

  switch (type) {
    case "recent":
      data = getRecentLogs(limit);
      break;

    case "errors":
      data = getErrorLogs();
      break;

    case "analytics":
      data = getLogAnalytics();
      break;

    default:
      // TypeScript should prevent this, but just in case
      throw new BadRequestError(`Unsupported log type: ${type}`);
  }

  return successResponses.ok({
    type,
    data,
    timestamp: new Date().toISOString(),
  });
});
