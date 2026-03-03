"use client";

import { useState } from "react";
import { X, Calendar, DollarSign, Tag, SlidersHorizontal } from "lucide-react";

export interface TransactionFilterOptions {
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  categories: string[];
  showIncome: boolean;
  showExpenses: boolean;
}

interface TransactionFiltersProps {
  filters: TransactionFilterOptions;
  onFiltersChange: (filters: TransactionFilterOptions) => void;
  availableCategories: string[];
}

/**
 * Advanced transaction filter component with date ranges, amount ranges, and category selection
 */
export function TransactionFilters({
  filters,
  onFiltersChange,
  availableCategories,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: undefined,
      amountMax: undefined,
      categories: [],
      showIncome: true,
      showExpenses: true,
    });
  };

  const activeFiltersCount =
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.amountMin !== undefined ? 1 : 0) +
    (filters.amountMax !== undefined ? 1 : 0) +
    filters.categories.length +
    (!filters.showIncome ? 1 : 0) +
    (!filters.showExpenses ? 1 : 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Filter Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition rounded-lg"
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearFilters();
              }}
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              Clear all
            </button>
          )}
          <span className="text-gray-400">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  From
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  To
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, dateTo: e.target.value || undefined })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Amount Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Amount Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Min
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.amountMin ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      amountMin: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Max
                </label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.amountMax ?? ""}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      amountMax: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, showIncome: !filters.showIncome })
                }
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                  filters.showIncome
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400"
                }`}
              >
                Income
              </button>
              <button
                onClick={() =>
                  onFiltersChange({ ...filters, showExpenses: !filters.showExpenses })
                }
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                  filters.showExpenses
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400"
                }`}
              >
                Expenses
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => {
                const isSelected = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
            {filters.categories.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {filters.categories.length} {filters.categories.length === 1 ? "category" : "categories"} selected
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to apply filters to transactions
 */
export function applyTransactionFilters<T extends {
  date: string;
  amount: number;
  category: string;
}>(
  transactions: T[],
  filters: TransactionFilterOptions
): T[] {
  return transactions.filter((transaction) => {
    // Date range filter
    if (filters.dateFrom && transaction.date < filters.dateFrom) return false;
    if (filters.dateTo && transaction.date > filters.dateTo) return false;

    // Amount range filter (use absolute value for comparison)
    const absAmount = Math.abs(transaction.amount);
    if (filters.amountMin !== undefined && absAmount < filters.amountMin) return false;
    if (filters.amountMax !== undefined && absAmount > filters.amountMax) return false;

    // Transaction type filter
    if (!filters.showIncome && transaction.amount > 0) return false;
    if (!filters.showExpenses && transaction.amount < 0) return false;

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(transaction.category)) {
      return false;
    }

    return true;
  });
}
