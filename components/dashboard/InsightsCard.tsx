/**
 * Insights Card Component
 *
 * Displays AI-generated financial insights with severity indicators and actions.
 */

"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  DollarSign,
  Target,
  Calendar,
  Sparkles,
  ChevronRight,
  X,
  RefreshCw,
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

/**
 * Insight type from API
 */
interface AIInsight {
  id: string;
  type: string;
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  recommendation?: string;
  impact?: string;
  actionable: boolean;
  actionUrl?: string;
  confidence: number;
  createdAt: string;
}

/**
 * Insights Card Props
 */
interface InsightsCardProps {
  maxInsights?: number;
  showActions?: boolean;
  className?: string;
  filterType?: string;
  filterSeverity?: string;
  searchQuery?: string;
}

export function InsightsCard({
  maxInsights = 5,
  showActions = true,
  className = "",
  filterType = "all",
  filterSeverity = "all",
  searchQuery = "",
}: InsightsCardProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());

  // Fetch insights
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/insights");
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data.insights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (insightId: string) => {
    setDismissedInsights((prev) => new Set([...prev, insightId]));
    // TODO: Send dismiss event to API for tracking
  };

  const handleRefresh = () => {
    setDismissedInsights(new Set());
    fetchInsights();
  };

  // Filter dismissed insights and apply type/severity/search filters
  const visibleInsights = insights
    .filter((insight) => !dismissedInsights.has(insight.id))
    .filter((insight) => filterType === "all" || insight.type === filterType)
    .filter((insight) => filterSeverity === "all" || insight.severity === filterSeverity)
    .filter((insight) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        insight.title.toLowerCase().includes(query) ||
        insight.description.toLowerCase().includes(query) ||
        (insight.recommendation && insight.recommendation.toLowerCase().includes(query)) ||
        (insight.impact && insight.impact.toLowerCase().includes(query))
      );
    })
    .slice(0, maxInsights);

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Insights
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Insights
          </h2>
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (visibleInsights.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Insights
          </h2>
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
        <EmptyState
          icon={Sparkles}
          title="No Insights Yet"
          description="Your AI insights will appear here once you have more financial data."
        />
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Insights
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            ({visibleInsights.length})
          </span>
        </h2>
        <button
          onClick={handleRefresh}
          className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
          title="Refresh insights"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {visibleInsights.map((insight) => (
          <InsightItem
            key={insight.id}
            insight={insight}
            showActions={showActions}
            onDismiss={handleDismiss}
          />
        ))}
      </div>

      {insights.length > maxInsights && (
        <div className="mt-4 text-center">
          <Link
            href="/insights"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
          >
            View All Insights ({insights.length})
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Individual Insight Item
 */
interface InsightItemProps {
  insight: AIInsight;
  showActions: boolean;
  onDismiss: (id: string) => void;
}

function InsightItem({ insight, showActions, onDismiss }: InsightItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get severity styles
  const severityStyles = {
    critical: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      badge: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      badge: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      badge: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200",
    },
  }[insight.severity];

  // Get type icon
  const TypeIcon = {
    "spending-trend": TrendingUp,
    "budget-alert": AlertTriangle,
    "savings-opportunity": PiggyBank,
    "unusual-transaction": DollarSign,
    "category-analysis": TrendingDown,
    "goal-recommendation": Target,
    "seasonal-pattern": Calendar,
    "cost-optimization": DollarSign,
  }[insight.type] || Sparkles;

  return (
    <div className={`${severityStyles.bg} border ${severityStyles.border} rounded-lg p-4 transition-all`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${severityStyles.icon}`}>
            <TypeIcon className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {insight.title}
              </h3>
              <span className={`${severityStyles.badge} text-xs px-2 py-0.5 rounded-full uppercase font-medium`}>
                {insight.severity}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {insight.description}
            </p>

            {isExpanded && (
              <div className="space-y-2 mt-3">
                {insight.recommendation && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Recommendation:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-300">
                      {insight.recommendation}
                    </span>
                  </div>
                )}

                {insight.impact && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Impact:
                    </span>{" "}
                    <span className="text-gray-600 dark:text-gray-300">
                      {insight.impact}
                    </span>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Confidence: {(insight.confidence * 100).toFixed(0)}%
                </div>
              </div>
            )}

            {showActions && (insight.recommendation || insight.impact) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium mt-2"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}

            {showActions && insight.actionUrl && (
              <Link
                href={insight.actionUrl}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium mt-2"
              >
                Take Action
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        {showActions && (
          <button
            onClick={() => onDismiss(insight.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
