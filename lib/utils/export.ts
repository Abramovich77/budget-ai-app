import type { Transaction, Budget, Goal } from "@/types";

/**
 * Export utilities for downloading data in various formats
 */

/**
 * Convert an array of objects to CSV format
 */
function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) {
    return "";
  }

  // Use provided headers or extract from first object
  const columnHeaders = headers || Object.keys(data[0]);

  // Create CSV header row
  const headerRow = columnHeaders.join(",");

  // Create CSV data rows
  const dataRows = data.map((row) => {
    return columnHeaders
      .map((header) => {
        const value = row[header];

        // Handle different value types
        if (value === null || value === undefined) {
          return "";
        }

        // Convert to string and escape quotes
        const stringValue = String(value).replace(/"/g, '""');

        // Wrap in quotes if contains comma, quote, or newline
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue}"`;
        }

        return stringValue;
      })
      .join(",");
  });

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Trigger browser download of a file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to CSV
 */
export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const csvData = transactions.map((t) => ({
    Date: t.date,
    Description: t.description,
    Merchant: t.merchant || "",
    Category: t.category || "",
    Amount: t.amount,
    "AI Categorized": t.aiCategorized ? "Yes" : "No",
    "AI Confidence": t.aiConfidence ? `${(t.aiConfidence * 100).toFixed(1)}%` : "",
  }));

  const csv = convertToCSV(csvData);
  const filename = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Export budgets to CSV
 */
export function exportBudgetsToCSV(budgets: Budget[]): void {
  const csvData = budgets.flatMap((budget) =>
    budget.categories.map((cat) => ({
      "Budget Name": budget.name,
      Period: budget.period,
      Category: cat.name,
      Allocated: cat.allocated,
      Spent: cat.spent,
      Remaining: cat.allocated - cat.spent,
      "Progress %": ((cat.spent / cat.allocated) * 100).toFixed(1),
    }))
  );

  const csv = convertToCSV(csvData);
  const filename = `budgets_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Export goals to CSV
 */
export function exportGoalsToCSV(goals: Goal[]): void {
  const csvData = goals.map((g) => ({
    Name: g.name,
    Type: g.goalType,
    "Target Amount": g.targetAmount,
    "Current Amount": g.currentAmount,
    "Target Date": g.targetDate || "No deadline",
    Priority: g.priority,
    Status: g.status,
    "Progress %": g.progress.toFixed(1),
  }));

  const csv = convertToCSV(csvData);
  const filename = `goals_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Export spending report to CSV
 */
export function exportSpendingReportToCSV(
  data: Array<{ date: string; income: number; expenses: number; net: number }>
): void {
  const csvData = data.map((d) => ({
    Date: d.date,
    Income: d.income,
    Expenses: d.expenses,
    "Net Savings": d.net,
  }));

  const csv = convertToCSV(csvData);
  const filename = `spending_report_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Export category breakdown to CSV
 */
export function exportCategoryBreakdownToCSV(
  categories: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }>
): void {
  const csvData = categories.map((c) => ({
    Category: c.category,
    Amount: c.amount,
    "Percentage of Total": `${c.percentage.toFixed(1)}%`,
    "Transaction Count": c.count,
  }));

  const csv = convertToCSV(csvData);
  const filename = `category_breakdown_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename, "text/csv;charset=utf-8;");
}

/**
 * Export generic data to CSV with custom headers
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: string[]
): void {
  const csv = convertToCSV(data, headers);
  const timestampedFilename = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, timestampedFilename, "text/csv;charset=utf-8;");
}

/**
 * Export data to JSON (useful for backups)
 */
export function exportToJSON<T>(data: T, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const timestampedFilename = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
  downloadFile(json, timestampedFilename, "application/json;charset=utf-8;");
}
