import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBudgetSchema } from "@/lib/validation/schemas";
import { validateBody, errorResponse } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";
import {
  withErrorHandler,
  assertAuthorized,
  assertExists,
  NotFoundError,
} from "@/lib/errors/apiErrors";

export const dynamic = 'force-dynamic';

// GET /api/budgets - List all budgets
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const session = await auth();
  assertAuthorized(!!session?.user?.id, "Please sign in to view budgets");

  // Get user's households
  const households = await prisma.householdMember.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      householdId: true,
    },
  });

  const householdIds = households.map((h) => h.householdId);

  const budgets = await prisma.budget.findMany({
    where: {
      householdId: {
        in: householdIds,
      },
    },
    include: {
      items: {
        include: {
          category: true,
        },
      },
      household: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const response = NextResponse.json({ budgets });

  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.query);
  for (const [key, value] of Object.entries(rateLimitHeaders)) {
    response.headers.set(key, value);
  }

  return response;
});

// POST /api/budgets - Create a new budget
export const POST = withErrorHandler(async (request: NextRequest) => {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.mutation);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const session = await auth();
  assertAuthorized(!!session?.user?.id, "Please sign in to create a budget");

  // Validate and sanitize request body
  const validated = await validateBody(request, createBudgetSchema);
  const { householdId, name, methodology, periodType, startDate, items } = validated;

  // Verify user is member of household
  const membership = await prisma.householdMember.findUnique({
    where: {
      householdId_userId: {
        householdId,
        userId: session.user.id,
      },
    },
  });

  assertExists(membership, "Household");

  // Create budget with items
  const budget = await prisma.budget.create({
    data: {
      householdId,
      name,
      methodology,
      periodType,
      startDate: new Date(startDate),
      items: {
        create: items,
      },
    },
    include: {
      items: {
        include: {
          category: true,
        },
      },
    },
  });

  const response = NextResponse.json(budget, { status: 201 });

  // Add rate limit headers
  const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.mutation);
  for (const [key, value] of Object.entries(rateLimitHeaders)) {
    response.headers.set(key, value);
  }

  return response;
});
