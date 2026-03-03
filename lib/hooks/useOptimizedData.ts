/**
 * Custom hooks for optimized data processing with memoization
 */

import { useMemo } from "react";

/**
 * Calculate spending statistics with memoization
 */
export function useSpendingStats(transactions: Array<{ amount: number; category: string }>) {
  return useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const net = income - expenses;
    const savingsRate = income > 0 ? (net / income) * 100 : 0;

    return {
      total,
      income,
      expenses,
      net,
      savingsRate,
      transactionCount: transactions.length,
    };
  }, [transactions]);
}

/**
 * Group transactions by category with memoization
 */
export function useCategoryGroups(transactions: Array<{ amount: number; category: string }>) {
  return useMemo(() => {
    const groups = new Map<string, { total: number; count: number }>();

    transactions.forEach((t) => {
      const existing = groups.get(t.category) || { total: 0, count: 0 };
      groups.set(t.category, {
        total: existing.total + Math.abs(t.amount),
        count: existing.count + 1,
      });
    });

    return Array.from(groups.entries()).map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
      average: data.total / data.count,
    }));
  }, [transactions]);
}

/**
 * Calculate budget progress with memoization
 */
export function useBudgetProgress(
  categories: Array<{ name: string; allocated: number; spent: number }>
) {
  return useMemo(() => {
    const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
    const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
    const remaining = totalAllocated - totalSpent;
    const progressPercentage = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    const categoryProgress = categories.map((c) => ({
      ...c,
      remaining: c.allocated - c.spent,
      progress: c.allocated > 0 ? (c.spent / c.allocated) * 100 : 0,
      isOverBudget: c.spent > c.allocated,
    }));

    return {
      totalAllocated,
      totalSpent,
      remaining,
      progressPercentage,
      categoryProgress,
      categoriesOverBudget: categoryProgress.filter((c) => c.isOverBudget).length,
    };
  }, [categories]);
}

/**
 * Calculate goal progress with memoization
 */
export function useGoalProgress(
  goals: Array<{
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
  }>
) {
  return useMemo(() => {
    const now = new Date();

    return goals.map((goal) => {
      const progress = goal.targetAmount > 0
        ? (goal.currentAmount / goal.targetAmount) * 100
        : 0;

      const targetDate = new Date(goal.targetDate);
      const daysLeft = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const remaining = goal.targetAmount - goal.currentAmount;
      const weeklyTarget = daysLeft > 0 ? (remaining / daysLeft) * 7 : 0;

      return {
        ...goal,
        progress,
        daysLeft: Math.max(0, daysLeft),
        remaining,
        weeklyTarget: Math.max(0, weeklyTarget),
        isOnTrack: progress >= ((Date.now() - new Date(goal.targetDate).getTime()) / (Date.now() - new Date().getTime())) * 100,
      };
    });
  }, [goals]);
}

/**
 * Sort data with memoization
 */
export function useSortedData<T>(
  data: T[],
  sortBy: keyof T,
  sortOrder: "asc" | "desc"
) {
  return useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortBy, sortOrder]);
}

/**
 * Filter data with memoization
 */
export function useFilteredData<T>(
  data: T[],
  filterFn: (item: T) => boolean
) {
  return useMemo(() => {
    return data.filter(filterFn);
  }, [data, filterFn]);
}

/**
 * Paginate data with memoization
 */
export function usePaginatedData<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 10
) {
  return useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    return {
      data: paginatedData,
      page,
      pageSize,
      totalItems: data.length,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }, [data, page, pageSize]);
}

/**
 * Calculate chart data with memoization
 */
export function useChartData(
  data: Array<{ date: string; value: number }>,
  groupBy: "day" | "week" | "month" = "day"
) {
  return useMemo(() => {
    const groups = new Map<string, number[]>();

    data.forEach((item) => {
      const date = new Date(item.date);
      let key: string;

      switch (groupBy) {
        case "week":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0];
          break;
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        default:
          key = item.date;
      }

      const existing = groups.get(key) || [];
      existing.push(item.value);
      groups.set(key, existing);
    });

    return Array.from(groups.entries()).map(([date, values]) => ({
      date,
      value: values.reduce((sum, v) => sum + v, 0),
      average: values.reduce((sum, v) => sum + v, 0) / values.length,
      count: values.length,
    }));
  }, [data, groupBy]);
}

/**
 * Debounce search with memoization
 */
export function useSearchResults<T>(
  data: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
) {
  return useMemo(() => {
    if (!searchTerm.trim()) return data;

    const lowerSearch = searchTerm.toLowerCase();

    return data.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(lowerSearch);
        }
        if (typeof value === "number") {
          return value.toString().includes(lowerSearch);
        }
        return false;
      })
    );
  }, [data, searchTerm, searchFields]);
}
