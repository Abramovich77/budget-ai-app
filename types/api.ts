/**
 * API Response Types
 *
 * Centralized type definitions for API request/response payloads.
 */

/**
 * Standard API error response
 */
export interface ApiError {
  error: {
    message: string;
    code?: string;
    details?: unknown;
    timestamp: string;
    path?: string;
  };
}

/**
 * Standard API success response wrapper
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
  timestamp?: string;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore?: boolean;
}

/**
 * Transaction types
 */
export interface Transaction {
  id: string;
  accountId: string;
  categoryId?: string | null;
  amount: number;
  currency: string;
  date: string | Date;
  description?: string | null;
  merchantName?: string | null;
  plaidTransactionId?: string | null;
  isPending: boolean;
  isRecurring: boolean;
  aiCategorized: boolean;
  aiConfidence?: number | null;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: Category | null;
  account?: Account;
}

export interface CreateTransactionRequest {
  accountId: string;
  categoryId?: string;
  amount: number;
  date: string;
  description?: string;
  merchantName?: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  notes?: string;
}

export interface TransactionQueryParams {
  limit?: number;
  offset?: number;
  categoryId?: string;
  accountId?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Budget types
 */
export interface Budget {
  id: string;
  householdId: string;
  name: string;
  methodology: "zero-based" | "50-30-20" | "envelope";
  periodType: "weekly" | "monthly" | "annual";
  startDate: string | Date;
  endDate?: string | Date | null;
  isActive: boolean;
  createdAt: string | Date;
  items?: BudgetItem[];
  household?: {
    name: string;
  };
}

export interface BudgetItem {
  id: string;
  budgetId: string;
  categoryId: string;
  allocatedAmount: number;
  spentAmount: number;
  rolloverEnabled: boolean;
  notes?: string | null;
  category?: Category;
}

export interface CreateBudgetRequest {
  householdId: string;
  name: string;
  methodology: "zero-based" | "50-30-20" | "envelope";
  periodType: "weekly" | "monthly" | "annual";
  startDate: string;
  items: Array<{
    categoryId: string;
    allocatedAmount: number;
    rolloverEnabled?: boolean;
    notes?: string;
  }>;
}

export interface BudgetsResponse {
  budgets: Budget[];
}

/**
 * Category types
 */
export interface Category {
  id: string;
  userId?: string | null;
  householdId?: string | null;
  name: string;
  type: "income" | "expense" | "transfer";
  parentCategoryId?: string | null;
  icon?: string | null;
  color?: string | null;
  isSystem: boolean;
  createdAt: string | Date;
  parentCategory?: Category | null;
  subCategories?: Category[];
}

export interface CreateCategoryRequest {
  name: string;
  type: "income" | "expense" | "transfer";
  parentCategoryId?: string;
  icon?: string;
  color?: string;
}

/**
 * Account types
 */
export interface Account {
  id: string;
  userId: string;
  householdId?: string | null;
  plaidAccountId?: string | null;
  accountType: "checking" | "savings" | "credit";
  bankName?: string | null;
  accountName?: string | null;
  currency: string;
  currentBalance: number;
  availableBalance?: number | null;
  isActive: boolean;
  lastSynced?: string | Date | null;
  createdAt: string | Date;
}

export interface CreateAccountRequest {
  accountType: "checking" | "savings" | "credit";
  bankName?: string;
  accountName?: string;
  currentBalance: number;
  currency?: string;
}

/**
 * Goal types
 */
export interface Goal {
  id: string;
  householdId: string;
  name: string;
  goalType: "savings" | "debt" | "investment";
  targetAmount: number;
  currentAmount: number;
  targetDate?: string | Date | null;
  priority: number;
  status: "active" | "completed" | "paused";
  createdAt: string | Date;
}

export interface CreateGoalRequest {
  householdId: string;
  name: string;
  goalType: "savings" | "debt" | "investment";
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  priority?: number;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  status?: "active" | "completed" | "paused";
}

/**
 * AI Categorization types
 */
export interface CategorizationRequest {
  description: string;
  amount?: number;
  merchant?: string;
}

export interface CategorizationResponse {
  category: string;
  confidence: number;
  alternatives?: string[];
  note?: string;
}

/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastLogin?: string | Date | null;
  emailVerified: boolean;
  preferences?: Record<string, any>;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Audit Log types
 */
export interface AuditLog {
  id: string;
  eventType: string;
  userId?: string | null;
  userEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  action?: string | null;
  details?: Record<string, any> | null;
  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  status: "SUCCESS" | "FAILURE";
  errorMessage?: string | null;
  timestamp: string | Date;
}

export interface AuditLogsResponse {
  success: true;
  logs: AuditLog[];
  total: number;
  limit: number;
  offset: number;
  timestamp: string;
}

export interface AuditStatsResponse {
  success: true;
  stats: {
    totalEvents: number;
    dailyEvents: number;
    weeklyEvents: number;
    failedAuth: number;
    dataModifications: number;
    accessDenied: number;
  };
  timestamp: string;
}

/**
 * Request Logging types
 */
export interface ApiLogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  method: string;
  path: string;
  query?: string;
  status?: number;
  duration?: number;
  ip?: string;
  userAgent?: string;
  userId?: string;
  error?: string;
  requestId: string;
}

export interface LogsResponse {
  success: true;
  type: "recent" | "errors" | "analytics";
  data: ApiLogEntry[] | LogAnalytics;
  timestamp: string;
}

export interface LogAnalytics {
  totalRequests: number;
  hourlyRequests: number;
  dailyRequests: number;
  errorCount: number;
  errorRate: number;
  avgDuration: number;
  statusCodes: Record<number, number>;
  topEndpoints: Array<{
    path: string;
    count: number;
  }>;
}

/**
 * Household types
 */
export interface Household {
  id: string;
  name: string;
  createdAt: string | Date;
  settings?: Record<string, any>;
  members?: HouseholdMember[];
}

export interface HouseholdMember {
  householdId: string;
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string | Date;
  permissions?: Record<string, any>;
  user?: User;
}

/**
 * AI Insight types
 */
export interface AIInsight {
  id: string;
  userId: string;
  insightType: string;
  title?: string | null;
  description?: string | null;
  severity?: "info" | "warning" | "critical" | null;
  actionable: boolean;
  actionUrl?: string | null;
  dismissed: boolean;
  createdAt: string | Date;
  expiresAt?: string | Date | null;
}

/**
 * Notification types
 */
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title?: string | null;
  message?: string | null;
  read: boolean;
  actionUrl?: string | null;
  createdAt: string | Date;
}

/**
 * Type guards
 */
export function isApiError(response: any): response is ApiError {
  return response && typeof response === "object" && "error" in response;
}

export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && typeof response === "object" && "success" in response && response.success === true;
}

export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return (
    response &&
    typeof response === "object" &&
    "items" in response &&
    "total" in response &&
    Array.isArray(response.items)
  );
}
