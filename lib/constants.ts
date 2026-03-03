// Application constants

import type { AccountType, BudgetPeriod, GoalPriority, CategoryType } from "@/types";

// Transaction Categories
export const TRANSACTION_CATEGORIES = [
  "Groceries",
  "Dining Out",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Education",
  "Housing",
  "Income",
  "Savings",
  "Debt Payment",
  "Insurance",
  "Other",
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

// Budget Categories (excluding Income)
export const BUDGET_CATEGORIES = [
  "Groceries",
  "Dining Out",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Education",
  "Housing",
  "Other",
] as const;

// Budget Periods
export const BUDGET_PERIODS: Array<{ value: BudgetPeriod; label: string }> = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

// Goal Priorities
export const GOAL_PRIORITIES: Array<{
  value: GoalPriority;
  label: string;
  color: string;
}> = [
  { value: "high", label: "High", color: "red" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "low", label: "Low", color: "green" },
];

// Account Types
export const ACCOUNT_TYPES: Array<{ value: AccountType; label: string }> = [
  { value: "checking", label: "Checking Account" },
  { value: "savings", label: "Savings Account" },
  { value: "credit", label: "Credit Card" },
  { value: "investment", label: "Investment Account" },
  { value: "cash", label: "Cash" },
];

// Category Colors
export const CATEGORY_COLORS: Record<string, string> = {
  Groceries: "#10b981",
  "Dining Out": "#f59e0b",
  Transportation: "#3b82f6",
  Entertainment: "#8b5cf6",
  Shopping: "#ef4444",
  Healthcare: "#06b6d4",
  Utilities: "#84cc16",
  Housing: "#6366f1",
  Income: "#22c55e",
  Savings: "#14b8a6",
  "Debt Payment": "#f97316",
  Insurance: "#a855f7",
  Education: "#ec4899",
  Other: "#64748b",
};

// Currency Settings
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  ILS: "₪",
};

export const DEFAULT_CURRENCY = "USD";

// Date Formats
export const DATE_FORMAT_SHORT = "MMM d";
export const DATE_FORMAT_LONG = "MMMM d, yyyy";
export const DATE_FORMAT_ISO = "yyyy-MM-dd";

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// AI Settings
export const AI_CONFIDENCE_THRESHOLD = 0.8;
export const AI_MODEL = "claude-3-5-sonnet-20241022";

// Validation Limits
export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_GOAL_NAME_LENGTH = 100;
export const MIN_PASSWORD_LENGTH = 8;

// Chart Colors
export const CHART_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
  "#ec4899", // pink
  "#64748b", // slate
];
