"use client";

import { useState } from "react";
import { Download, TrendingUp, Calendar, PieChart as PieChartIcon } from "lucide-react";
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
  const [timeRange, setTimeRange] = useState("6months");

  const totalIncome = spendingTrendData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = spendingTrendData.reduce((sum, d) => sum + d.expenses, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = ((totalSavings / totalIncome) * 100).toFixed(1);

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
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-600"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition">
            <Download className="h-5 w-5 mr-2" />
            Export PDF
          </button>
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
              Track your financial flow over time
            </p>
          </div>
          <TrendingUp className="h-6 w-6 text-blue-600" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={2}
              name="Expenses"
            />
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Savings"
            />
          </LineChart>
        </ResponsiveContainer>
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
                March 2026 breakdown
              </p>
            </div>
            <PieChartIcon className="h-6 w-6 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Month-over-Month Comparison
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Feb vs Mar 2026
              </p>
            </div>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="category" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar dataKey="lastMonth" fill="#94a3b8" name="Last Month" />
              <Bar dataKey="thisMonth" fill="#3b82f6" name="This Month" />
            </BarChart>
          </ResponsiveContainer>
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
