/**
 * Form data types for modals and user input
 */

export interface TransactionFormData {
  id?: string;
  accountId?: string;
  date: string;
  description: string;
  merchant?: string;
  amount: number;
  category: string;
  aiCategorized?: boolean;
  aiConfidence?: number;
}

export interface BudgetFormData {
  id?: string;
  category: string;
  amount: number;
  period: "monthly" | "weekly" | "yearly";
}

export interface GoalFormData {
  id?: string;
  name: string;
  goalType: "savings" | "debt";
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: number;
  status: "active" | "completed" | "paused";
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartDataPoint {
  category: string;
  amount: number;
  percentage: number;
  count?: number;
  fill?: string;
}

export interface LineChartDataPoint {
  date: string;
  income: number;
  expenses: number;
  net?: number;
  [key: string]: string | number | undefined;
}

export interface BarChartDataPoint {
  month: string;
  income: number;
  expenses: number;
  savings?: number;
  [key: string]: string | number | undefined;
}
