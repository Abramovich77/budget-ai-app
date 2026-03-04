"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, PiggyBank, TrendingDown, AlertTriangle, Wallet, Bell, BellOff } from "lucide-react";
import { AddBudgetModal } from "@/components/budgets/AddBudgetModal";
import { InfoTooltip } from "@/components/ui/Tooltip";
import { GridSkeleton } from "@/components/ui/Skeleton";
import { ProgressLoadingScreen } from "@/components/ui/ProgressLoader";
import { KeyboardHint, QuickTip } from "@/components/ui/KeyboardHint";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBudgetAlerts, useOverallBudgetAlert } from "@/lib/hooks/useBudgetAlerts";
import { useBudgetProgress } from "@/lib/hooks/useOptimizedData";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import { BudgetRecommendations } from "@/components/budgets/BudgetRecommendations";
import { HelpTooltip, InlineHelp } from "@/components/ui/HelpTooltip";
import { AnimatedProgressBar } from "@/components/budgets/AnimatedProgressBar";

// Mock data
const mockBudget = {
  id: "1",
  name: "March 2026 Budget",
  methodology: "zero-based",
  totalAllocated: 5000,
  totalSpent: 3250,
  categories: [
    {
      id: "1",
      name: "Groceries",
      allocated: 600,
      spent: 450,
      color: "#10b981",
    },
    {
      id: "2",
      name: "Dining Out",
      allocated: 300,
      spent: 280,
      color: "#f59e0b",
    },
    {
      id: "3",
      name: "Transportation",
      allocated: 400,
      spent: 320,
      color: "#3b82f6",
    },
    {
      id: "4",
      name: "Entertainment",
      allocated: 200,
      spent: 180,
      color: "#8b5cf6",
    },
    {
      id: "5",
      name: "Shopping",
      allocated: 300,
      spent: 350,
      color: "#ef4444",
    },
    {
      id: "6",
      name: "Healthcare",
      allocated: 150,
      spent: 80,
      color: "#06b6d4",
    },
    {
      id: "7",
      name: "Utilities",
      allocated: 250,
      spent: 240,
      color: "#84cc16",
    },
    {
      id: "8",
      name: "Rent",
      allocated: 2000,
      spent: 2000,
      color: "#6366f1",
    },
  ],
};

