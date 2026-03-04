/**
 * Advanced AI Insights Generator
 *
 * Provides sophisticated spending analysis and recommendations
 * based on patterns, trends, and behavioral analysis
 */

import { AIInsight, TransactionData, BudgetData, InsightSeverity } from "./insights";

/**
 * Generate a unique insight ID
 */
function generateId(): string {
  return `insight_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Analyze category spending patterns over time
 */
export function analyzeCategoryPatterns(transactions: TransactionData[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Group transactions by category
  const categorySpending: Record<string, number[]> = {};

  transactions.forEach((tx) => {
    if (tx.category && tx.amount < 0) {
      if (!categorySpending[tx.category]) {
        categorySpending[tx.category] = [];
      }
      categorySpending[tx.category].push(Math.abs(tx.amount));
    }
  });

  // Analyze each category
  Object.entries(categorySpending).forEach(([category, amounts]) => {
    if (amounts.length < 3) return;

    const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);
    const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);

    // High variance indicates inconsistent spending
    if (stdDev / avg > 0.5) {
      insights.push({
        id: generateId(),
        type: "category-analysis",
        severity: "info",
        title: `Inconsistent ${category} Spending`,
        description: `Your ${category} spending varies significantly (${min.toFixed(0)} to ${max.toFixed(0)}), averaging $${avg.toFixed(2)}.`,
        recommendation: `Consider setting a consistent ${category} budget of $${Math.ceil(avg * 1.2)} to account for variability.`,
        impact: `More predictable budgeting can help you save $${(avg * 0.1 * 12).toFixed(0)}/year.`,
        actionable: true,
        actionUrl: "/budgets",
        confidence: 0.8,
        createdAt: new Date(),
        metadata: { category, avg, stdDev, variance: stdDev / avg },
      });
    }
  });

  return insights;
}

/**
 * Analyze day-of-week spending patterns
 */
export function analyzeDayOfWeekPatterns(transactions: TransactionData[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Group expenses by day of week
  const daySpending: number[] = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
  const dayCounts: number[] = [0, 0, 0, 0, 0, 0, 0];

  transactions.forEach((tx) => {
    if (tx.amount < 0) {
      const date = new Date(tx.date);
      const dayOfWeek = date.getDay();
      daySpending[dayOfWeek] += Math.abs(tx.amount);
      dayCounts[dayOfWeek]++;
    }
  });

  const avgByDay = daySpending.map((total, i) => dayCounts[i] > 0 ? total / dayCounts[i] : 0);
  const maxDay = avgByDay.indexOf(Math.max(...avgByDay));
  const minDay = avgByDay.indexOf(Math.min(...avgByDay.filter(v => v > 0)));
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (avgByDay[maxDay] > avgByDay[minDay] * 2 && dayCounts[maxDay] > 2) {
    insights.push({
      id: generateId(),
      type: "spending-trend",
      severity: "info",
      title: `Higher Spending on ${days[maxDay]}s`,
      description: `You spend an average of $${avgByDay[maxDay].toFixed(2)} on ${days[maxDay]}s, significantly more than other days.`,
      recommendation: `Plan ${days[maxDay]} activities in advance and set a daily spending limit to control costs.`,
      impact: `Reducing ${days[maxDay]} spending by 20% could save $${(avgByDay[maxDay] * 0.2 * 52).toFixed(0)}/year.`,
      actionable: true,
      actionUrl: "/reports",
      confidence: 0.75,
      createdAt: new Date(),
      metadata: { highestDay: days[maxDay], avgSpending: avgByDay[maxDay] },
    });
  }

  return insights;
}

/**
 * Identify merchant concentration and loyalty opportunities
 */
export function analyzeMerchantLoyalty(transactions: TransactionData[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Group by merchant
  const merchantSpending: Record<string, { count: number; total: number }> = {};

  transactions.forEach((tx) => {
    if (tx.merchant && tx.amount < 0) {
      if (!merchantSpending[tx.merchant]) {
        merchantSpending[tx.merchant] = { count: 0, total: 0 };
      }
      merchantSpending[tx.merchant].count++;
      merchantSpending[tx.merchant].total += Math.abs(tx.amount);
    }
  });

  // Find top merchants
  const topMerchants = Object.entries(merchantSpending)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 3);

  topMerchants.forEach(([merchant, data]) => {
    if (data.count >= 3 && data.total >= 100) {
      insights.push({
        id: generateId(),
        type: "savings-opportunity",
        severity: "info",
        title: `Frequent ${merchant} Shopper`,
        description: `You've spent $${data.total.toFixed(2)} at ${merchant} over ${data.count} transactions.`,
        recommendation: `Check if ${merchant} offers loyalty programs, credit card rewards, or bulk discounts.`,
        impact: `Loyalty rewards could save you 2-5% ($${(data.total * 0.03).toFixed(2)}) on future purchases.`,
        actionable: false,
        confidence: 0.7,
        createdAt: new Date(),
        metadata: { merchant, totalSpent: data.total, transactionCount: data.count },
      });
    }
  });

  return insights;
}

