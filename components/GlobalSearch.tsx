"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, DollarSign, Target, PiggyBank, TrendingUp, Command } from "lucide-react";

interface SearchResult {
  id: string;
  type: "transaction" | "budget" | "goal" | "page";
  title: string;
  subtitle?: string;
  href: string;
  icon: React.ReactNode;
}

// Mock search data - in production this would query the API
const mockSearchData: SearchResult[] = [
  // Pages
  { id: "1", type: "page", title: "Dashboard", href: "/dashboard", icon: <TrendingUp className="h-5 w-5" /> },
  { id: "2", type: "page", title: "Transactions", href: "/transactions", icon: <DollarSign className="h-5 w-5" /> },
  { id: "3", type: "page", title: "Budgets", href: "/budgets", icon: <PiggyBank className="h-5 w-5" /> },
  { id: "4", type: "page", title: "Goals", href: "/goals", icon: <Target className="h-5 w-5" /> },
  { id: "5", type: "page", title: "Reports", href: "/reports", icon: <TrendingUp className="h-5 w-5" /> },

  // Transactions
  { id: "6", type: "transaction", title: "Whole Foods Market", subtitle: "$124.50 • Groceries", href: "/transactions", icon: <DollarSign className="h-5 w-5 text-green-600" /> },
  { id: "7", type: "transaction", title: "Netflix Subscription", subtitle: "$15.99 • Entertainment", href: "/transactions", icon: <DollarSign className="h-5 w-5 text-red-600" /> },
  { id: "8", type: "transaction", title: "Shell Gas Station", subtitle: "$45.30 • Transportation", href: "/transactions", icon: <DollarSign className="h-5 w-5 text-red-600" /> },

  // Budgets
  { id: "9", type: "budget", title: "Groceries Budget", subtitle: "$450 / $600 spent", href: "/budgets", icon: <PiggyBank className="h-5 w-5 text-blue-600" /> },
  { id: "10", type: "budget", title: "Dining Out Budget", subtitle: "$280 / $300 spent", href: "/budgets", icon: <PiggyBank className="h-5 w-5 text-blue-600" /> },

  // Goals
  { id: "11", type: "goal", title: "Emergency Fund", subtitle: "$6,500 / $10,000", href: "/goals", icon: <Target className="h-5 w-5 text-purple-600" /> },
  { id: "12", type: "goal", title: "Vacation to Japan", subtitle: "$1,200 / $4,000", href: "/goals", icon: <Target className="h-5 w-5 text-purple-600" /> },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter results based on query
  const results = query.trim()
    ? mockSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : mockSearchData.slice(0, 8); // Show top 8 when no query

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Close with Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }

      // Navigate with arrow keys
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        }
        if (e.key === "Enter" && results[selectedIndex]) {
          e.preventDefault();
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Search Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-[10vh]">
        <div
          className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions, budgets, goals..."
              className="w-full py-4 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
            />
            <kbd className="hidden sm:block px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No results found</p>
              </div>
            ) : (
              results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${
                    index === selectedIndex
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                      {result.icon}
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
                Select
              </span>
            </div>
            <span className="hidden sm:flex items-center gap-1">
              <Command className="h-3 w-3" />
              K to open
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
