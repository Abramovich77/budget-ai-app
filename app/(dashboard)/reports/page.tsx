"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, Calendar, PieChart as PieChartIcon } from "lucide-react";
import { useUserPreferences } from "@/lib/hooks/useLocalStorage";
import { useSpendingStats, useChartData } from "@/lib/hooks/useOptimizedData";
import type { PieChartDataPoint, LineChartDataPoint } from "@/types/forms";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportSpendingReportToCSV, exportCategoryBreakdownToCSV } from "@/lib/utils/export";
import { ChartContainer } from "@/components/charts/ChartContainer";
import { CustomLineTooltip, CustomPieTooltip, CustomBarTooltip } from "@/components/charts/CustomTooltip";
import { EnhancedLineTooltip, EnhancedPieTooltip, EnhancedBarTooltip } from "@/components/charts/EnhancedTooltip";
import { InteractiveLegend, CategoryLegend } from "@/components/charts/InteractiveLegend";

// Mock data for charts
const spendingTrendData = [
  { month: "Sep", income: 5000, expenses: 3200, savings: 1800 },
  { month: "Oct", income: 5200, expenses: 3400, savings: 1800 },
  { month: "Nov", income: 5000, expenses: 3600, savings: 1400 },
  { month: "Dec", income: 5500, expenses: 3800, savings: 1700 },
  { month: "Jan", income: 5000, expenses: 3300, savings: 1700 },
  { month: "Feb", income: 5200, expenses: 3500, savings: 1700 },
  { month: "Mar", income: 5000, expenses: 3250, savings: 1750 },
];

const categoryBreakdownData = [
  { name: "Groceries", value: 600, color: "#10b981" },
  { name: "Dining Out", value: 300, color: "#f59e0b" },
  { name: "Transportation", value: 400, color: "#3b82f6" },
  { name: "Entertainment", value: 200, color: "#8b5cf6" },
  { name: "Shopping", value: 350, color: "#ef4444" },
  { name: "Healthcare", value: 150, color: "#06b6d4" },
  { name: "Utilities", value: 250, color: "#84cc16" },
];

const monthlyComparisonData = [
  { category: "Groceries", lastMonth: 650, thisMonth: 600 },
  { category: "Dining", lastMonth: 350, thisMonth: 300 },
  { category: "Transport", lastMonth: 380, thisMonth: 400 },
  { category: "Entertainment", lastMonth: 180, thisMonth: 200 },
  { category: "Shopping", lastMonth: 300, thisMonth: 350 },
];

