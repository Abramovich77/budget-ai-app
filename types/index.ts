// Core types for the Budget AI application

// User and Authentication
export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expires: string;
}

// Household and Accounts
export interface Household {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  householdId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountType = "checking" | "savings" | "credit" | "investment" | "cash";

// Transactions
export interface Transaction {
  id: string;
  accountId: string;
  householdId: string;
  date: string;
  description: string;
  merchant?: string;
  amount: number;
  categoryId: string;
  category?: string;
  aiCategorized: boolean;
  aiConfidence?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionFormData {
  description: string;
  amount: string | number;
  category: string;
  date: string;
  type: "income" | "expense";
  merchant?: string;
  notes?: string;
}

// Categories
export interface Category {
  id: string;
  householdId: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  parentCategoryId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CategoryType = "income" | "expense" | "transfer";

// Budgets
export interface Budget {
  id: string;
  householdId: string;
  name: string;
  period: BudgetPeriod;
  startDate: Date;
  endDate: Date;
  totalAllocated: number;
  totalSpent: number;
  categories: BudgetCategory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  categoryId: string;
  name: string;
  allocated: number;
  spent: number;
  color?: string;
}

export interface BudgetFormData {
  category: string;
  amount: string | number;
  period: BudgetPeriod;
}

export type BudgetPeriod = "weekly" | "monthly" | "yearly";

// Goals
export interface Goal {
  id: string;
  householdId: string;
  name: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoalFormData {
  name: string;
  targetAmount: string | number;
  currentAmount?: string | number;
  deadline?: string;
  priority: GoalPriority;
}

export type GoalType = "savings" | "debt" | "investment";
export type GoalPriority = "high" | "medium" | "low";
export type GoalStatus = "active" | "completed" | "paused";

// AI Insights
export interface AIInsight {
  id: string;
  householdId: string;
  insightType: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
  actionable: boolean;
  actionText?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export type InsightType =
  | "spending_alert"
  | "budget_warning"
  | "savings_opportunity"
  | "goal_progress"
  | "trend_analysis";

export type InsightSeverity = "info" | "warning" | "critical";

// Reports and Analytics
export interface SpendingReport {
  period: {
    start: Date;
    end: Date;
  };
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: CategorySpending[];
  trends: SpendingTrend[];
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface SpendingTrend {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

// UI State Types
export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetRemaining: number;
}

export interface FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  categories?: string[];
  accounts?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  searchQuery?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
}

// Form Error Types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
}
