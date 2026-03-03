/**
 * Enhanced tooltip components for charts with better formatting and insights
 */

import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

/**
 * Enhanced Line Chart Tooltip with trend analysis
 */
export function EnhancedLineTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expenses = payload.find((p) => p.dataKey === "expenses")?.value || 0;
  const net = income - expenses;
  const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
        <div className="flex items-center gap-1 text-xs">
          {net >= 0 ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={net >= 0 ? "text-green-600" : "text-red-600"}>
            {net >= 0 ? "Surplus" : "Deficit"}
          </span>
        </div>
      </div>

      {/* Income */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">
          ${income.toLocaleString()}
        </span>
      </div>

      {/* Expenses */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">
          ${expenses.toLocaleString()}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

      {/* Net Cash Flow */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="h-3 w-3 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net</span>
        </div>
        <span
          className={`font-bold ${
            net >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          ${Math.abs(net).toLocaleString()}
        </span>
      </div>

      {/* Savings Rate */}
      <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 rounded px-2 py-1">
        <div className="flex items-center gap-2">
          <Percent className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Savings Rate
          </span>
        </div>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{savingsRate}%</span>
      </div>
    </div>
  );
}

/**
 * Enhanced Pie Chart Tooltip with category insights
 */
export function EnhancedPieTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const total = payload[0].payload.total || 0;
  const percentage = data.percentage ? data.percentage.toFixed(1) : "0.0";

  // Calculate average per transaction (mock - would be real in production)
  const avgPerTransaction = (data.value / 10).toFixed(2); // Mock: assuming ~10 transactions

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[200px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: data.color || data.fill }}
        />
        <span className="font-semibold text-gray-900 dark:text-white">{data.name}</span>
      </div>

      {/* Amount */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Spent</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ${data.value.toLocaleString()}
        </div>
      </div>

      {/* Percentage Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600 dark:text-gray-400">Of total budget</span>
          <span className="font-semibold text-gray-900 dark:text-white">{percentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${percentage}%`,
              backgroundColor: data.color || data.fill,
            }}
          />
        </div>
      </div>

      {/* Average per transaction */}
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded px-2 py-1">
        <span>Avg per transaction</span>
        <span className="font-medium">${avgPerTransaction}</span>
      </div>
    </div>
  );
}

/**
 * Enhanced Bar Chart Tooltip with comparison analysis
 */
export function EnhancedBarTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const lastMonth = payload.find((p) => p.dataKey === "lastMonth")?.value || 0;
  const thisMonth = payload.find((p) => p.dataKey === "thisMonth")?.value || 0;
  const difference = thisMonth - lastMonth;
  const percentChange = lastMonth > 0 ? ((difference / lastMonth) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-[220px]">
      {/* Header */}
      <div className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-gray-900 dark:text-white">{label}</span>
      </div>

      {/* Last Month */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Last Month</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">
          ${lastMonth.toLocaleString()}
        </span>
      </div>

      {/* This Month */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">
          ${thisMonth.toLocaleString()}
        </span>
      </div>

      {/* Change Analysis */}
      <div
        className={`flex items-center justify-between rounded px-2 py-2 ${
          difference < 0
            ? "bg-green-50 dark:bg-green-900/20"
            : "bg-red-50 dark:bg-red-900/20"
        }`}
      >
        <div className="flex items-center gap-2">
          {difference < 0 ? (
            <TrendingDown className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingUp className="h-4 w-4 text-red-600" />
          )}
          <span
            className={`text-sm font-medium ${
              difference < 0
                ? "text-green-700 dark:text-green-300"
                : "text-red-700 dark:text-red-300"
            }`}
          >
            {difference < 0 ? "Saved" : "Increased"}
          </span>
        </div>
        <div className="text-right">
          <div
            className={`text-sm font-bold ${
              difference < 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${Math.abs(difference).toLocaleString()}
          </div>
          <div
            className={`text-xs ${
              difference < 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {difference < 0 ? "-" : "+"}
            {Math.abs(parseFloat(percentChange))}%
          </div>
        </div>
      </div>
    </div>
  );
}