export default function ReportsPage() {
  const [preferences, setPreferences] = useUserPreferences();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [hiddenDataKeys, setHiddenDataKeys] = useState<Set<string>>(new Set());

  const handleTimeRangeChange = (value: string) => {
    setPreferences({
      ...preferences,
      reportsTimeRange: value as "3months" | "6months" | "year" | "all",
    });
  };

  // Use optimized spending stats calculation with memoization
  const spendingStats = useSpendingStats(
    useMemo(() => spendingTrendData.flatMap(d => [
      { amount: d.income, category: 'Income' },
      { amount: -d.expenses, category: 'Expenses' }
    ]), [])
  );

  const totalIncome = spendingTrendData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = spendingTrendData.reduce((sum, d) => sum + d.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1);

  const handleExportSpendingTrend = () => {
    const exportData = spendingTrendData.map(d => ({
      date: d.month,
      income: d.income,
      expenses: d.expenses,
      net: d.savings,
    }));
    exportSpendingReportToCSV(exportData);
  };

  const handleExportCategoryBreakdown = () => {
    const exportData = categoryBreakdownData.map(c => ({
      category: c.name,
      amount: c.value,
      percentage: (c.value / totalExpenses) * 100,
      count: 0, // Mock value
    }));
    exportCategoryBreakdownToCSV(exportData);
  };

  // Add percentage to category data for tooltip - memoized
  const categoryDataWithPercentage = useMemo(() =>
    categoryBreakdownData.map(c => ({
      ...c,
      percentage: (c.value / categoryBreakdownData.reduce((sum, item) => sum + item.value, 0)) * 100,
    })), []);

  // Filter comparison data based on selected category - memoized
  const filteredComparisonData = useMemo(() =>
    selectedCategory
      ? monthlyComparisonData.filter(item =>
          item.category.toLowerCase().includes(selectedCategory.toLowerCase().split(' ')[0])
        )
      : monthlyComparisonData,
    [selectedCategory]
  );

  // Handle pie chart click
  const handlePieClick = (data: unknown) => {
    const chartData = data as PieChartDataPoint;
    if (selectedCategory === chartData.category) {
      setSelectedCategory(null); // Deselect if clicking same category
    } else {
      setSelectedCategory(chartData.category);
    }
  };

  // Handle line chart click
  const handleLineClick = (data: unknown) => {
    const chartData = data as LineChartDataPoint;
    if (selectedMonth === chartData.date) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(chartData.date);
    }
  };

  // Handle legend toggle
  const handleLegendToggle = (dataKey: string) => {
    const newHidden = new Set(hiddenDataKeys);
    if (newHidden.has(dataKey)) {
      newHidden.delete(dataKey);
    } else {
      newHidden.add(dataKey);
    }
    setHiddenDataKeys(newHidden);
  };

  // Legend items for line chart
  const lineChartLegendItems = [
    { dataKey: "income", label: "Income", color: "#10b981" },
    { dataKey: "expenses", label: "Expenses", color: "#ef4444" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Visualize your financial trends and insights
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={preferences.reportsTimeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <ExportButton
            onExportCSV={handleExportSpendingTrend}
            label="Export Report"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Income
          </h3>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last 7 months</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Expenses
          </h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last 7 months</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Total Savings
          </h3>
          <p className="text-2xl font-bold text-blue-600">${totalSavings.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Last 7 months</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Savings Rate
          </h3>
          <p className="text-2xl font-bold text-purple-600">{savingsRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Of total income</p>
        </div>
      </div>

      {/* Spending Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Income vs Expenses Trend
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedMonth ? `Details for ${selectedMonth}` : 'Track your financial flow over time'} • Click for details
            </p>
          </div>
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
        {/* Interactive Legend */}
        <div className="mb-4">
          <InteractiveLegend
            items={lineChartLegendItems}
            hiddenItems={hiddenDataKeys}
            onToggle={handleLegendToggle}
            showValues={false}
          />
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingTrendData} onClick={handleLineClick}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip content={<EnhancedLineTooltip />} />
            {!hiddenDataKeys.has("income") && (
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                name="Income"
                style={{ cursor: 'pointer' }}
                activeDot={{ r: 8, style: { cursor: 'pointer' } }}
              />
            )}
            {!hiddenDataKeys.has("expenses") && (
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                name="Expenses"
                style={{ cursor: 'pointer' }}
                activeDot={{ r: 8, style: { cursor: 'pointer' } }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        {selectedMonth && (() => {
          const monthData = spendingTrendData.find(d => d.month === selectedMonth);
          if (!monthData) return null;
          const netCashFlow = monthData.income - monthData.expenses;
          const savingsRate = ((monthData.savings / monthData.income) * 100).toFixed(1);

          return (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedMonth} 2026 Details
                </h3>
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Income</p>
                  <p className="text-lg font-bold text-green-600">${monthData.income.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expenses</p>
                  <p className="text-lg font-bold text-red-600">${monthData.expenses.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Net Cash Flow</p>
                  <p className={`text-lg font-bold ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${netCashFlow.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Savings Rate</p>
                  <p className="text-lg font-bold text-blue-600">{savingsRate}%</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Category Breakdown and Monthly Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Spending by Category
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedCategory ? `Filtered: ${selectedCategory}` : 'March 2026 breakdown'} • Click to filter
              </p>
            </div>
            <PieChartIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Pie Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryDataWithPercentage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={handlePieClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {categoryBreakdownData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={selectedCategory === null || selectedCategory === entry.name ? 1 : 0.3}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<EnhancedPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Legend */}
            <div className="lg:w-64">
              <CategoryLegend
                categories={categoryDataWithPercentage.map(c => ({
                  name: c.name,
                  color: c.color,
                  value: c.value,
                  percentage: c.percentage,
                }))}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          </div>
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Month-over-Month Comparison
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedCategory
                  ? `${selectedCategory} comparison`
                  : 'Feb vs Mar 2026'}
              </p>
            </div>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<EnhancedBarTooltip />} />
              <Legend />
              <Bar dataKey="lastMonth" fill="#94a3b8" name="Last Month" radius={[4, 4, 0, 0]} />
              <Bar dataKey="thisMonth" fill="#3b82f6" name="This Month" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {filteredComparisonData.length === 0 && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No comparison data for this category
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          🤖 AI Insights from Your Reports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              📈 Positive Trend
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your savings rate increased from 32% to 35% this month. Great job!
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              ⚠️ Watch Out
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Shopping expenses increased by 17% compared to last month.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              💡 Recommendation
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              You could save an extra $150/month by reducing dining out to 3x per week.
            </p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              🎯 On Track
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              You're on pace to reach your Emergency Fund goal 2 months early!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
