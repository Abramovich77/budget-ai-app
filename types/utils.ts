/**
 * Utility Types
 *
 * Common TypeScript utility types for the application.
 */

import type * as React from "react";

/**
 * Make specific properties optional
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Deep readonly type
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Maybe type (nullable or undefined)
 */
export type Maybe<T> = T | null | undefined;

/**
 * Extract promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;

/**
 * Function with no return value
 */
export type VoidFunction = () => void;

/**
 * Async function with no return value
 */
export type AsyncVoidFunction = () => Promise<void>;

/**
 * Extract array element type
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Extract object values type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Create a type with all properties set to a specific type
 */
export type RecordOf<K extends keyof any, T> = {
  [P in K]: T;
};

/**
 * Omit multiple keys
 */
export type OmitMultiple<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Pick multiple keys
 */
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;

/**
 * Create a type from union of string literals
 */
export type StringLiteral<T extends string> = T | Omit<string, T>;

/**
 * Branded type for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * ID types with branding
 */
export type UserId = Brand<string, "UserId">;
export type TransactionId = Brand<string, "TransactionId">;
export type BudgetId = Brand<string, "BudgetId">;
export type CategoryId = Brand<string, "CategoryId">;
export type AccountId = Brand<string, "AccountId">;
export type GoalId = Brand<string, "GoalId">;
export type HouseholdId = Brand<string, "HouseholdId">;

/**
 * ISO date string type
 */
export type ISODateString = Brand<string, "ISODateString">;

/**
 * Email type
 */
export type Email = Brand<string, "Email">;

/**
 * URL type
 */
export type URL = Brand<string, "URL">;

/**
 * Currency code type
 */
export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | StringLiteral<string>;

/**
 * Status types
 */
export type LoadingStatus = "idle" | "loading" | "success" | "error";
export type AsyncStatus = "pending" | "fulfilled" | "rejected";

/**
 * Form state types
 */
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Async data state
 */
export interface AsyncData<T, E = Error> {
  data: T | null;
  error: E | null;
  loading: boolean;
  refetch?: () => Promise<void>;
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * Sort state
 */
export interface SortState<T = string> {
  field: T;
  direction: "asc" | "desc";
}

/**
 * Filter state
 */
export type FilterState<T> = Partial<T>;

/**
 * Selection state
 */
export interface SelectionState<T> {
  selected: T[];
  isSelected: (item: T) => boolean;
  toggle: (item: T) => void;
  selectAll: () => void;
  deselectAll: () => void;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Toast types
 */
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Theme types
 */
export type Theme = "light" | "dark" | "system";

/**
 * Color scheme
 */
export type ColorScheme =
  | "blue"
  | "green"
  | "red"
  | "yellow"
  | "purple"
  | "pink"
  | "indigo"
  | "gray";

/**
 * Size variants
 */
export type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Variant types
 */
export type Variant = "default" | "primary" | "secondary" | "danger" | "warning" | "success" | "ghost" | "outline";

/**
 * Position types
 */
export type Position = "top" | "right" | "bottom" | "left";
export type Alignment = "start" | "center" | "end";

/**
 * Responsive value type
 */
export type ResponsiveValue<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T };

/**
 * Class name type
 */
export type ClassName = string | undefined | null | false | { [key: string]: boolean };

/**
 * Children prop type
 */
export type Children = React.ReactNode;

/**
 * Component props with children
 */
export interface WithChildren {
  children: React.ReactNode;
}

/**
 * Component props with className
 */
export interface WithClassName {
  className?: string;
}

/**
 * Component props with both
 */
export interface BaseComponentProps extends WithChildren, WithClassName {}

/**
 * Event handler types
 */
export type ChangeHandler<T = string> = (value: T) => void;
export type ClickHandler = (event: React.MouseEvent) => void;
export type SubmitHandler<T = Record<string, any>> = (data: T) => void | Promise<void>;
export type KeyboardHandler = (event: React.KeyboardEvent) => void;

/**
 * Ref types
 */
export type Ref<T> = React.RefObject<T> | React.MutableRefObject<T> | ((instance: T | null) => void) | null;

/**
 * Extract component props
 */
export type ComponentProps<T extends React.ComponentType<any>> = T extends React.ComponentType<infer P>
  ? P
  : never;

/**
 * Extract element props
 */
export type ElementProps<T extends keyof React.JSX.IntrinsicElements> = React.JSX.IntrinsicElements[T];

/**
 * Polymorphic component props
 */
export type PolymorphicComponentProps<
  E extends React.ElementType,
  Props = {}
> = Props & Omit<React.ComponentPropsWithRef<E>, keyof Props> & { as?: E };

/**
 * API fetch options
 */
export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retry?: {
    count: number;
    delay: number;
  };
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Field validation
 */
export type FieldValidator<T> = (value: T) => string | undefined;

/**
 * Form validators
 */
export type FormValidators<T> = {
  [K in keyof T]?: FieldValidator<T[K]> | FieldValidator<T[K]>[];
};

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Feature flag type
 */
export type FeatureFlag = Record<string, boolean>;

/**
 * Environment type
 */
export type Environment = "development" | "staging" | "production" | "test";

/**
 * API method types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * HTTP status code types
 */
export type HttpStatusCode =
  | 200 // OK
  | 201 // Created
  | 204 // No Content
  | 400 // Bad Request
  | 401 // Unauthorized
  | 403 // Forbidden
  | 404 // Not Found
  | 409 // Conflict
  | 422 // Unprocessable Entity
  | 429 // Too Many Requests
  | 500 // Internal Server Error
  | 503; // Service Unavailable
