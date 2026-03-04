/**
 * API-related types for Budget AI
 *
 * Types for API requests, responses, errors, and HTTP operations.
 */

import type { Transaction, Budget, Goal, User } from './models';

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string; // For validation errors
  stack?: string; // Only in development
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method: ApiMethod;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  retries?: number;
}

// ============================================================================
// Resource API Types
// ============================================================================

// Transactions API
export interface CreateTransactionRequest {
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  description: string;
  date: string;
  merchant?: string;
  notes?: string;
  tags?: string[];
  recurring?: boolean;
  recurringFrequency?: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
  id: string;
}

export interface GetTransactionsRequest {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  types?: string[];
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export type GetTransactionsResponse = ApiResponse<{
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}>;

// Budgets API
export interface CreateBudgetRequest {
  name: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  alertThreshold?: number;
  rollover?: boolean;
}

export interface UpdateBudgetRequest extends Partial<CreateBudgetRequest> {
  id: string;
}

export type GetBudgetsResponse = ApiResponse<Budget[]>;

// Goals API
export interface CreateGoalRequest {
  name: string;
  goalType: 'savings' | 'debt';
  targetAmount: number;
  currentAmount?: number;
  targetDate: string;
  priority: number;
  description?: string;
}

export interface UpdateGoalRequest extends Partial<CreateGoalRequest> {
  id: string;
}

export type GetGoalsResponse = ApiResponse<Goal[]>;

// User API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresAt: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  preferences?: Partial<User['preferences']>;
}

// ============================================================================
// WebSocket Types
// ============================================================================

export type WebSocketMessageType =
  | 'transaction.created'
  | 'transaction.updated'
  | 'transaction.deleted'
  | 'budget.alert'
  | 'goal.milestone';

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  data: T;
  timestamp: string;
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

export enum HttpStatusCode {
  OK = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

// ============================================================================
// API Error Codes
// ============================================================================

export enum ApiErrorCode {
  // Authentication
  InvalidCredentials = 'INVALID_CREDENTIALS',
  TokenExpired = 'TOKEN_EXPIRED',
  Unauthorized = 'UNAUTHORIZED',

  // Validation
  ValidationError = 'VALIDATION_ERROR',
  InvalidInput = 'INVALID_INPUT',
  MissingRequired = 'MISSING_REQUIRED',

  // Resources
  NotFound = 'NOT_FOUND',
  AlreadyExists = 'ALREADY_EXISTS',
  Conflict = 'CONFLICT',

  // Rate Limiting
  RateLimitExceeded = 'RATE_LIMIT_EXCEEDED',

  // Server
  InternalError = 'INTERNAL_ERROR',
  ServiceUnavailable = 'SERVICE_UNAVAILABLE',
  TimeoutError = 'TIMEOUT_ERROR',
}

// ============================================================================
// Type Guards
// ============================================================================

export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    typeof (obj as ApiResponse).success === 'boolean'
  );
}

export function isApiError(obj: unknown): obj is ApiError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    'message' in obj &&
    typeof (obj as ApiError).code === 'string' &&
    typeof (obj as ApiError).message === 'string'
  );
}