export default function BudgetsPage() {
  const [budget, setBudget] = useState<typeof mockBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  // Keyboard shortcuts for this page
  useKeyboardShortcut({
    key: "n",
    callback: () => setShowAddModal(true),
    enabled: !showAddModal,
  });

  useKeyboardShortcut({
    key: "a",
    callback: () => {
      setAlertsEnabled(!alertsEnabled);
      if (!alertsEnabled) {
        resetAlerts();
        resetOverallAlert();
      }
    },
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setBudget(mockBudget);
      setLoading(false);
    }, 1200);
  }, []);

  // Use optimized budget progress calculation
  const budgetProgressData = useBudgetProgress(
    budget?.categories.map(c => ({
      name: c.name,
      allocated: c.allocated,
      spent: c.spent
    })) || []
  );

  const progressPercentage = budget ? (budget.totalSpent / budget.totalAllocated) * 100 : 0;
  const remaining = budget ? budget.totalAllocated - budget.totalSpent : 0;

  // Budget alerts - monitors categories and triggers toasts (only if enabled)
  const { resetAlerts } = useBudgetAlerts(
    alertsEnabled && !loading ? budget?.categories || [] : [],
    {
      warning: 80,
      critical: 95,
      overspent: true,
    }
  );

  // Overall budget alert
  const { resetAlert: resetOverallAlert } = useOverallBudgetAlert(
    budget?.totalAllocated || 0,
    budget?.totalSpent || 0,
    alertsEnabled && !loading && !!budget
  );

  const handleAddBudget = (newBudget: { category: string; amount: number; period: string }) => {
    console.log("New budget created:", newBudget);
    // In production, this would create a new budget category or update the budget
    // For now, just refresh the mock data
    setBudget(mockBudget);
  };

  if (loading) {
    return (
      <ProgressLoadingScreen
        message="Loading budgets..."
        simulate={true}
        estimatedDuration={1000}
      />
    );
  }

  return (
    <div>
      {/* Add Budget Modal */}
      <AddBudgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddBudget}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track your spending and stay on target
            </p>
          </div>
          <HelpTooltip
            content="Create category budgets to control spending. Set limits for groceries, dining, entertainment, and more. Get real-time alerts when you're approaching limits."
            type="help"
            position="right"
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Alert Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAlertsEnabled(!alertsEnabled);
                if (!alertsEnabled) {
                  resetAlerts();
                  resetOverallAlert();
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                alertsEnabled
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={alertsEnabled ? "Alerts enabled" : "Alerts disabled"}
            >
              {alertsEnabled ? (
                <>
                  <Bell className="h-4 w-4" />
                  <span className="text-sm font-medium">Alerts On</span>
                  <KeyboardHint shortcut="A" showOnHover size="xs" />
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4" />
                  <span className="text-sm font-medium">Alerts Off</span>
                  <KeyboardHint shortcut="A" showOnHover size="xs" />
                </>
              )}
            </button>
            <HelpTooltip
              content="Enable alerts to get notified when you reach 80%, 95%, or exceed 100% of any budget category."
              type="info"
              size="sm"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="group bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
          >
            <Plus className="h-5 w-5" />
            <span>Create Budget</span>
            <KeyboardHint shortcut="N" showOnHover size="xs" className="bg-blue-700 border-blue-600" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Quick Tips */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <QuickTip shortcut="N" description="Create new budget" icon={<Plus className="h-4 w-4" />} />
          <QuickTip shortcut="A" description="Toggle alerts" icon={<Bell className="h-4 w-4" />} />
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 animate-pulse">
            <div className="h-8 bg-white/20 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="h-16 bg-white/20 rounded"></div>
              <div className="h-16 bg-white/20 rounded"></div>
              <div className="h-16 bg-white/20 rounded"></div>
            </div>
            <div className="h-3 bg-white/20 rounded"></div>
          </div>
          <GridSkeleton items={6} />
        </div>
      )}

      {/* Empty State */}
      {!loading && !budget && (
        <EmptyState
          icon={Wallet}
          title="No Budget Yet"
          description="Create your first budget to start tracking your spending and staying on target with your financial goals."
          action={{
            label: "Create Budget",
            onClick: () => setShowAddModal(true),
          }}
        />
      )}

      {/* Budget Content */}
      {!loading && budget && (
        <>
          {/* Alert Info Banner */}
          {alertsEnabled && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                  Smart Budget Alerts Active
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You'll receive notifications when categories reach 80% (warning) or 95% (critical) of their budget,
                  and when you go over budget. Alerts help you stay on track with your spending goals.
                </p>
              </div>
            </div>
          )}

          {/* Budget Overview Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  {budget.name}
                </h2>
            <p className="text-blue-100 flex items-center gap-2">
              Zero-Based Budgeting
              <InfoTooltip content="Every dollar is assigned a purpose. Income minus expenses should equal zero, ensuring complete control over your money" position="bottom" />
            </p>
          </div>
          <PiggyBank className="h-12 w-12 opacity-80" />
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Allocated</p>
            <p className="text-3xl font-bold">${budget.totalAllocated.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Total Spent</p>
            <p className="text-3xl font-bold">${budget.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Remaining</p>
            <p className="text-3xl font-bold">${remaining.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-blue-100 font-medium">Overall Progress</span>
          </div>
          <div className="relative">
            <div className="w-full bg-blue-400/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white rounded-full h-3 transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(progressPercentage, 100)}%`,
                  transition: "width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-bold text-white">{progressPercentage.toFixed(1)}%</span>
              <span className="text-xs text-blue-100">
                {progressPercentage < 100 ? "On track" : "Budget reached"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budget.categories.map((category) => {
          const categoryProgress = (category.spent / category.allocated) * 100;
          const isOverspent = category.spent > category.allocated;
          const isWarning = categoryProgress > 80 && !isOverspent;

          return (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: category.color }}
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                {isOverspent && (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                {isWarning && (
                  <TrendingDown className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              {/* Amounts */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${category.spent.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    of ${category.allocated.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      isOverspent
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {isOverspent ? "-" : ""}$
                    {Math.abs(category.allocated - category.spent).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isOverspent ? "overspent" : "remaining"}
                  </p>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <AnimatedProgressBar
                percentage={categoryProgress}
                color={category.color}
                isOverspent={isOverspent}
                isWarning={isWarning}
                showPercentage={true}
                animated={true}
                height="md"
              />

              {/* Alert Message */}
              {isOverspent && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-700 dark:text-red-400">
                  ⚠️ Over budget by ${(category.spent - category.allocated).toFixed(2)}
                </div>
              )}
              {isWarning && (
                <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-700 dark:text-yellow-400">
                  ⚡ At current pace, you'll exceed budget by $
                  {((category.spent / 20) * 31 - category.allocated).toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>

          {/* AI Budget Recommendations */}
          <div className="mt-8">
            <BudgetRecommendations
              budget={{
                totalAllocated: budget.totalAllocated,
                totalSpent: budget.totalSpent,
                categories: budget.categories,
              }}
            />
          </div>

          {/* Budget Methodology Info */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📊 Zero-Based Budgeting
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Every dollar has a job. Allocate all your income to specific categories,
              savings, or debt payment. No money sits unassigned.
            </p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
              Learn more about budgeting methods →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
