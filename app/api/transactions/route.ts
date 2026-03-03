import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = 'force-dynamic';

const createTransactionSchema = z.object({
  accountId: z.string(),
  categoryId: z.string().optional(),
  amount: z.number(),
  date: z.string(),
  description: z.string().optional(),
  merchantName: z.string().optional(),
});

// GET /api/transactions - List all transactions
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const transactions = await prisma.transaction.findMany({
      where: {
        account: {
          userId: session.user.id,
        },
      },
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

    const total = await prisma.transaction.count({
      where: {
        account: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createTransactionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    const { accountId, categoryId, amount, date, description, merchantName } =
      validated.data;

    // Verify the account belongs to the user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
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

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
