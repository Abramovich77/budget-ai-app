import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation/schemas";
import { validateBody, errorResponse } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";
import { logRequest, logResponse, logError } from "@/lib/middleware/logger";
import { logAuthEvent, AuditEventType, getIpFromHeaders } from "@/lib/audit/auditLogger";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = logRequest(request);

  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
  if (rateLimitResponse) {
    logResponse(requestId, 429, Date.now() - startTime);
    return rateLimitResponse;
  }

  try {
    // Validate and sanitize request body
    const validated = await validateBody(request, registerSchema);
    const { fullName, email, password } = validated;

    const ipAddress = getIpFromHeaders(request.headers);
    const userAgent = request.headers.get("user-agent") || undefined;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Log failed registration attempt
      await logAuthEvent(
        AuditEventType.AUTH_REGISTER,
        undefined,
        email,
        ipAddress,
        userAgent,
        "FAILURE",
        "User with this email already exists"
      );
      return errorResponse("User with this email already exists", 409);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
      },
    });

    // Log successful registration
    await logAuthEvent(
      AuditEventType.AUTH_REGISTER,
      user.id,
      user.email,
      ipAddress,
      userAgent,
      "SUCCESS"
    );

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );

    // Add rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.auth);
    for (const [key, value] of Object.entries(rateLimitHeaders)) {
      response.headers.set(key, value);
    }

    // Add request ID header
    response.headers.set("X-Request-Id", requestId);

    // Log response
    logResponse(requestId, response.status, Date.now() - startTime);

    return response;
  } catch (error) {
    if (error instanceof NextResponse) {
      logResponse(requestId, error.status, Date.now() - startTime);
      return error;
    }
    logError(request, error as Error, { requestId });
    console.error("Registration error:", error);
    return errorResponse("Internal server error", 500);
  }
}
