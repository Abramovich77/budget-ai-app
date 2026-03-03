/**
 * Reusable form field component with validation and error display
 */

import { AlertCircle, Check } from "lucide-react";
import { ValidationResult } from "@/lib/validation/formValidation";

interface FormFieldProps {
  label: string;
  type?: "text" | "number" | "date" | "email" | "select";
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation?: ValidationResult;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select inputs
  min?: string | number;
  max?: string | number;
  step?: string;
  touched?: boolean; // Only show errors after field has been touched
  helpText?: string;
  showSuccessIcon?: boolean; // Show checkmark when valid
}

export function FormField({
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  validation,
  placeholder,
  required = false,
  options,
  min,
  max,
  step,
  touched = false,
  helpText,
  showSuccessIcon = true,
}: FormFieldProps) {
  const showError = touched && validation && !validation.isValid;
  const showSuccess = touched && validation && validation.isValid && showSuccessIcon;

  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition
    focus:ring-2 focus:outline-none
    ${
      showError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900/50"
        : showSuccess
        ? "border-green-300 focus:border-green-500 focus:ring-green-200 dark:border-green-700 dark:focus:ring-green-900/50"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900/50"
    }
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
  `.trim();

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="relative">
        {type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={inputClasses}
            required={required}
          >
            <option value="">Select {label.toLowerCase()}...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={inputClasses}
            required={required}
            min={min}
            max={max}
            step={step}
          />
        )}

        {/* Success Icon */}
        {showSuccess && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="h-5 w-5 text-green-500" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <div className="flex items-start gap-1 mt-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{validation.error}</span>
        </div>
      )}

      {/* Help Text */}
      {!showError && helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>
      )}
    </div>
  );
}

/**
 * Textarea variant for longer text inputs
 */
interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validation?: ValidationResult;
  placeholder?: string;
  required?: boolean;
  touched?: boolean;
  helpText?: string;
  rows?: number;
}

export function FormTextarea({
  label,
  value,
  onChange,
  onBlur,
  validation,
  placeholder,
  required = false,
  touched = false,
  helpText,
  rows = 3,
}: FormTextareaProps) {
  const showError = touched && validation && !validation.isValid;
  const showSuccess = touched && validation && validation.isValid;

  const textareaClasses = `
    w-full px-3 py-2 border rounded-lg transition
    focus:ring-2 focus:outline-none resize-none
    ${
      showError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-700 dark:focus:ring-red-900/50"
        : showSuccess
        ? "border-green-300 focus:border-green-500 focus:ring-green-200 dark:border-green-700 dark:focus:ring-green-900/50"
        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:ring-blue-900/50"
    }
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
  `.trim();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={textareaClasses}
        required={required}
        rows={rows}
      />

      {showError && (
        <div className="flex items-start gap-1 mt-1 text-red-600 dark:text-red-400 text-sm animate-fade-in">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{validation.error}</span>
        </div>
      )}

      {!showError && helpText && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>
      )}
    </div>
  );
}
