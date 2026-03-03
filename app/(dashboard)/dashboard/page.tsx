import { auth } from "@/lib/auth";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, PiggyBank } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  // Mock data for now
  const stats = {
    totalBalance: 12540.50,
    monthlyIncome: 5000,
    monthlyExpenses: 3250,
    budgetRemaining: 1750,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's what's happening with your money
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Balance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</h3>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stats.totalBalance.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
        </div>

        {/* Monthly Income */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Income</h3>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stats.monthlyIncome.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">This month</p>
        </div>

        {/* Monthly Expenses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Expenses</h3>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stats.monthlyExpenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">65% of budget</p>
        </div>

        {/* Budget Remaining */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Remaining</h3>
            <PiggyBank className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${stats.budgetRemaining.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">35% left</p>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8">
        <div className="flex items-start">
          <AlertCircle className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              🤖 AI Insight
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              You're spending 40% more on dining out this month compared to last month.
              At this rate, you'll exceed your food budget by $280.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View details →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <p className="font-medium text-gray-900 dark:text-white">Add Transaction</p>
              <p className="text-sm text-gray-500">Manually record income or expense</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <p className="font-medium text-gray-900 dark:text-white">Create Budget</p>
              <p className="text-sm text-gray-500">Set up a new monthly budget</p>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
              <p className="font-medium text-gray-900 dark:text-white">Set Goal</p>
              <p className="text-sm text-gray-500">Track savings or debt payoff</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Whole Foods</p>
                  <p className="text-xs text-gray-500">Groceries • Today</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">-$124.50</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Payroll Deposit</p>
                  <p className="text-xs text-gray-500">Income • Mar 1</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600">+$5,000.00</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Netflix</p>
                  <p className="text-xs text-gray-500">Entertainment • Mar 1</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">-$15.99</p>
            </div>
          </div>
          <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all transactions →
          </button>
        </div>
      </div>
    </div>
  );
}
