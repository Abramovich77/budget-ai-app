import { auth } from "@/lib/auth";
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { CategorySpendingChart } from "@/components/dashboard/CategorySpendingChart";
import { QuickActions } from "@/components/dashboard/QuickActions";

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

  // 7-day sparkline data (mock data showing trends)
  const balanceSparkline = [11200, 11800, 12100, 11900, 12300, 12450, 12540];
  const incomeSparkline = [4200, 4500, 4800, 4600, 4900, 5100, 5000];
  const expensesSparkline = [3100, 3400, 3200, 3300, 3150, 3280, 3250];
  const budgetSparkline = [2100, 1900, 1850, 1950, 1800, 1720, 1750];

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
          sparklineData={balanceSparkline}
          sparklineColor="#3b82f6"
        />

        <StatCard
          title="Monthly Income"
          value={`$${stats.monthlyIncome.toLocaleString()}`}
          subtitle="This month"
          icon={TrendingUp}
          iconColor="text-green-600"
          tooltip="Total income received this month from salary, side hustles, investments, and other sources"
          delay="0.1s"
          sparklineData={incomeSparkline}
          sparklineColor="#10b981"
        />

        <StatCard
          title="Monthly Expenses"
          value={`$${stats.monthlyExpenses.toLocaleString()}`}
          subtitle="65% of budget"
          icon={TrendingDown}
          iconColor="text-red-600"
          tooltip="Total amount spent this month across all categories including bills, groceries, entertainment, and more"
          delay="0.2s"
          sparklineData={expensesSparkline}
          sparklineColor="#ef4444"
        />

        <StatCard
          title="Budget Remaining"
          value={`$${stats.budgetRemaining.toLocaleString()}`}
          subtitle="35% left"
          icon={PiggyBank}
          iconColor="text-purple-600"
          tooltip="Amount left to spend this month within your budget. Stay within this to meet your financial goals!"
          delay="0.3s"
          sparklineData={budgetSparkline}
          sparklineColor="#a855f7"
        />
      </div>

      {/* AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* AI Insights Panel - Takes 2 columns */}
        <div className="lg:col-span-2">
          <InsightsCard maxInsights={3} />
        </div>

        {/* Quick Actions - Takes 1 column */}
        <QuickActions />
      </div>

      {/* Category Spending Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Spending Chart */}
        <CategorySpendingChart data={categorySpending} />

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">Whole Foods</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Groceries • Today</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">-$124.50</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">Payroll Deposit</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Income • Mar 1</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-green-600 group-hover:scale-105 transition-transform">+$5,000.00</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group hover:scale-[1.02]">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-100 transition-colors">Netflix</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Entertainment • Mar 1</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">-$15.99</p>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
            View all transactions →
          </button>
        </div>
      </div>
    </div>
  );
}
