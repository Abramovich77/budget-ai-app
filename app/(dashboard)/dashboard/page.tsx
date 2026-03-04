import { auth } from "@/lib/auth";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategorySpendingChart } from "@/components/dashboard/CategorySpendingChart";

export default async function DashboardPage() {
  const session = await auth();

  // Mock data for now
  const stats = {
    totalBalance: 12540.50,
    monthlyIncome: 5000,
    monthlyExpenses: 3250,
    budgetRemaining: 1750,
  };

  const categorySpending = [
    { name: "Groceries", amount: 650, color: "#10b981" },
    { name: "Rent", amount: 2000, color: "#6366f1" },
    { name: "Transportation", amount: 320, color: "#3b82f6" },
    { name: "Dining Out", amount: 280, color: "#f59e0b" },
    { name: "Entertainment", amount: 180, color: "#8b5cf6" },
    { name: "Utilities", amount: 240, color: "#84cc16" },
    { name: "Healthcare", amount: 80, color: "#06b6d4" },
  ];

  return (
    <div className="animate-fade-in">
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
        <StatCard
          title="Total Balance"
          value={`$${stats.totalBalance.toLocaleString()}`}
          subtitle=""
          icon={DollarSign}
          iconColor="text-blue-600"
          trend="+12.5% from last month"
          trendColor="text-green-600"
          tooltip="Sum of all your account balances across checking, savings, and investment accounts"
          delay="0s"
        />

        <StatCard
          title="Monthly Income"
          value={`$${stats.monthlyIncome.toLocaleString()}`}
          subtitle="This month"
          icon={TrendingUp}
          iconColor="text-green-600"
          tooltip="Total income received this month from salary, side hustles, investments, and other sources"
          delay="0.1s"
        />

        <StatCard
          title="Monthly Expenses"
          value={`$${stats.monthlyExpenses.toLocaleString()}`}
          subtitle="65% of budget"
          icon={TrendingDown}
          iconColor="text-red-600"
          tooltip="Total amount spent this month across all categories including bills, groceries, entertainment, and more"
          delay="0.2s"
        />

        <StatCard
          title="Budget Remaining"
          value={`$${stats.budgetRemaining.toLocaleString()}`}
          subtitle="35% left"
          icon={PiggyBank}
          iconColor="text-purple-600"
          tooltip="Amount left to spend this month within your budget. Stay within this to meet your financial goals!"
          delay="0.3s"
        />
      </div>

      {/* AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Insights Panel - Takes 2 columns */}
        <div className="lg:col-span-2">
          <InsightsCard maxInsights={3} />
        </div>

        {/* Quick Actions - Takes 1 column */}
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
      </div>

      {/* Category Spending Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Spending Chart */}
        <CategorySpendingChart data={categorySpending} />

        {/* Recent Transactions */}
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