/**
 * Calculate and recommend emergency fund target
 */
export function analyzeEmergencyFund(
  transactions: TransactionData[],
  currentSavings?: number
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Calculate average monthly expenses
  const expenses = transactions.filter((tx) => tx.amount < 0);
  if (expenses.length === 0) return insights;

  const totalExpenses = expenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const monthsOfData = Math.max(1, new Date().getMonth() + 1);
  const avgMonthlyExpenses = totalExpenses / monthsOfData;

  // Recommended emergency fund: 3-6 months of expenses
  const recommendedMin = avgMonthlyExpenses * 3;
  const recommendedMax = avgMonthlyExpenses * 6;
  const savings = currentSavings || 0;

  if (savings < recommendedMin) {
    const shortfall = recommendedMin - savings;
    const monthsToGoal = Math.ceil(shortfall / (avgMonthlyExpenses * 0.2)); // Assume 20% savings rate

    insights.push({
      id: generateId(),
      type: "goal-recommendation",
      severity: savings < avgMonthlyExpenses ? "warning" : "info",
      title: "Emergency Fund Below Target",
      description: `Your emergency fund should cover 3-6 months of expenses ($${recommendedMin.toFixed(0)}-${recommendedMax.toFixed(0)}). Current: $${savings.toFixed(0)}.`,
      recommendation: `Set aside $${(shortfall / 12).toFixed(0)}/month to reach your goal in ${monthsToGoal} months.`,
      impact: "A proper emergency fund protects you from unexpected expenses and financial stress.",
      actionable: true,
      actionUrl: "/goals",
      confidence: 0.9,
      createdAt: new Date(),
      metadata: {
        currentSavings: savings,
        recommendedMin,
        recommendedMax,
        shortfall,
        monthsToGoal,
      },
    });
  }

  return insights;
}

/**
 * Predict seasonal spending patterns
 */
