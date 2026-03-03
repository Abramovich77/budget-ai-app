"use client";

import { useState } from "react";
import { Download, FileText, Database, X, Check } from "lucide-react";
import { exportToJSON } from "@/lib/utils/export";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExportOptions {
  transactions: boolean;
  budgets: boolean;
  goals: boolean;
  settings: boolean;
}

/**
 * Modal for exporting all financial data
 * Allows users to select what data to export and in what format
 */
export function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    transactions: true,
    budgets: true,
    goals: true,
    settings: false,
  });
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  if (!isOpen) return null;

  const handleToggle = (key: keyof ExportOptions) => {
    setExportOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExport = async () => {
    setExporting(true);

    // Simulate API call to fetch data
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data - in production, this would come from API
    const exportData: Record<string, unknown> = {};

    if (exportOptions.transactions) {
      exportData.transactions = [
        {
          id: "1",
          date: "2026-03-01",
          description: "Grocery Store",
          merchant: "Whole Foods",
          category: "Groceries",
          amount: 85.42,
          aiCategorized: true,
          aiConfidence: 0.95,
        },
        // More transactions...
      ];
    }

    if (exportOptions.budgets) {
      exportData.budgets = [
        {
          id: "1",
          name: "March 2026 Budget",
          period: "monthly",
          totalAllocated: 5000,
          totalSpent: 3250,
          categories: [
            { name: "Groceries", allocated: 600, spent: 450 },
            { name: "Dining Out", allocated: 300, spent: 280 },
          ],
        },
      ];
    }

    if (exportOptions.goals) {
      exportData.goals = [
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
      ];
    }

    if (exportOptions.settings) {
      exportData.settings = {
        currency: "USD",
        theme: "system",
        notifications: {
          email: true,
          push: false,
          budgetAlerts: true,
        },
      };
    }

    exportData.exportMetadata = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      format: format,
    };

    // Export based on format
    if (format === "json") {
      exportToJSON(exportData, "budget-ai-export");
    } else {
      // For CSV, we'd export each section as a separate file
      // This is handled by the individual export functions
      alert("CSV export would create separate files for each data type");
    }

    setExporting(false);
    setExportComplete(true);

    // Reset after 2 seconds
    setTimeout(() => {
      setExportComplete(false);
      onClose();
    }, 2000);
  };

  const selectedCount = Object.values(exportOptions).filter(Boolean).length;
  const canExport = selectedCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Download className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Export Your Data
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download your financial data for backup or analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat("json")}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                  format === "json"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Database
                  className={`h-5 w-5 ${
                    format === "json"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <div className="text-left flex-1">
                  <div
                    className={`font-medium ${
                      format === "json"
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    JSON
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Complete backup
                  </div>
                </div>
              </button>

              <button
                onClick={() => setFormat("csv")}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                  format === "csv"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <FileText
                  className={`h-5 w-5 ${
                    format === "csv"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400"
                  }`}
                />
                <div className="text-left flex-1">
                  <div
                    className={`font-medium ${
                      format === "csv"
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    CSV
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Spreadsheet ready
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Data Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Data to Export ({selectedCount} selected)
            </label>
            <div className="space-y-2">
              {[
                {
                  key: "transactions" as const,
                  label: "Transactions",
                  description: "All transaction history",
                },
                {
                  key: "budgets" as const,
                  label: "Budgets",
                  description: "Budget allocations and spending",
                },
                {
                  key: "goals" as const,
                  label: "Goals",
                  description: "Savings goals and progress",
                },
                {
                  key: "settings" as const,
                  label: "Settings",
                  description: "App preferences and configuration",
                },
              ].map((option) => (
                <label
                  key={option.key}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={exportOptions[option.key]}
                    onChange={() => handleToggle(option.key)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex gap-3">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-medium mb-1">Export Information</p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• JSON exports include all data in a single file</li>
                  <li>• CSV exports create separate files for each data type</li>
                  <li>• Your data remains private and is never sent to servers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport || exporting || exportComplete}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
              exportComplete
                ? "bg-green-600 text-white"
                : canExport && !exporting
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {exportComplete ? (
              <>
                <Check className="h-5 w-5" />
                Exported!
              </>
            ) : exporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-5 w-5" />
                Export Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
