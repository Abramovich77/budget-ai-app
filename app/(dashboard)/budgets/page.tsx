"use client";

import { useState } from "react";
import { Plus, PiggyBank, TrendingDown, AlertTriangle } from "lucide-react";
import { AddBudgetModal } from "@/components/budgets/AddBudgetModal";

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
  const [budget] = useState(mockBudget);
  const [showAddModal, setShowAddModal] = useState(false);

  const progressPercentage = (budget.totalSpent / budget.totalAllocated) * 100;
  const remaining = budget.totalAllocated - budget.totalSpent;

  const handleAddBudget = (newBudget: any) => {
    console.log("New budget created:", newBudget);
    // In production, this would update state and sync with API
  };

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your spending and stay on target
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Budget
        </button>
      </div>

      {/* Budget Overview Card */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{budget.name}</h2>
            <p className="text-blue-100">Zero-Based Budgeting</p>
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">Overall Progress</span>
            <span className="text-sm font-semibold">{progressPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-blue-400/30 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
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

              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 transition-all duration-500 ${
                      isOverspent
                        ? "bg-red-600"
                        : isWarning
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(categoryProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {categoryProgress.toFixed(0)}% used
                </p>
              </div>

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
    </div>
  );
}
