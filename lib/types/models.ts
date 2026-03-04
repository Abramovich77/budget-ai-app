/**
 * Core data models for Budget AI
 *
 * These types represent the main entities in the application.
 * They should match the database schema and API responses.
 */

// ============================================================================
// Transaction Types
// ============================================================================

export type TransactionType = 'income' | 'expense' | 'transfer';

export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'education'
  | 'salary'
  | 'investment'
  | 'other';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  date: string; // ISO 8601 date string
  merchant?: string;
  notes?: string;
  tags?: string[];
  recurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  createdAt: string;
  updatedAt: string;
}

export type RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  period: DateRange;
}

export interface CategorySpending {
  category: TransactionCategory;
  amount: number;
  count: number;
  percentage: number;
}

// ============================================================================
// Budget Types
// ============================================================================

export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type BudgetStatus = 'active' | 'paused' | 'exceeded' | 'completed';

export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: TransactionCategory;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  status: BudgetStatus;
  alertThreshold?: number; // Percentage (0-100)
  rollover?: boolean; // Carry unused budget to next period
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProgress {
  budgetId: string;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  daysRemaining: number;
  projectedSpending?: number;
}

// ============================================================================
// Goal Types
// ============================================================================

export type GoalType = 'savings' | 'debt';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export interface Goal {
  id: string;
  userId: string;
  name: string;
  goalType: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: number; // 1-10
  status: GoalStatus;
  description?: string;
  milestones?: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  amount: number;
  description: string;
  achieved: boolean;
  achievedDate?: string;
}

export interface GoalProgress {
  goalId: string;
  percentage: number;
  amountRemaining: number;
  daysRemaining: number;
  isOnTrack: boolean;
  projectedCompletionDate?: string;
  recommendedMonthlyContribution?: number;
}

// ============================================================================
// User Types
// ============================================================================

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  currency: string;
  locale: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  budgetAlerts: boolean;
  goalMilestones: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

export interface PrivacySettings {
  shareAnalytics: boolean;
  marketingEmails: boolean;
}

// ============================================================================
// Common Types
// ============================================================================

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterParams {
  categories?: TransactionCategory[];
  types?: TransactionType[];
  dateRange?: DateRange;
  minAmount?: number;
  maxAmount?: number;
  merchants?: string[];
  tags?: string[];
}

// ============================================================================
// Type Guards
// ============================================================================

export function isTransaction(obj: unknown): obj is Transaction {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'amount' in obj &&
    'type' in obj &&
    'category' in obj
  );
}

export function isBudget(obj: unknown): obj is Budget {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'amount' in obj &&
    'spent' in obj &&
    'period' in obj
  );
}

export function isGoal(obj: unknown): obj is Goal {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'goalType' in obj &&
    'targetAmount' in obj &&
    'currentAmount' in obj
  );
}
