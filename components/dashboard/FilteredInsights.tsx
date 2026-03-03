"use client";

import { useState } from "react";
import { InsightsCard } from "./InsightsCard";
import { Filter, X } from "lucide-react";

type InsightType =
  | "all"
  | "spending-trend"
  | "budget-alert"
  | "savings-opportunity"
  | "unusual-transaction"
  | "category-analysis"
  | "goal-recommendation"
  | "seasonal-pattern"
  | "cost-optimization";

type InsightSeverity = "all" | "info" | "warning" | "critical";

const insightTypes: { value: InsightType; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "spending-trend", label: "Spending Trends" },
  { value: "budget-alert", label: "Budget Alerts" },
  { value: "savings-opportunity", label: "Savings" },
  { value: "unusual-transaction", label: "Unusual" },
  { value: "category-analysis", label: "Categories" },
  { value: "goal-recommendation", label: "Goals" },
  { value: "seasonal-pattern", label: "Seasonal" },
  { value: "cost-optimization", label: "Optimization" },
];

const severityLevels: { value: InsightSeverity; label: string; color: string }[] = [
  { value: "all", label: "All Levels", color: "gray" },
  { value: "critical", label: "Critical", color: "red" },
  { value: "warning", label: "Warning", color: "yellow" },
  { value: "info", label: "Info", color: "blue" },
];

export function FilteredInsights() {
  const [selectedType, setSelectedType] = useState<InsightType>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<InsightSeverity>("all");
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = selectedType !== "all" || selectedSeverity !== "all";

  const clearFilters = () => {
    setSelectedType("all");
    setSelectedSeverity("all");
  };

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
              Clear filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 animate-fade-in">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Insight Type
              </label>
              <div className="flex flex-wrap gap-2">
                {insightTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition ${
                      selectedType === type.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Severity Level
              </label>
              <div className="flex flex-wrap gap-2">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedSeverity(level.value)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition inline-flex items-center gap-2 ${
                      selectedSeverity === level.value
                        ? level.value === "critical"
                          ? "bg-red-600 text-white"
                          : level.value === "warning"
                          ? "bg-yellow-600 text-white"
                          : level.value === "info"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {level.value !== "all" && (
                      <div
                        className={`w-2 h-2 rounded-full ${
                          level.color === "red"
                            ? "bg-red-300"
                            : level.color === "yellow"
                            ? "bg-yellow-300"
                            : level.color === "blue"
                            ? "bg-blue-300"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Showing:</span>
            {selectedType !== "all" && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded">
                {insightTypes.find((t) => t.value === selectedType)?.label}
              </span>
            )}
            {selectedSeverity !== "all" && (
              <span
                className={`px-2 py-1 rounded ${
                  selectedSeverity === "critical"
                    ? "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200"
                    : selectedSeverity === "warning"
                    ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200"
                    : "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200"
                }`}
              >
                {severityLevels.find((s) => s.value === selectedSeverity)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Insights Display */}
      <InsightsCard
        maxInsights={20}
        filterType={selectedType}
        filterSeverity={selectedSeverity}
      />
    </div>
  );
}
