/**
 * ExportTransactionsModal Component
 *
 * Modal for exporting transactions with filtering and format options.
 */

"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Download, FileText, FileSpreadsheet, Calendar, Filter } from "lucide-react";
import { exportTransactionsToCSV, exportToJSON } from "@/lib/utils/export";

interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant?: string;
  amount: number;
  category: string;
  type?: "income" | "expense";
  aiCategorized?: boolean;
  aiConfidence?: number;
}

interface ExportTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export function ExportTransactionsModal({
  isOpen,
  onClose,
  transactions,
}: ExportTransactionsModalProps) {
  const [format, setFormat] = useState<"csv" | "json">("csv");
  const [dateRange, setDateRange] = useState<"all" | "month" | "quarter" | "year" | "custom">("all");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      // Filter transactions by date range
      let filteredTransactions = [...transactions];

      // Apply date range filter
      if (dateRange !== "all") {
        const now = new Date();
        let startDate = new Date();

        if (dateRange === "month") {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (dateRange === "quarter") {
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
        } else if (dateRange === "year") {
          startDate = new Date(now.getFullYear(), 0, 1);
        } else if (dateRange === "custom") {
          if (customStartDate) startDate = new Date(customStartDate);
          if (customEndDate) {
            const endDate = new Date(customEndDate);
            filteredTransactions = filteredTransactions.filter(
              (t) => new Date(t.date) >= startDate && new Date(t.date) <= endDate
            );
          } else {
            filteredTransactions = filteredTransactions.filter(
              (t) => new Date(t.date) >= startDate
            );
          }
        }

        if (dateRange !== "custom") {
          filteredTransactions = filteredTransactions.filter(
            (t) => new Date(t.date) >= startDate
          );
        }
      }

      // Apply type filter
      if (filterType !== "all") {
        filteredTransactions = filteredTransactions.filter((t) => {
          if (filterType === "income") return t.amount > 0 || t.type === "income";
          if (filterType === "expense") return t.amount < 0 || t.type === "expense";
          return true;
        });
      }

      // Export based on format
      if (format === "csv") {
        exportTransactionsToCSV(filteredTransactions as any);
      } else {
        exportToJSON(filteredTransactions, "transactions");
      }

      // Show success and close
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  const getFilteredCount = () => {
    let count = transactions.length;

    if (dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      if (dateRange === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (dateRange === "quarter") {
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
      } else if (dateRange === "year") {
        startDate = new Date(now.getFullYear(), 0, 1);
      } else if (dateRange === "custom" && customStartDate) {
        startDate = new Date(customStartDate);
      }

      count = transactions.filter((t) => {
        const transDate = new Date(t.date);
        if (dateRange === "custom" && customEndDate) {
          const endDate = new Date(customEndDate);
          return transDate >= startDate && transDate <= endDate;
        }
        return transDate >= startDate;
      }).length;
    }

    if (filterType !== "all") {
      const filtered = transactions.filter((t) => {
        if (filterType === "income") return t.amount > 0 || t.type === "income";
        if (filterType === "expense") return t.amount < 0 || t.type === "expense";
        return true;
      });
      count = Math.min(count, filtered.length);
    }

    return count;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Transactions" maxWidth="md">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormat("csv")}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                format === "csv"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <FileSpreadsheet
                className={`h-6 w-6 ${format === "csv" ? "text-blue-600" : "text-gray-400"}`}
              />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">CSV</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Excel compatible
                </div>
              </div>
            </button>
            <button
              onClick={() => setFormat("json")}
              className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                format === "json"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <FileText
                className={`h-6 w-6 ${format === "json" ? "text-blue-600" : "text-gray-400"}`}
              />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">JSON</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Data backup
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {dateRange === "custom" && (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Transaction Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Transactions to export:
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {getFilteredCount()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || getFilteredCount() === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
