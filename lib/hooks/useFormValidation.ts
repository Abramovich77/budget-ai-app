import { useState, useCallback } from "react";
import { z } from "zod";
import type { ValidationResult, FieldValidationResult } from "@/lib/types";

/**
 * Custom hook for form validation with Zod
 * Provides validation state, error messages, and validation functions
 */
export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  type FormData = z.infer<T>;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /**
   * Validate entire form
   */
  const validate = useCallback(
    (data: unknown): ValidationResult & { data?: FormData } => {
      const result = schema.safeParse(data);

      if (result.success) {
        setErrors({});
        return { isValid: true, errors: {}, data: result.data };
      }

      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path.join(".");
        formattedErrors[path] = error.message;
      });

      setErrors(formattedErrors);
      return { isValid: false, errors: formattedErrors };
    },
    [schema]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    (fieldName: string, value: unknown): FieldValidationResult => {
      try {
        // Extract the field schema - TypeScript doesn't have a way to safely access Zod shape
        // so we need to use type assertion here (this is a known limitation)
        const schemaShape = schema as unknown as z.ZodObject<Record<string, z.ZodTypeAny>>;
        const fieldSchema = schemaShape.shape?.[fieldName];
        if (!fieldSchema) {
          return { isValid: true };
        }

        fieldSchema.parse(value);

        // Clear error for this field
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });

        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errorMessage = error.errors[0]?.message || "Invalid value";
          setErrors((prev) => ({
            ...prev,
            [fieldName]: errorMessage,
          }));
          return { isValid: false, error: errorMessage };
        }
        return { isValid: false, error: "Unknown validation error" };
      }
    },
    [schema]
  );

  /**
   * Mark a field as touched
   */
  const touchField = useCallback((fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Reset validation state
   */
  const reset = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  /**
   * Check if a field has been touched
   */
  const isTouched = useCallback(
    (fieldName: string) => touched[fieldName] || false,
    [touched]
  );

  /**
   * Get error for a field (only if touched)
   */
  const getFieldError = useCallback(
    (fieldName: string) => {
      return touched[fieldName] ? errors[fieldName] : undefined;
    },
    [errors, touched]
  );

  return {
    errors,
    touched,
    validate,
    validateField,
    touchField,
    clearErrors,
    clearFieldError,
    reset,
    isTouched,
    getFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}

/**
 * Example usage:
 *
 * const { validate, validateField, getFieldError, touchField } = useFormValidation(transactionSchema);
 *
 * const handleSubmit = (data) => {
 *   const result = validate(data);
 *   if (result.isValid) {
 *     // Submit form
 *   }
 * };
 *
 * const handleBlur = (field) => {
 *   touchField(field);
 *   validateField(field, formData[field]);
 * };
 *
 * <input
 *   onBlur={() => handleBlur('amount')}
 *   className={getFieldError('amount') ? 'error' : ''}
 * />
 * {getFieldError('amount') && <span>{getFieldError('amount')}</span>}
 */
