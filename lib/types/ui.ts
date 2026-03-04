/**
 * UI-related types for Budget AI
 *
 * Types for React components, form states, and UI interactions.
 */

import type { ReactNode, CSSProperties, ComponentType } from 'react';

// ============================================================================
// Component Props Types
// ============================================================================

export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  testId?: string;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

// ============================================================================
// Form Types
// ============================================================================

export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'radio';

export interface FormField<T = unknown> {
  name: string;
  label: string;
  type: FormFieldType;
  value: T;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[]; // For select/radio fields
  validation?: FieldValidation;
  helperText?: string;
  error?: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: ComponentType;
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface FormHandlers<T = Record<string, unknown>> {
  handleChange: (name: keyof T, value: unknown) => void;
  handleBlur: (name: keyof T) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
  setFieldValue: (name: keyof T, value: unknown) => void;
  setFieldError: (name: keyof T, error: string) => void;
  setFieldTouched: (name: keyof T, touched: boolean) => void;
}

// ============================================================================
// Toast/Notification Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
  persistent?: boolean;
  action?: ToastAction;
  position?: ToastPosition;
  createdAt: number;
}

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastContextValue {
  toasts: Toast[];
  success: (title: string, description?: string, duration?: number) => void;
  error: (title: string, description?: string, duration?: number) => void;
  warning: (title: string, description?: string, duration?: number) => void;
  info: (title: string, description?: string, duration?: number) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// ============================================================================
// Modal/Dialog Types
// ============================================================================

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

// ============================================================================
// Table Types
// ============================================================================

export interface Column<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
}

export interface TableProps<T = unknown> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  className?: string;
}

export interface TableState {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
  selectedRows: Set<string | number>;
}

// ============================================================================
// Chart Types
// ============================================================================

export type ChartType = 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter';

export interface ChartDataPoint {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

export interface ChartConfig {
  type: ChartType;
  series: ChartSeries[];
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  legend?: LegendConfig;
  tooltip?: TooltipConfig;
  responsive?: boolean;
  animation?: boolean;
  height?: number | string;
  width?: number | string;
}

export interface AxisConfig {
  label?: string;
  min?: number;
  max?: number;
  format?: (value: number) => string;
  gridLines?: boolean;
}

export interface LegendConfig {
  show: boolean;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export interface TooltipConfig {
  enabled: boolean;
  format?: (value: number, label: string) => string;
}

// ============================================================================
// Filter/Search Types
// ============================================================================

export interface FilterConfig<T = unknown> {
  field: keyof T;
  label: string;
  type: 'select' | 'multiselect' | 'range' | 'date' | 'search';
  options?: SelectOption[];
  placeholder?: string;
}

export interface ActiveFilter {
  field: string;
  value: unknown;
  operator?: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
}

export interface SearchState {
  query: string;
  filters: ActiveFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// Loading/Skeleton Types
// ============================================================================

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  count?: number;
  className?: string;
}

// ============================================================================
// Theme Types
// ============================================================================

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface Theme {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ============================================================================
// Navigation Types
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
  icon?: ComponentType;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
  external?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

// ============================================================================
// Type Utilities
// ============================================================================

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
