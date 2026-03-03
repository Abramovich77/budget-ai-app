import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createBudgetSchema = z.object({
  householdId: z.string(),
  name: z.string().min(1),
  methodology: z.enum(["zero-based", "50-30-20", "envelope"]),
  periodType: z.enum(["weekly", "monthly", "annual"]).default("monthly"),
  startDate: z.string(),
  items: z.array(
    z.object({
      categoryId: z.string(),
      allocatedAmount: z.number().positive(),
    })
  ),
});

// GET /api/budgets - List all budgets
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.error("Error fetching budgets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createBudgetSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { householdId, name, methodology, periodType, startDate, items } =
      validated.data;

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
      return NextResponse.json(
        { error: "Household not found" },
        { status: 404 }
      );
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
    console.error("Error creating budget:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
