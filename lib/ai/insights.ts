/**
 * AI Insights Generator
 *
 * Analyzes financial data to generate intelligent insights and recommendations.
 */

import Anthropic from "@anthropic-ai/sdk";

/**
 * Insight types
 */
export type InsightType =
  | "spending-trend"
  | "budget-alert"
  | "savings-opportunity"
  | "unusual-transaction"
  | "category-analysis"
  | "goal-recommendation"
  | "seasonal-pattern"
  | "cost-optimization";

/**
 * Insight severity levels
 */
export type InsightSeverity = "info" | "warning" | "critical";

/**
 * AI Insight structure
 */
export interface AIInsight {
  id: string;
  type: InsightType;
  severity: InsightSeverity;
  title: string;
  description: string;
  recommendation?: string;
  impact?: string;
  actionable: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  confidence: number;
  createdAt: Date;
}

/**
 * Transaction data for analysis
 */
export interface TransactionData {
  id: string;
  amount: number;
  date: string;
  description: string;
  category?: string;
  merchant?: string;
}

/**
 * Budget data for analysis
 */
export interface BudgetData {
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
}

/**
 * Generate AI insights from financial data
 */
export async function generateInsights(
  transactions: TransactionData[],
  budgets: BudgetData[],
  userId: string
): Promise<AIInsight[]> {
  const insights: AIInsight[] = [];

  // Generate rule-based insights (fast, no AI needed)
  insights.push(...generateRuleBasedInsights(transactions, budgets));

  // Generate AI-powered insights (slower, more intelligent)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const aiInsights = await generateAIInsights(transactions, budgets);
      insights.push(...aiInsights);
    } catch (error) {
      console.error("Failed to generate AI insights:", error);
      // Continue with rule-based insights only
    }
  }

  return insights;
}

/**
 * Generate rule-based insights (deterministic)
 */
