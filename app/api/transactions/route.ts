import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import {
  createTransactionSchema,
  transactionQuerySchema,
} from "@/lib/validation/schemas";
import { validateBody, validateQuery, errorResponse } from "@/lib/validation/validate";
import { rateLimit, RATE_LIMITS, getRateLimitHeaders } from "@/lib/middleware/rateLimit";
import { logRequest, logResponse, logError } from "@/lib/middleware/logger";
import { logDataModification, getIpFromHeaders } from "@/lib/audit/auditLogger";

export const dynamic = 'force-dynamic';

// GET /api/transactions - List all transactions
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = logRequest(request);
  let session;

  // Apply rate limiting for query endpoints
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.query);
  if (rateLimitResponse) {
    logResponse(requestId, 429, Date.now() - startTime);
    return rateLimitResponse;
  }

  try {
    session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    // Validate query parameters
    const { searchParams } = new URL(request.url);
    const query = validateQuery(searchParams, transactionQuerySchema);
    const { limit, offset, categoryId, accountId, minAmount, maxAmount, startDate, endDate, search } = query as {
      limit: number;
      offset: number;
      categoryId?: string;
      accountId?: string;
      minAmount?: number;
      maxAmount?: number;
      startDate?: string;
      endDate?: string;
      search?: string;
    };

    // Build where clause with filters
    const where: Prisma.TransactionWhereInput = {
      account: {
        userId: session.user.id,
      },
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (accountId) {
      where.accountId = accountId;
    }

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {};
      if (minAmount !== undefined) {
        where.amount.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.amount.lte = maxAmount;
      }
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { merchantName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: true,
        account: {
          select: {
            accountName: true,
            bankName: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.transaction.count({ where });

    const response = NextResponse.json({
      transactions,
      total,
      limit,
      offset,
    });

    // Add rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.query);
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
    logError(request, error as Error, { requestId, userId: session?.user?.id });
    console.error("Error fetching transactions:", error);
    return errorResponse("Internal server error", 500);
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = logRequest(request);
  let session;

  // Apply rate limiting for mutation endpoints
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.mutation);
  if (rateLimitResponse) {
    logResponse(requestId, 429, Date.now() - startTime);
    return rateLimitResponse;
  }

  try {
    session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

    // Validate and sanitize request body
    const validated = await validateBody(request, createTransactionSchema);
    const { accountId, categoryId, amount, date, description, merchantName } = validated;

    // Verify the account belongs to the user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    });

    if (!account) {
      return errorResponse("Account not found or does not belong to you", 404);
    }

    // If no category provided, try AI categorization
    let finalCategoryId = categoryId;
    let aiCategorized = false;
    let aiConfidence = null;

    if (!categoryId && description) {
      try {
        const aiResponse = await fetch(
          `${process.env.NEXTAUTH_URL}/api/ai/categorize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              description,
              amount,
              merchant: merchantName,
            }),
          }
        );

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();

          // Find category by name
          const category = await prisma.category.findFirst({
            where: {
              name: aiResult.category,
              isSystem: true,
            },
          });

          if (category) {
            finalCategoryId = category.id;
            aiCategorized = true;
            aiConfidence = aiResult.confidence;
          }
        }
      } catch (err) {
        console.error("AI categorization failed:", err);
        // Continue without AI categorization
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        accountId,
        categoryId: finalCategoryId,
        amount,
        date: new Date(date),
        description,
        merchantName,
        aiCategorized,
        aiConfidence,
      },
      include: {
        category: true,
        account: {
          select: {
            accountName: true,
          },
        },
      },
    });

    // Log transaction creation
    await logDataModification(
      "CREATE",
      session.user.id,
      session.user.email || undefined,
      "Transaction",
      transaction.id,
      {
        amount: amount.toString(),
        description,
        categoryId: finalCategoryId,
        aiCategorized,
      },
      getIpFromHeaders(request.headers)
    );

    const response = NextResponse.json(transaction, { status: 201 });

    // Add rate limit headers
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.mutation);
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
    logError(request, error as Error, { requestId, userId: session?.user?.id });
    console.error("Error creating transaction:", error);
    return errorResponse("Internal server error", 500);
  }
}
