import { useMemo } from "react";

/**
 * Custom hook to filter and sort data with memoization
 * Prevents expensive filter/sort operations on every render
 */
export function useFilteredTransactions<T extends { description: string; category: string; merchant?: string }>(
  data: T[],
  searchQuery: string
): T[] {
  return useMemo(() => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(
      (item) =>
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.merchant?.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);
}

/**
 * Memoized sorting hook
 */
export function useSortedData<T>(
  data: T[],
  sortBy: keyof T,
  sortOrder: "asc" | "desc" = "asc"
): T[] {
  return useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal === bVal) return 0;

      const comparison = aVal < bVal ? -1 : 1;
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [data, sortBy, sortOrder]);
}

/**
 * Memoized pagination hook
 */
export function usePaginatedData<T>(
  data: T[],
  page: number,
  pageSize: number
): {
  paginatedData: T[];
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
} {
  return useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    return {
      paginatedData,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }, [data, page, pageSize]);
}

/**
 * Memoized aggregation hook for financial calculations
 */
export function useAggregatedStats<T extends { amount: number }>(
  data: T[]
): {
  total: number;
  average: number;
  min: number;
  max: number;
  count: number;
} {
  return useMemo(() => {
    if (data.length === 0) {
      return { total: 0, average: 0, min: 0, max: 0, count: 0 };
    }

    const amounts = data.map((item) => item.amount);
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    const average = total / data.length;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return {
      total,
      average,
      min,
      max,
      count: data.length,
    };
  }, [data]);
}
