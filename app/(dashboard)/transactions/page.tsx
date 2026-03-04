"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, Search, Filter, Upload, Brain, List, Grid3x3, Zap } from "lucide-react";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { ProgressLoadingScreen } from "@/components/ui/ProgressLoader";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { ExportTransactionsModal } from "@/components/transactions/ExportTransactionsModal";
import { KeyboardHint, QuickTip } from "@/components/ui/KeyboardHint";
import { InfoTooltip } from "@/components/ui/Tooltip";
import { ExportButton } from "@/components/ui/ExportButton";
import { exportTransactionsToCSV } from "@/lib/utils/export";
import { useUserPreferences } from "@/lib/hooks/useLocalStorage";
import { useSortedData, useSearchResults } from "@/lib/hooks/useOptimizedData";
import { useKeyboardShortcut } from "@/lib/hooks/useKeyboardShortcut";
import { TransactionFilters, applyTransactionFilters, type TransactionFilterOptions } from "@/components/transactions/TransactionFilters";
import type { TransactionFormData } from "@/types/forms";
import { HelpTooltip, FeatureBanner } from "@/components/ui/HelpTooltip";
import { useToast } from "@/components/ui/Toast";

// Mock data - в продакшене будет загружаться из API
const mockTransactions = [
  {
    id: "1",
    date: "2026-03-03",
    description: "Whole Foods Market",
    merchant: "Whole Foods",
    amount: -124.50,
    category: "Groceries",
    aiCategorized: true,
    aiConfidence: 0.95,
  },
  {
    id: "2",
    date: "2026-03-01",
    description: "Payroll Deposit",
    merchant: "Acme Corp",
    amount: 5000.00,
    category: "Income",
    aiCategorized: true,
    aiConfidence: 0.99,
  },
  {
    id: "3",
    date: "2026-03-01",
    description: "Netflix Subscription",
    merchant: "Netflix",
    amount: -15.99,
    category: "Entertainment",
    aiCategorized: true,
    aiConfidence: 0.98,
  },
  {
    id: "4",
    date: "2026-02-28",
    description: "Shell Gas Station",
    merchant: "Shell",
    amount: -45.30,
    category: "Transportation",
    aiCategorized: true,
    aiConfidence: 0.92,
  },
  {
    id: "5",
    date: "2026-02-27",
    description: "Starbucks",
    merchant: "Starbucks",
    amount: -6.75,
    category: "Dining Out",
    aiCategorized: true,
    aiConfidence: 0.97,
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<typeof mockTransactions>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [preferences, setPreferences] = useUserPreferences();
  const [filters, setFilters] = useState<TransactionFilterOptions>({
    categories: [],
    showIncome: true,
    showExpenses: true,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { success, successWithUndo, error } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    description: "",
    merchant: "",
    amount: "",
    category: "",
  });

  // Keyboard shortcuts for this page
  useKeyboardShortcut({
    key: "n",
    callback: () => setShowAddModal(true),
    enabled: !showAddModal,
  });

  useKeyboardShortcut({
    key: "f",
    callback: () => searchInputRef.current?.focus(),
  });

  useKeyboardShortcut({
    key: "e",
    callback: () => setShowExportModal(true),
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filter from preferences
  useEffect(() => {
    if (preferences.transactionFilter) {
      setSearchQuery(preferences.transactionFilter);
    }
  }, []);

  // Save filter to preferences when it changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPreferences({ ...preferences, transactionFilter: value });
  };

  // Apply search filter using optimized search hook
  const searchFilteredTransactions = useSearchResults(
    transactions,
    searchQuery,
    ["description", "merchant", "category"]
  );

  // Apply advanced filters - memoized
  const filteredTransactions = useMemo(() =>
    applyTransactionFilters(searchFilteredTransactions, filters),
    [searchFilteredTransactions, filters]
  );

  // Sort transactions using optimized sort hook
  const sortedTransactions = useSortedData(
    filteredTransactions,
    preferences.transactionSortBy,
    preferences.transactionSortOrder
  );

  const handleAddTransaction = (newTransaction: TransactionFormData) => {
    setTransactions((prev) => [{ ...newTransaction, id: String(Date.now()) } as typeof mockTransactions[0], ...prev]);
    success("Transaction Added", "Your transaction has been successfully saved.");
  };

  const handleDeleteTransaction = (id: string) => {
    // Store the deleted transaction for undo functionality
    const deletedTransaction = transactions.find((t) => t.id === id);
    if (!deletedTransaction) return;

    // Remove transaction
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Show success toast with undo action
    successWithUndo(
      "Transaction Deleted",
      "The transaction has been removed.",
      () => {
        // Undo: restore the transaction
        setTransactions((prev) => [deletedTransaction, ...prev]);
        success("Transaction Restored", "The transaction has been restored.");
      },
      5000 // 5 seconds to undo
    );
  };

  const handleStartEdit = (transaction: typeof mockTransactions[0]) => {
    setEditingId(transaction.id);
    setEditForm({
      description: transaction.description,
      merchant: transaction.merchant,
      amount: String(Math.abs(transaction.amount)),
      category: transaction.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      description: "",
      merchant: "",
      amount: "",
      category: "",
    });
  };

  const handleSaveEdit = (id: string) => {
    // Get original transaction for undo
    const originalTransaction = transactions.find((t) => t.id === id);
    if (!originalTransaction) return;

    // Validate amount
    const amountValue = parseFloat(editForm.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      error("Invalid Amount", "Please enter a valid positive number.");
      return;
    }

    // Determine if it's income or expense based on original
    const amount = originalTransaction.amount > 0 ? amountValue : -amountValue;

    // Optimistic update: update UI immediately
    const updatedTransaction = {
      ...originalTransaction,
      description: editForm.description,
      merchant: editForm.merchant,
      amount: amount,
      category: editForm.category,
    };

    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? updatedTransaction : t))
    );

    // Clear edit mode
    setEditingId(null);

    // Show success toast with undo
    successWithUndo(
      "Transaction Updated",
      "Your changes have been saved.",
      () => {
        // Undo: restore original transaction
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? originalTransaction : t))
        );
        success("Changes Reverted", "Transaction restored to original values.");
      },
      5000
    );
  };

  // Get unique categories for filter - memoized
  const availableCategories = useMemo(() =>
    Array.from(new Set(transactions.map(t => t.category))).sort(),
    [transactions]
  );

  if (loading) {
    return (
      <ProgressLoadingScreen
        message="Loading transactions..."
        simulate={true}
        estimatedDuration={1000}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddTransaction}
      />

      {/* Export Transactions Modal */}
      <ExportTransactionsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        transactions={sortedTransactions.map(t => ({
          id: t.id,
          date: t.date,
          description: t.description,
          merchant: t.merchant,
          amount: t.amount,
          category: t.category,
          aiCategorized: t.aiCategorized,
          aiConfidence: t.aiConfidence,
        }))}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              All your financial transactions in one place
            </p>
          </div>
          <HelpTooltip
            content="Track all your income and expenses here. Use AI categorization to automatically organize your transactions and gain insights into your spending patterns."
            type="help"
            position="right"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="group bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
        >
          <Plus className="h-5 w-5" />
          <span>Add Transaction</span>
          <KeyboardHint shortcut="N" showOnHover size="xs" className="bg-blue-700 border-blue-600" />
        </button>
      </div>

      {/* Feature Banner */}
      <FeatureBanner
        title="AI-Powered Categorization"
        description="Our AI automatically categorizes your transactions based on merchant names and descriptions, saving you time and ensuring consistent tracking."
        type="tip"
        dismissible
      />

      {/* Keyboard Shortcuts Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 animate-fade-in" style={{ animationDelay: "0.05s" }}>
        <QuickTip shortcut="N" description="Add new transaction" icon={<Plus className="h-4 w-4" />} />
        <QuickTip shortcut="F" description="Focus search" icon={<Search className="h-4 w-4" />} />
        <QuickTip shortcut="E" description="Export transactions" icon={<Upload className="h-4 w-4" />} />
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                aria-label="Search transactions"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <KeyboardHint shortcut="F" size="xs" />
              </div>
            </div>
          </div>

          {/* Sort By */}
          <select
            value={preferences.transactionSortBy}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                transactionSortBy: e.target.value as "date" | "amount" | "category",
              })
            }
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-600"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() =>
              setPreferences({
                ...preferences,
                transactionSortOrder: preferences.transactionSortOrder === "asc" ? "desc" : "asc",
              })
            }
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            title={`Sort ${preferences.transactionSortOrder === "asc" ? "Ascending" : "Descending"}`}
          >
            <Filter className="h-5 w-5 mr-2" />
            {preferences.transactionSortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>

          {/* View Toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setPreferences({ ...preferences, transactionView: "list" })}
              className={`px-3 py-2 ${
                preferences.transactionView === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              } transition`}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setPreferences({ ...preferences, transactionView: "grid" })}
              className={`px-3 py-2 ${
                preferences.transactionView === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
              } transition`}
              title="Grid View"
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
          </div>

          {/* Import */}
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Upload className="h-5 w-5 mr-2" />
            Import
          </button>

          {/* Export */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Upload className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 flex items-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <Brain className="h-6 w-6 text-blue-600 mr-3" />
        <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <span className="font-semibold">{transactions.filter(t => t.aiCategorized).length} transactions</span> automatically categorized by AI with 95%+ accuracy
          <InfoTooltip content="Our AI analyzes transaction descriptions and automatically assigns the most appropriate category, learning from your patterns over time" position="bottom" />
        </p>
      </div>

      {/* Advanced Filters */}
      <div className="mb-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
          availableCategories={availableCategories}
        />
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                AI
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-6 py-4">
                      <TableRowSkeleton />
                    </td>
                  </tr>
                ))}
              </>
            ) : sortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No transactions found matching your search" : "No transactions yet"}
                  </p>
                </td>
              </tr>
            ) : (
              sortedTransactions.map((transaction, index) => {
                const isEditing = editingId === transaction.id;

                return (
                  <tr
                    key={transaction.id}
                    className={`transition animate-fade-in ${
                      isEditing ? "bg-blue-50 dark:bg-blue-900/10" : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {isEditing ? (
                      <>
                        {/* Date (non-editable) */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Description + Merchant (edit) */}
                        <td className="px-6 py-4 text-sm">
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm.merchant}
                              onChange={(e) => setEditForm({ ...editForm, merchant: e.target.value })}
                              placeholder="Merchant"
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <input
                              type="text"
                              value={editForm.description}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              placeholder="Description"
                              className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                            />
                          </div>
                        </td>

                        {/* Category (edit) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            placeholder="Category"
                            className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </td>

                        {/* Amount (edit) */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            placeholder="0.00"
                            className="w-24 px-2 py-1 text-sm text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </td>

                        {/* AI Badge (non-editable) */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {transaction.aiCategorized && (
                            <div className="inline-flex items-center">
                              <Brain className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </td>

                        {/* Actions (Save/Cancel) */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleSaveEdit(transaction.id)}
                            className="text-green-600 hover:text-green-900 dark:hover:text-green-400 mr-3 transition font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-400 transition"
                          >
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          <div>
                            <p className="font-medium">{transaction.merchant}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">
                              {transaction.description}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {transaction.category}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                          <span
                            className={
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-gray-900 dark:text-white"
                            }
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </td>

                        {/* AI Badge */}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {transaction.aiCategorized && (
                            <div className="inline-flex items-center group relative">
                              <Brain className="h-4 w-4 text-blue-600" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
                                AI: {(transaction.aiConfidence * 100).toFixed(0)}% confident
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleStartEdit(transaction)}
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{filteredTransactions.length}</span> of{" "}
          <span className="font-medium">{transactions.length}</span> transactions
        </p>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
