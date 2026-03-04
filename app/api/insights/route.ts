/**
 * AI Insights API
 *
 * Generate and retrieve AI-powered financial insights.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInsights, sortInsightsBySeverity } from "@/lib/ai/insights";
import { rateLimit, RATE_LIMITS } from "@/lib/middleware/rateLimit";
import { withErrorHandler, UnauthorizedError, successResponses } from "@/lib/errors/apiErrors";
import type { AIInsight } from "@/lib/types";

export const dynamic = "force-dynamic";

// Simple in-memory cache for insights
// Cache TTL: 5 minutes (insights don't need to be real-time)
const insightsCache = new Map<string, { insights: AIInsight[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of insightsCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      insightsCache.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

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
    throw new UnauthorizedError();
  }

  const userId = session.user.id;
  const cacheKey = `insights:${userId}`;

  // Check if we have a fresh cached result
  const cached = insightsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return successResponses.ok({
      insights: cached.insights,
      count: cached.insights.length,
      generatedAt: new Date(cached.timestamp).toISOString(),
      cached: true,
    });
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
    const insights = await generateInsights(mockTransactions, mockBudgets, userId);

    // Sort by severity
    const sortedInsights = sortInsightsBySeverity(insights);

    // Cache the result
    insightsCache.set(cacheKey, {
      insights: sortedInsights,
      timestamp: Date.now(),
    });

    return successResponses.ok({
      insights: sortedInsights,
      count: sortedInsights.length,
      generatedAt: new Date().toISOString(),
      cached: false,
    });
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error; // Let withErrorHandler handle the error
  }
});
