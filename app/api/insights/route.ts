/**
 * AI Insights API
 *
 * Generate and retrieve AI-powered financial insights.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInsights, sortInsightsBySeverity } from "@/lib/ai/insights";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";
import { withErrorHandler } from "@/lib/errors/apiErrors";

export const dynamic = "force-dynamic";

/**
 * GET /api/insights
 *
 * Generate AI insights based on user's financial data
 */
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Rate limiting (AI endpoint)
  const rateLimitResponse = rateLimit(request, RATE_LIMITS.ai);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // In production, fetch real data from database
    // For now, use mock data
    const mockTransactions = [
      {
        id: "1",
        amount: -124.5,
        date: "2026-03-03",
        description: "Whole Foods Market",
        category: "Groceries",
        merchant: "Whole Foods",
      },
      {
        id: "2",
        amount: 5000.0,
        date: "2026-03-01",
        description: "Payroll Deposit",
        category: "Income",
        merchant: "Acme Corp",
      },
      {
        id: "3",
        amount: -15.99,
        date: "2026-03-01",
        description: "Netflix Subscription",
        category: "Entertainment",
        merchant: "Netflix",
      },
      {
        id: "4",
        amount: -45.3,
        date: "2026-02-28",
        description: "Shell Gas Station",
        category: "Transportation",
        merchant: "Shell",
      },
      {
        id: "5",
        amount: -350.0,
        date: "2026-02-27",
        description: "Amazon Purchase",
        category: "Shopping",
        merchant: "Amazon",
      },
    ];

    const mockBudgets = [
      { category: "Groceries", allocated: 600, spent: 450, remaining: 150 },
      { category: "Dining Out", allocated: 300, spent: 280, remaining: 20 },
      { category: "Transportation", allocated: 400, spent: 320, remaining: 80 },
      { category: "Entertainment", allocated: 200, spent: 180, remaining: 20 },
      { category: "Shopping", allocated: 300, spent: 350, remaining: -50 },
    ];

    // Generate insights
    const insights = await generateInsights(mockTransactions, mockBudgets, session.user.id);

    // Sort by severity
    const sortedInsights = sortInsightsBySeverity(insights);

    return NextResponse.json({
      success: true,
      insights: sortedInsights,
      count: sortedInsights.length,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json(
      {
        error: "Failed to generate insights",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
});
