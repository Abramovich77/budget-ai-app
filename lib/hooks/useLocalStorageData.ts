/**
 * Custom hooks for persisting application data to localStorage
 * Provides automatic backup and restore of transactions, budgets, and goals
 */

import { useState, useEffect } from "react";
import type { Transaction, Budget, Goal } from "@/lib/types";

const STORAGE_KEYS = {
  TRANSACTIONS: "budget-ai-transactions",
  BUDGETS: "budget-ai-budgets",
  GOALS: "budget-ai-goals",
  LAST_SYNC: "budget-ai-last-sync",
} as const;

/**
 * Save data to localStorage with error handling
 */
function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Load data from localStorage with error handling
 */
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Clear all app data from localStorage
 */
export function clearAllData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Get last sync timestamp
 */
export function getLastSyncTime(): Date | null {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    return null;
  }
}

/**
 * Hook for managing transactions with localStorage persistence
 */
export function usePersistedTransactions<T extends { id: string }>(initialData: T[]) {
  const [transactions, setTransactions] = useState<T[]>(() => {
    if (typeof window === "undefined") return initialData;
    return loadFromStorage(STORAGE_KEYS.TRANSACTIONS, initialData);
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = loadFromStorage(STORAGE_KEYS.TRANSACTIONS, initialData);
    setTransactions(stored);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever transactions change
    if (!isLoading && transactions.length > 0) {
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    }
  }, [transactions, isLoading]);

  const addTransaction = (transaction: T) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const updateTransaction = (id: string, updates: Partial<T>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  };

  return {
    transactions,
    setTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    isLoading,
  };
}

/**
 * Hook for managing budgets with localStorage persistence
 */
export function usePersistedBudgets<T extends { id: string }>(initialData: T[]) {
  const [budgets, setBudgets] = useState<T[]>(() => {
    if (typeof window === "undefined") return initialData;
    return loadFromStorage(STORAGE_KEYS.BUDGETS, initialData);
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = loadFromStorage(STORAGE_KEYS.BUDGETS, initialData);
    setBudgets(stored);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever budgets change
    if (!isLoading && budgets.length > 0) {
      saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
    }
  }, [budgets, isLoading]);

  const addBudget = (budget: T) => {
    setBudgets((prev) => [...prev, budget]);
  };

  const updateBudget = (id: string, updates: Partial<T>) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const clearBudgets = () => {
    setBudgets([]);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
  };

  return {
    budgets,
    setBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    clearBudgets,
    isLoading,
  };
}

/**
 * Hook for managing goals with localStorage persistence
 */
export function usePersistedGoals<T extends { id: string }>(initialData: T[]) {
  const [goals, setGoals] = useState<T[]>(() => {
    if (typeof window === "undefined") return initialData;
    return loadFromStorage(STORAGE_KEYS.GOALS, initialData);
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = loadFromStorage(STORAGE_KEYS.GOALS, initialData);
    setGoals(stored);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever goals change
    if (!isLoading && goals.length > 0) {
      saveToStorage(STORAGE_KEYS.GOALS, goals);
    }
  }, [goals, isLoading]);

  const addGoal = (goal: T) => {
    setGoals((prev) => [...prev, goal]);
  };

  const updateGoal = (id: string, updates: Partial<T>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const clearGoals = () => {
    setGoals([]);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
  };

  return {
    goals,
    setGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    clearGoals,
    isLoading,
  };
}

/**
 * Export all data for backup
 */
export function exportAllData() {
  return {
    transactions: loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
    budgets: loadFromStorage(STORAGE_KEYS.BUDGETS, []),
    goals: loadFromStorage(STORAGE_KEYS.GOALS, []),
    exportedAt: new Date().toISOString(),
    version: "1.0",
  };
}

/**
 * Import data from backup
 */
export function importAllData(data: {
  transactions?: Transaction[];
  budgets?: Budget[];
  goals?: Goal[];
}) {
  try {
    if (data.transactions) {
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, data.transactions);
    }
    if (data.budgets) {
      saveToStorage(STORAGE_KEYS.BUDGETS, data.budgets);
    }
    if (data.goals) {
      saveToStorage(STORAGE_KEYS.GOALS, data.goals);
    }
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats() {
  try {
    const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || "[]";
    const budgets = localStorage.getItem(STORAGE_KEYS.BUDGETS) || "[]";
    const goals = localStorage.getItem(STORAGE_KEYS.GOALS) || "[]";

    return {
      transactionsCount: JSON.parse(transactions).length,
      budgetsCount: JSON.parse(budgets).length,
      goalsCount: JSON.parse(goals).length,
      totalSize: (transactions.length + budgets.length + goals.length) / 1024, // KB
      lastSync: getLastSyncTime(),
    };
  } catch (error) {
    return {
      transactionsCount: 0,
      budgetsCount: 0,
      goalsCount: 0,
      totalSize: 0,
      lastSync: null,
    };
  }
}
