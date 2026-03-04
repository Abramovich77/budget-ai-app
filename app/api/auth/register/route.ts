import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation/schemas";
import { validateBody, errorResponse } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";
import { logRequest, logResponse, logError } from "@/lib/middleware/logger";
import { logAuthEvent, AuditEventType, getIpFromHeaders } from "@/lib/audit/auditLogger";
import { withErrorHandler, ConflictError, successResponses } from "@/lib/errors/apiErrors";

export const dynamic = 'force-dynamic';

export const POST = withErrorHandler(async (request: NextRequest) => {
  const startTime = Date.now();
  const requestId = logRequest(request);

  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
  if (rateLimitResponse) {
    logResponse(requestId, 429, Date.now() - startTime);
    return rateLimitResponse;
  }
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
      throw new ConflictError("User with this email already exists");
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

    // Log response
    logResponse(requestId, 201, Date.now() - startTime);

    return successResponses.created(
      { user },
      "User created successfully"
    );
});
