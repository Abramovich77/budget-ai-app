"use client";

import { useState } from "react";
import { Plus, Search, Filter, Download, Upload, Brain } from "lucide-react";

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
  const [transactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            All your financial transactions in one place
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filter */}
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>

          {/* Import */}
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Upload className="h-5 w-5 mr-2" />
            Import
          </button>

          {/* Export */}
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* AI Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6 flex items-center">
        <Brain className="h-6 w-6 text-blue-600 mr-3" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-semibold">{transactions.filter(t => t.aiCategorized).length} transactions</span> automatically categorized by AI with 95%+ accuracy
        </p>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No transactions found matching your search" : "No transactions yet"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
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
                    <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 mr-3">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
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
