"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage with TypeScript support
 * Automatically syncs state with localStorage and handles JSON serialization
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook to sync localStorage across tabs/windows
 */
export function useLocalStorageSync<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useLocalStorage<T>(key, initialValue);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, setStoredValue]);

  return [storedValue, setStoredValue];
}

/**
 * Hook to manage user preferences with localStorage
 */
export interface UserPreferences {
  // Transaction preferences
  transactionView: "list" | "grid";
  transactionSortBy: "date" | "amount" | "category";
  transactionSortOrder: "asc" | "desc";
  transactionFilter: string;

  // Budget preferences
  budgetView: "cards" | "table";

  // Reports preferences
  reportsTimeRange: "3months" | "6months" | "year" | "all";

  // General preferences
  itemsPerPage: number;
  showCompletedGoals: boolean;
}

const defaultPreferences: UserPreferences = {
  transactionView: "list",
  transactionSortBy: "date",
  transactionSortOrder: "desc",
  transactionFilter: "",
  budgetView: "cards",
  reportsTimeRange: "6months",
  itemsPerPage: 10,
  showCompletedGoals: true,
};

export function useUserPreferences() {
  return useLocalStorage<UserPreferences>("budget-ai-preferences", defaultPreferences);
}
