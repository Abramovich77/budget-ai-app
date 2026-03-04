/**
 * Utility types for Budget AI
 *
 * Generic utility types and helpers used throughout the application.
 */

// ============================================================================
// Async Operation Types
// ============================================================================

export type AsyncOperationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown, E = Error> {
  data: T | null;
  error: E | null;
  status: AsyncOperationStatus;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface AsyncOperation<T = unknown, E = Error> extends AsyncState<T, E> {
  execute: (...args: unknown[]) => Promise<void>;
  reset: () => void;
}

export interface MutationOptions<TData = unknown, TVariables = unknown> {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export interface QueryOptions<T = unknown> {
  enabled?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

export type Validator<T = unknown> = (value: T) => FieldValidationResult;

export type ValidatorRule<T = unknown> = {
  rule: (value: T) => boolean;
  message: string;
};

export interface ValidationSchema<T = Record<string, unknown>> {
  [key: string]: Validator | ValidatorRule<T[keyof T]>[];
}

// ============================================================================
// Event Handler Types
// ============================================================================

export type EventHandler<T = void> = (event: T) => void;

export type AsyncEventHandler<T = void> = (event: T) => Promise<void>;

export type KeyboardEventHandler = EventHandler<React.KeyboardEvent>;

export type MouseEventHandler = EventHandler<React.MouseEvent>;

export type ChangeEventHandler<T = HTMLInputElement> = EventHandler<React.ChangeEvent<T>>;

export type FormSubmitHandler = EventHandler<React.FormEvent>;

// ============================================================================
// Storage Types
// ============================================================================

export type StorageKey =
  | 'auth_token'
  | 'user_preferences'
  | 'theme'
  | 'recent_transactions'
  | 'budget_filters'
  | 'cached_insights';

export interface StorageItem<T = unknown> {
  value: T;
  expiresAt?: number;
  version?: number;
}

export interface StorageOptions {
  encrypt?: boolean;
  expiresIn?: number; // milliseconds
  version?: number;
}

// ============================================================================
// Cache Types
// ============================================================================

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt?: number;
  hits: number;
}

export interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
  onEvict?: (key: string, value: unknown) => void;
}

export interface Cache<T = unknown> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T, ttl?: number) => void;
  has: (key: string) => boolean;
  delete: (key: string) => boolean;
  clear: () => void;
  size: () => number;
}

// ============================================================================
// Function Types
// ============================================================================

export type AnyFunction = (...args: any[]) => any;

export type VoidFunction = () => void;

export type AsyncVoidFunction = () => Promise<void>;

export type Callback<T = void> = (result: T) => void;

export type ErrorCallback = (error: Error) => void;

export type Predicate<T> = (value: T) => boolean;

export type Comparator<T> = (a: T, b: T) => number;

export type Mapper<T, U> = (value: T, index: number) => U;

export type Reducer<T, U> = (accumulator: U, currentValue: T, index: number) => U;

// ============================================================================
// Debounce/Throttle Types
// ============================================================================

export interface DebouncedFunction<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export interface ThrottledFunction<T extends AnyFunction> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

// ============================================================================
// Retry Types
// ============================================================================

export interface RetryOptions {
  maxAttempts: number;
  delay: number; // milliseconds
  backoff?: 'linear' | 'exponential';
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export interface RetryState {
  attempt: number;
  maxAttempts: number;
  lastError: Error | null;
  isRetrying: boolean;
}

// ============================================================================
// Date/Time Types
// ============================================================================

export type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'iso';

export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

// Note: DateRange is defined in models.ts and re-exported from index.ts

export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public field?: string,
    public value?: unknown
  ) {
    super(message, 'VALIDATION_ERROR', 422);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(
    message: string,
    public url: string,
    public method: string
  ) {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

export interface ErrorInfo {
  message: string;
  code: string;
  statusCode?: number;
  field?: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// ============================================================================
// Intersection Observer Types
// ============================================================================

export interface IntersectionObserverConfig {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export interface IntersectionState {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

// ============================================================================
// Performance Types
// ============================================================================

export type DevicePerformance = 'high' | 'medium' | 'low';

export interface PerformanceMetrics {
  devicePerformance: DevicePerformance;
  cpuCores: number;
  memory: number;
  connectionType: string;
  prefersReducedMotion: boolean;
}

export interface RenderMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}

export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

// ============================================================================
// Type Utilities
// ============================================================================

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type Maybe<T> = T | null | undefined;

export type NonNullable<T> = Exclude<T, null | undefined>;

export type Primitive = string | number | boolean | null | undefined | symbol | bigint;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Primitive
    ? T[P]
    : T[P] extends Array<infer U>
    ? ReadonlyArray<DeepReadonly<U>>
    : DeepReadonly<T[P]>;
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, never>>;
  }[Keys];

export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

export type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};
