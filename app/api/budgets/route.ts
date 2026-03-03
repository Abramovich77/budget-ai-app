import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBudgetSchema } from "@/lib/validation/schemas";
import { validateBody, errorResponse } from "@/lib/validation/validate";

export const dynamic = 'force-dynamic';

// GET /api/budgets - List all budgets
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

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

    return NextResponse.json({ budgets });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error fetching budgets:", error);
    return errorResponse("Internal server error", 500);
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Unauthorized", 401);
    }

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

    if (!membership) {
      return errorResponse("Household not found or you are not a member", 404);
    }

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

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    console.error("Error creating budget:", error);
    return errorResponse("Internal server error", 500);
  }
}
