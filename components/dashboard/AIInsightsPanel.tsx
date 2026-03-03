"use client";

import { memo } from "react";
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb } from "lucide-react";
import type { AIInsight } from "@/types";

interface AIInsightsPanelProps {
  insights?: AIInsight[];
}

// Mock AI insights - in production these would come from Claude API
const mockInsights: AIInsight[] = [
  {
    id: "1",
    householdId: "mock",
    insightType: "spending_alert",
    title: "Dining Out Spending Up 40%",
    description: "You're spending 40% more on dining out this month compared to last month. At this rate, you'll exceed your food budget by $280.",
    severity: "warning",
    actionable: true,
    actionText: "Adjust budget or reduce dining out",
    createdAt: new Date(),
  },
  {
    id: "2",
    householdId: "mock",
    insightType: "savings_opportunity",
    title: "Save $150 on Subscriptions",
    description: "You have 3 subscriptions you haven't used in 30 days: Netflix ($15.99), Spotify Premium ($9.99), and Adobe Creative Cloud ($54.99).",
    severity: "info",
    actionable: true,
    actionText: "Review and cancel unused subscriptions",
    createdAt: new Date(),
  },
  {
    id: "3",
    householdId: "mock",
    insightType: "goal_progress",
    title: "Emergency Fund on Track",
    description: "Great work! You're 65% toward your emergency fund goal. At your current savings rate, you'll reach your $10,000 target by October 2026.",
    severity: "info",
    actionable: false,
    createdAt: new Date(),
  },
  {
    id: "4",
    householdId: "mock",
    insightType: "trend_analysis",
    title: "Grocery Spending Optimized",
    description: "Your grocery spending is down 15% from last month while maintaining healthy purchases. You're saving an average of $45/week by shopping at Whole Foods on Wednesdays.",
    severity: "info",
    actionable: false,
    createdAt: new Date(),
  },
];

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    textColor: "text-red-900 dark:text-red-100",
  },
  warning: {
    icon: TrendingUp,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    textColor: "text-yellow-900 dark:text-yellow-100",
  },
  info: {
    icon: Lightbulb,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-900 dark:text-blue-100",
  },
};

function AIInsightsPanelComponent({ insights = mockInsights }: AIInsightsPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Financial Insights
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Personalized recommendations powered by AI
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const config = severityConfig[insight.severity];
          const Icon = config.icon;

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <h3 className={`font-semibold ${config.textColor} mb-1`}>
                    {insight.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {insight.description}
                  </p>
                  {insight.actionable && insight.actionText && (
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {insight.actionText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          View all insights →
        </button>
      </div>
    </div>
  );
}

// Memoized to prevent re-renders when insights haven't changed
export const AIInsightsPanel = memo(AIInsightsPanelComponent);
