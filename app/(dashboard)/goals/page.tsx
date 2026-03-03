"use client";

import { useState } from "react";
import { Plus, Target, TrendingUp, Calendar, DollarSign, CheckCircle } from "lucide-react";

// Mock data
const mockGoals = [
  {
    id: "1",
    name: "Emergency Fund",
    goalType: "savings",
    targetAmount: 10000,
    currentAmount: 6500,
    targetDate: "2026-12-31",
    priority: 1,
    status: "active",
  },
  {
    id: "2",
    name: "Pay Off Credit Card",
    goalType: "debt",
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: "2026-09-30",
    priority: 2,
    status: "active",
  },
  {
    id: "3",
    name: "Vacation to Japan",
    goalType: "savings",
    targetAmount: 4000,
    currentAmount: 1200,
    targetDate: "2027-06-01",
    priority: 3,
    status: "active",
  },
  {
    id: "4",
    name: "New Laptop",
    goalType: "savings",
    targetAmount: 2000,
    currentAmount: 2000,
    targetDate: "2026-03-01",
    priority: 4,
    status: "completed",
  },
];

export default function GoalsPage() {
  const [goals] = useState(mockGoals);

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your savings and debt payoff progress
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition">
          <Plus className="h-5 w-5 mr-2" />
          New Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Goals</h3>
            <Target className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
          <p className="text-sm text-gray-500 mt-2">In progress</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Target</h3>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${activeGoals.reduce((sum, g) => sum + g.targetAmount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Combined goals</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</h3>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedGoals.length}</p>
          <p className="text-sm text-gray-500 mt-2">This year</p>
        </div>
      </div>

      {/* Active Goals */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Goals</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const remaining = goal.targetAmount - goal.currentAmount;
            const daysLeft = Math.ceil(
              (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Target className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h3>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        goal.goalType === "savings"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {goal.goalType === "savings" ? "💰 Savings" : "💳 Debt"}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
                    <p className="text-lg font-bold text-blue-600">#{goal.priority}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${goal.currentAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        of ${goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${remaining.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">remaining</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-3 transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {progress.toFixed(1)}% complete
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{daysLeft} days left</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                    <span className="text-green-600 font-medium">
                      ${((goal.currentAmount / 30) * 7).toFixed(0)}/week
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition">
                    Add Funds
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition">
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Completed Goals
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Completed on {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ${goal.targetAmount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600">100% complete</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insight */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
          🤖 AI Recommendation
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          Based on your current spending patterns, you can accelerate your "Emergency Fund" goal
          by reallocating $150/month from your "Dining Out" budget. You'll reach your target 3
          months earlier!
        </p>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Apply suggestion →
        </button>
      </div>
    </div>
  );
}
