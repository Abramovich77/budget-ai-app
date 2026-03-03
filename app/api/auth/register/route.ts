import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation/schemas";
import { validateBody, errorResponse } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }


  try {
    // Validate and sanitize request body
    const validated = await validateBody(request, registerSchema);
    const { fullName, email, password } = validated;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
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

    return response;
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Registration error:", error);
    return errorResponse("Internal server error", 500);
  }
}
