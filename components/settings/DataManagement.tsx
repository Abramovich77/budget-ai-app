"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Download,
  Upload,
  Trash2,
  HardDrive,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  getStorageStats,
  exportAllData,
  importAllData,
  clearAllData,
} from "@/lib/hooks/useLocalStorageData";
import { useToast } from "@/components/ui/Toast";

export function DataManagement() {
  const [stats, setStats] = useState({
    transactionsCount: 0,
    budgetsCount: 0,
    goalsCount: 0,
    totalSize: 0,
    lastSync: null as Date | null,
  });

  const [isImporting, setIsImporting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const storageStats = getStorageStats();
    setStats(storageStats);
  };

  const handleExport = () => {
    try {
      const data = exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `budget-ai-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Data Exported", "Your data has been downloaded successfully");
    } catch (error) {
      toast.error("Export Failed", "Could not export data. Please try again.");
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        const success = importAllData(data);

        if (success) {
          toast.success("Data Imported", "Your data has been restored successfully");
          loadStats();
          // Reload page to reflect imported data
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error("Import Failed", "Could not import data. File may be corrupted.");
        }
      } catch (error) {
        toast.error("Import Failed", "Invalid file format. Please select a valid backup file.");
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      toast.error("Import Failed", "Could not read file. Please try again.");
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all local data? This action cannot be undone."
      )
    ) {
      clearAllData();
      toast.success("Data Cleared", "All local data has been deleted");
      loadStats();
      // Reload page to reflect cleared data
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Backup, restore, and manage your local data
          </p>
        </div>
      </div>

      {/* Storage Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700 dark:text-blue-400">Transactions</span>
            <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
            {stats.transactionsCount}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-700 dark:text-green-400">Budgets</span>
            <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-300">
            {stats.budgetsCount}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700 dark:text-purple-400">Goals</span>
            <Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
            {stats.goalsCount}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-400">Storage</span>
            <HardDrive className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-300">
            {stats.totalSize.toFixed(1)} KB
          </p>
        </div>
      </div>

      {/* Last Sync */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Clock className="h-4 w-4" />
        <span>Last synced: {formatDate(stats.lastSync)}</span>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Local Storage:</strong> Your data is stored securely in your browser. Export
          your data regularly to create backups.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export Data */}
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Download className="h-5 w-5" />
          Export Data
        </button>

        {/* Import Data */}
        <label className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium cursor-pointer">
          <Upload className="h-5 w-5" />
          {isImporting ? "Importing..." : "Import Data"}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="sr-only"
          />
        </label>

        {/* Clear Data */}
        <button
          onClick={handleClearData}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <Trash2 className="h-5 w-5" />
          Clear All Data
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          How to use:
        </h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>
            <strong>Export:</strong> Download your data as a JSON file for backup
          </li>
          <li>
            <strong>Import:</strong> Restore your data from a previously exported backup file
          </li>
          <li>
            <strong>Clear:</strong> Delete all local data (transactions, budgets, goals)
          </li>
        </ul>
      </div>
    </div>
  );
}