function generateRuleBasedInsights(
  transactions: TransactionData[],
  budgets: BudgetData[]
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Check for budget overruns
  for (const budget of budgets) {
    const percentUsed = (budget.spent / budget.allocated) * 100;

    if (percentUsed >= 100) {
      insights.push({
        id: generateId(),
        type: "budget-alert",
        severity: "critical",
        title: `${budget.category} Budget Exceeded`,
        description: `You've spent $${budget.spent.toFixed(2)} of your $${budget.allocated.toFixed(2)} ${budget.category} budget.`,
        recommendation: `Consider reducing ${budget.category} spending or adjusting your budget allocation.`,
        impact: `You're $${(budget.spent - budget.allocated).toFixed(2)} over budget this period.`,
        actionable: true,
        actionUrl: "/budgets",
        confidence: 1.0,
        createdAt: new Date(),
        metadata: { category: budget.category, overrun: budget.spent - budget.allocated },
      });
    } else if (percentUsed >= 90) {
      insights.push({
        id: generateId(),
        type: "budget-alert",
        severity: "warning",
        title: `${budget.category} Budget Nearly Exhausted`,
        description: `You've used ${percentUsed.toFixed(0)}% of your ${budget.category} budget.`,
        recommendation: `You have $${budget.remaining.toFixed(2)} remaining. Plan carefully for the rest of the period.`,
        actionable: true,
        actionUrl: "/budgets",
        confidence: 1.0,
        createdAt: new Date(),
        metadata: { category: budget.category, percentUsed },
      });
    }
  }

  // Check for unusual transactions (large amounts)
  const avgTransaction = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactions.length;
  const largeTransactions = transactions.filter((t) => Math.abs(t.amount) > avgTransaction * 3);

  if (largeTransactions.length > 0) {
    const largestTx = largeTransactions.reduce((max, t) => (Math.abs(t.amount) > Math.abs(max.amount) ? t : max));

    insights.push({
      id: generateId(),
      type: "unusual-transaction",
      severity: "info",
      title: "Large Transaction Detected",
      description: `A transaction of $${Math.abs(largestTx.amount).toFixed(2)} at ${largestTx.merchant || largestTx.description} is significantly above your average.`,
      recommendation: "Review this transaction to ensure it's expected.",
      actionable: true,
      actionUrl: "/transactions",
      confidence: 0.85,
      createdAt: new Date(),
      metadata: { transactionId: largestTx.id, amount: largestTx.amount },
    });
  }

  // Analyze spending trends
  const last30Days = transactions.filter((t) => {
    const txDate = new Date(t.date);
    const daysAgo = (Date.now() - txDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo <= 30;
  });

  const previous30Days = transactions.filter((t) => {
    const txDate = new Date(t.date);
    const daysAgo = (Date.now() - txDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysAgo > 30 && daysAgo <= 60;
  });

  if (last30Days.length > 0 && previous30Days.length > 0) {
    const currentSpending = last30Days.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const previousSpending = previous30Days.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const change = ((currentSpending - previousSpending) / previousSpending) * 100;

    if (Math.abs(change) > 20) {
      insights.push({
        id: generateId(),
        type: "spending-trend",
        severity: change > 0 ? "warning" : "info",
        title: `Spending ${change > 0 ? "Increased" : "Decreased"} by ${Math.abs(change).toFixed(0)}%`,
        description: `Your spending this month ($${currentSpending.toFixed(2)}) is ${Math.abs(change).toFixed(0)}% ${change > 0 ? "higher" : "lower"} than last month.`,
        recommendation:
          change > 0
            ? "Review your recent transactions to identify areas where you can reduce spending."
            : "Great job! Keep up the good spending habits.",
        actionable: true,
        actionUrl: "/reports",
        confidence: 0.9,
        createdAt: new Date(),
        metadata: { currentSpending, previousSpending, changePercent: change },
      });
    }
  }

  // Identify savings opportunities
  const recurringTransactions = identifyRecurringTransactions(transactions);
  if (recurringTransactions.length > 0) {
    const totalRecurring = recurringTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    insights.push({
      id: generateId(),
      type: "savings-opportunity",
      severity: "info",
      title: "Recurring Expenses Identified",
      description: `You have ${recurringTransactions.length} recurring expenses totaling $${totalRecurring.toFixed(2)} per month.`,
      recommendation: "Review these subscriptions and services to identify potential savings.",
      impact: `Reducing just 10% could save you $${(totalRecurring * 0.1).toFixed(2)}/month or $${(totalRecurring * 0.1 * 12).toFixed(2)}/year.`,
      actionable: true,
      actionUrl: "/transactions",
      confidence: 0.75,
      createdAt: new Date(),
      metadata: { recurringCount: recurringTransactions.length, totalAmount: totalRecurring },
    });
  }

  return insights;
}

/**
 * Generate AI-powered insights using Claude
 */
async function generateAIInsights(
  transactions: TransactionData[],
  budgets: BudgetData[]
): Promise<AIInsight[]> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return [];
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Prepare data summary for AI
  const transactionSummary = summarizeTransactions(transactions);
  const budgetSummary = summarizeBudgets(budgets);

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are a financial advisor AI. Analyze this financial data and provide 2-3 actionable insights.

Transaction Summary (last 30 days):
${transactionSummary}

Budget Status:
${budgetSummary}

Provide insights in this JSON format:
[
  {
    "type": "spending-trend|savings-opportunity|category-analysis|cost-optimization",
    "severity": "info|warning|critical",
    "title": "Brief title",
    "description": "Detailed description",
    "recommendation": "Specific action to take",
    "impact": "Potential benefit or consequence"
  }
]

Focus on actionable, specific insights. Be concise and practical.`,
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse AI response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }

    const aiInsights = JSON.parse(jsonMatch[0]);

    return aiInsights.map(
      (insight: any): AIInsight => ({
        id: generateId(),
        type: insight.type || "category-analysis",
        severity: insight.severity || "info",
        title: insight.title,
        description: insight.description,
        recommendation: insight.recommendation,
        impact: insight.impact,
        actionable: true,
        confidence: 0.8,
        createdAt: new Date(),
      })
    );
  } catch (error) {
    console.error("AI insight generation failed:", error);
    return [];
  }
}

/**
 * Summarize transactions for AI analysis
 */
function summarizeTransactions(transactions: TransactionData[]): string {
  const categoryTotals: Record<string, number> = {};
  let totalSpending = 0;

  for (const tx of transactions) {
    const category = tx.category || "Uncategorized";
    categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(tx.amount);
    totalSpending += Math.abs(tx.amount);
  }

  const summary = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => `- ${category}: $${amount.toFixed(2)} (${((amount / totalSpending) * 100).toFixed(0)}%)`)
    .join("\n");

  return `Total Spending: $${totalSpending.toFixed(2)}
Top Categories:
${summary}
Transaction Count: ${transactions.length}`;
}

/**
 * Summarize budgets for AI analysis
 */
function summarizeBudgets(budgets: BudgetData[]): string {
  return budgets
    .map(
      (b) =>
        `- ${b.category}: $${b.spent.toFixed(2)} / $${b.allocated.toFixed(2)} (${((b.spent / b.allocated) * 100).toFixed(0)}%)`
    )
    .join("\n");
}

/**
 * Identify recurring transactions
 */
function identifyRecurringTransactions(transactions: TransactionData[]): TransactionData[] {
  const merchantGroups: Record<string, TransactionData[]> = {};

  // Group by merchant
  for (const tx of transactions) {
    const key = tx.merchant || tx.description;
    if (!merchantGroups[key]) {
      merchantGroups[key] = [];
    }
    merchantGroups[key].push(tx);
  }

  // Find merchants with 3+ transactions
  const recurring: TransactionData[] = [];
  for (const [merchant, txs] of Object.entries(merchantGroups)) {
    if (txs.length >= 3) {
      // Add the most recent transaction from this merchant
      const latest = txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      recurring.push(latest);
    }
  }

  return recurring;
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Filter insights by severity
 */
export function filterInsightsBySeverity(insights: AIInsight[], severity: InsightSeverity): AIInsight[] {
  return insights.filter((i) => i.severity === severity);
}

/**
 * Filter insights by type
 */
export function filterInsightsByType(insights: AIInsight[], type: InsightType): AIInsight[] {
  return insights.filter((i) => i.type === type);
}

/**
 * Get actionable insights only
 */
export function getActionableInsights(insights: AIInsight[]): AIInsight[] {
  return insights.filter((i) => i.actionable);
}

/**
 * Sort insights by severity (critical first)
 */
export function sortInsightsBySeverity(insights: AIInsight[]): AIInsight[] {
  const severityOrder: Record<InsightSeverity, number> = {
    critical: 3,
    warning: 2,
    info: 1,
  };

  return [...insights].sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
}