export function analyzeSeasonalPatterns(transactions: TransactionData[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Group by month
  const monthlySpending: number[] = new Array(12).fill(0);
  const monthlyCounts: number[] = new Array(12).fill(0);

  transactions.forEach((tx) => {
    if (tx.amount < 0) {
      const month = new Date(tx.date).getMonth();
      monthlySpending[month] += Math.abs(tx.amount);
      monthlyCounts[month]++;
    }
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Find high spending months
  const avgByMonth = monthlySpending.map((total, i) =>
    monthlyCounts[i] > 0 ? total / monthlyCounts[i] : 0
  );

  const currentMonth = new Date().getMonth();
  const nextMonth = (currentMonth + 1) % 12;

  // Predict next month based on historical data
  if (avgByMonth[nextMonth] > 0 && monthlyCounts[nextMonth] > 0) {
    const nextMonthAvg = avgByMonth[nextMonth];
    const currentMonthAvg = avgByMonth[currentMonth] || avgByMonth.reduce((a, b) => a + b, 0) / avgByMonth.filter(v => v > 0).length;

    if (nextMonthAvg > currentMonthAvg * 1.2) {
      insights.push({
        id: generateId(),
        type: "seasonal-pattern",
        severity: "warning",
        title: `Higher Spending Expected in ${months[nextMonth]}`,
        description: `Based on historical data, ${months[nextMonth]} spending averages $${nextMonthAvg.toFixed(0)}, 20% higher than usual.`,
        recommendation: `Start budgeting now for ${months[nextMonth]} expenses. Consider setting aside an extra $${(nextMonthAvg - currentMonthAvg).toFixed(0)}.`,
        impact: "Planning ahead prevents budget overruns and financial stress.",
        actionable: true,
        actionUrl: "/budgets",
        confidence: 0.75,
        createdAt: new Date(),
        metadata: {
          nextMonth: months[nextMonth],
          expectedSpending: nextMonthAvg,
          increase: nextMonthAvg - currentMonthAvg,
        },
      });
    }
  }

  return insights;
}

/**
 * Analyze subscription and recurring cost optimization
 */
export function analyzeSubscriptionOptimization(transactions: TransactionData[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // Identify potential subscriptions (small, regular amounts)
  const merchantFrequency: Record<string, TransactionData[]> = {};

  transactions.forEach((tx) => {
    if (tx.merchant && tx.amount < 0 && Math.abs(tx.amount) < 100) {
      if (!merchantFrequency[tx.merchant]) {
        merchantFrequency[tx.merchant] = [];
      }
      merchantFrequency[tx.merchant].push(tx);
    }
  });

  // Find subscriptions (3+ transactions with similar amounts)
  const subscriptions = Object.entries(merchantFrequency).filter(([_, txs]) => {
    if (txs.length < 3) return false;

    const amounts = txs.map((t) => Math.abs(t.amount));
    const avg = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
    const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - avg, 2), 0) / amounts.length;

    // Low variance indicates recurring payment
    return variance / avg < 0.1;
  });

  if (subscriptions.length >= 3) {
    const totalMonthly = subscriptions.reduce((total, [_, txs]) => {
      const avg = txs.reduce((sum, t) => sum + Math.abs(t.amount), 0) / txs.length;
      return total + avg;
    }, 0);

    insights.push({
      id: generateId(),
      type: "cost-optimization",
      severity: "info",
      title: "Multiple Subscriptions Detected",
      description: `You have ${subscriptions.length} active subscriptions costing approximately $${totalMonthly.toFixed(2)}/month.`,
      recommendation: "Review all subscriptions and cancel unused services. Consider annual plans for frequently used services to save 10-20%.",
      impact: `Eliminating just one subscription could save $${(totalMonthly / subscriptions.length * 12).toFixed(0)}/year.`,
      actionable: true,
      actionUrl: "/transactions",
      confidence: 0.8,
      createdAt: new Date(),
      metadata: {
        subscriptionCount: subscriptions.length,
        estimatedMonthly: totalMonthly,
      },
    });
  }

  return insights;
}

/**
 * Generate all advanced insights
 */
export function generateAdvancedInsights(
  transactions: TransactionData[],
  budgets: BudgetData[],
  currentSavings?: number
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Run all analysis functions
  insights.push(...analyzeCategoryPatterns(transactions));
  insights.push(...analyzeDayOfWeekPatterns(transactions));
  insights.push(...analyzeMerchantLoyalty(transactions));
  insights.push(...analyzeEmergencyFund(transactions, currentSavings));
  insights.push(...analyzeSeasonalPatterns(transactions));
  insights.push(...analyzeSubscriptionOptimization(transactions));

  return insights;
}
