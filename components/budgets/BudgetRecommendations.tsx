"use client";

import { Lightbulb, TrendingUp, Target, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface BudgetData {
  totalAllocated: number;
  totalSpent: number;
  categories: BudgetCategory[];
}

interface Recommendation {
  id: string;
  type: "optimization" | "warning" | "opportunity" | "insight";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category?: string;
  suggestedAction?: string;
  potentialSavings?: number;
}

interface BudgetRecommendationsProps {
  budget: BudgetData;
}

/**
 * Generate AI-powered budget recommendations based on spending patterns
 */
function generateRecommendations(budget: BudgetData): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { categories, totalAllocated, totalSpent } = budget;

  // Analyze each category
  categories.forEach((category) => {
    const percentage = (category.spent / category.allocated) * 100;
    const remainingDays = 10; // Mock: days left in budget period
    const dailySpend = category.spent / 20; // Assuming 20 days have passed
    const projectedSpend = dailySpend * 31; // Full month projection

    // 1. Overspending categories
    if (percentage > 100) {
      const overspent = category.spent - category.allocated;
      recommendations.push({
        id: `overspend-${category.id}`,
        type: "warning",
        title: `${category.name} is Over Budget`,
        description: `You've exceeded your ${category.name} budget by $${overspent.toFixed(2)}. Consider reducing spending in this category or reallocating funds from underspent categories.`,
        impact: "high",
        category: category.name,
        suggestedAction: `Reduce ${category.name} spending by $${(overspent / remainingDays).toFixed(2)}/day to minimize overrun`,
      });
    }

    // 2. Categories projected to exceed budget
    else if (projectedSpend > category.allocated && percentage < 100) {
      const projectedOverage = projectedSpend - category.allocated;
      recommendations.push({
        id: `projection-${category.id}`,
        type: "warning",
        title: `${category.name} Trending Over Budget`,
        description: `At current pace, you'll exceed your ${category.name} budget by $${projectedOverage.toFixed(2)}. Consider slowing spending now.`,
        impact: "medium",
        category: category.name,
        suggestedAction: `Limit ${category.name} to $${((category.allocated - category.spent) / remainingDays).toFixed(2)}/day for remaining days`,
      });
    }

    // 3. Underspent categories (optimization opportunity)
    else if (percentage < 50 && category.spent > 0) {
      const underutilized = category.allocated - category.spent;
      if (underutilized > 100) {
        recommendations.push({
          id: `underutilized-${category.id}`,
          type: "opportunity",
          title: `${category.name} is Underutilized`,
          description: `You've only used ${percentage.toFixed(0)}% of your ${category.name} budget. Consider reallocating $${underutilized.toFixed(2)} to categories that need more funds.`,
          impact: "medium",
          category: category.name,
          suggestedAction: `Reallocate surplus to overspent or high-priority categories`,
          potentialSavings: underutilized,
        });
      }
    }

    // 4. Well-managed categories (positive feedback)
    else if (percentage >= 70 && percentage <= 90) {
      recommendations.push({
        id: `wellmanaged-${category.id}`,
        type: "insight",
        title: `${category.name} is Well-Managed`,
        description: `Great job! You're ${percentage.toFixed(0)}% through your ${category.name} budget with balanced spending.`,
        impact: "low",
        category: category.name,
      });
    }
  });

  // 5. Overall budget optimization
  const overallPercentage = (totalSpent / totalAllocated) * 100;
  if (overallPercentage < 60) {
    const totalUnderutilized = totalAllocated - totalSpent;
    recommendations.push({
      id: "overall-conservative",
      type: "insight",
      title: "Conservative Spending Detected",
      description: `You've only used ${overallPercentage.toFixed(0)}% of your total budget. You have $${totalUnderutilized.toFixed(2)} in unused funds that could be allocated to savings goals or investments.`,
      impact: "medium",
      suggestedAction: "Consider increasing savings contributions or investing surplus funds",
      potentialSavings: totalUnderutilized,
    });
  }

  // 6. Find categories to reallocate FROM and TO
  const overspentCategories = categories.filter(c => c.spent > c.allocated);
  const underspentCategories = categories.filter(c => c.spent < c.allocated * 0.7);

  if (overspentCategories.length > 0 && underspentCategories.length > 0) {
    const totalOverage = overspentCategories.reduce((sum, c) => sum + (c.spent - c.allocated), 0);
    const totalUnderused = underspentCategories.reduce((sum, c) => sum + (c.allocated - c.spent), 0);

    if (totalUnderused >= totalOverage) {
      recommendations.push({
        id: "reallocation-opportunity",
        type: "optimization",
        title: "Budget Reallocation Opportunity",
        description: `You can cover your $${totalOverage.toFixed(2)} overspending by reallocating from ${underspentCategories.map(c => c.name).join(", ")}. This would balance your budget without increasing spending.`,
        impact: "high",
        suggestedAction: `Move $${totalOverage.toFixed(2)} from underutilized categories to cover overages`,
      });
    }
  }

  // Sort by impact priority
  const impactOrder = { high: 0, medium: 1, low: 2 };
  return recommendations.sort((a, b) => impactOrder[a.impact] - impactOrder[b.impact]);
}

export function BudgetRecommendations({ budget }: BudgetRecommendationsProps) {
  const [recommendations] = useState<Recommendation[]>(() => generateRecommendations(budget));
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleRecommendations = recommendations.filter(r => !dismissedIds.has(r.id));

  const getIcon = (type: Recommendation["type"]) => {
    switch (type) {
      case "optimization": return Target;
      case "warning": return AlertCircle;
      case "opportunity": return TrendingUp;
      case "insight": return Lightbulb;
    }
  };

  const getColors = (type: Recommendation["type"]) => {
    switch (type) {
      case "optimization":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-900 dark:text-blue-100",
        };
      case "warning":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-900 dark:text-red-100",
        };
      case "opportunity":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-900 dark:text-green-100",
        };
      case "insight":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-200 dark:border-purple-800",
          icon: "text-purple-600 dark:text-purple-400",
          text: "text-purple-900 dark:text-purple-100",
        };
    }
  };

  const getImpactBadge = (impact: Recommendation["impact"]) => {
    const colors = {
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[impact]}`}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
      </span>
    );
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  if (visibleRecommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <Sparkles className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          Budget Looking Great!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No recommendations at this time. Keep up the excellent budget management!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            AI Budget Recommendations
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {visibleRecommendations.length} {visibleRecommendations.length === 1 ? "suggestion" : "suggestions"} to optimize your budget
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {visibleRecommendations.map((rec, index) => {
          const Icon = getIcon(rec.type);
          const colors = getColors(rec.type);

          return (
            <div
              key={rec.id}
              className={`${colors.bg} ${colors.border} border rounded-lg p-4 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${colors.icon} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={`font-semibold ${colors.text}`}>
                      {rec.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      {getImpactBadge(rec.impact)}
                      <button
                        onClick={() => handleDismiss(rec.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                        title="Dismiss"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p className={`text-sm ${colors.text} opacity-90 mb-2`}>
                    {rec.description}
                  </p>
                  {rec.suggestedAction && (
                    <div className="mt-2 p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                      <span className="font-medium">Suggested Action:</span> {rec.suggestedAction}
                    </div>
                  )}
                  {rec.potentialSavings !== undefined && (
                    <div className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
                      💰 Potential savings: ${rec.potentialSavings.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
