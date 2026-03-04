import { z } from "zod";

/**
 * Validation helper utilities
 * Provides easy-to-use functions for form and data validation
 */

/**
 * Format Zod errors into a user-friendly object
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return errors;
}

/**
 * Validate data against a Zod schema
 * Returns typed data or formatted errors
 */
export function validateWithSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: formatZodErrors(result.error) };
}

/**
 * Async version of validateWithSchema
 */
export async function validateWithSchemaAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: Record<string, string> }> {
  const result = await schema.safeParseAsync(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, errors: formatZodErrors(result.error) };
}

/**
 * Validate a single field value
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): { isValid: true } | { isValid: false; error: string } {
  try {
    // Extract field schema
    const fieldSchema = (schema as any).shape?.[fieldName];
    if (!fieldSchema) {
      return { isValid: true };
    }

    fieldSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || "Invalid value" };
    }
    return { isValid: false, error: "Validation failed" };
  }
}

/**
 * Check if an object passes validation without returning errors
 */
export function isValid<T>(schema: z.ZodSchema<T>, data: unknown): boolean {
  return schema.safeParse(data).success;
}

/**
 * Validate and transform data in one step
 * Useful for API request/response validation
 */
export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Create a validation result object compatible with FormField component
 */
export function createValidationResult(
  isValid: boolean,
  error?: string
): { isValid: boolean; error?: string } {
  return { isValid, error };
}

/**
 * Batch validate multiple fields
 */
export function validateFields<T extends Record<string, any>>(
  schema: z.ZodSchema<any>,
  fields: T
): Record<keyof T, { isValid: boolean; error?: string }> {
  const results = {} as Record<keyof T, { isValid: boolean; error?: string }>;

  Object.keys(fields).forEach((key) => {
    const result = validateField(schema, key, fields[key]);
    results[key as keyof T] = result;
  });

  return results;
}

/**
 * Merge multiple validation error objects
 */
export function mergeErrors(
  ...errorObjects: Array<Record<string, string> | undefined>
): Record<string, string> {
  return errorObjects.reduce<Record<string, string>>((acc, errors) => {
    if (errors) {
      return { ...acc, ...errors };
    }
    return acc;
  }, {});
}

/**
 * Check if there are any validation errors
 */
export function hasErrors(errors: Record<string, string> | undefined): boolean {
  return !!errors && Object.keys(errors).length > 0;
}

/**
 * Get first error message from errors object
 */
export function getFirstError(errors: Record<string, string> | undefined): string | undefined {
  if (!errors) return undefined;
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : undefined;
}

/**
 * Create a custom error message
 */
export function createError(field: string, message: string): Record<string, string> {
  return { [field]: message };
}

/**
 * Common validation patterns
 */
export const patterns = {
  // Email pattern (more strict)
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Phone number (US format)
  phone: /^(\+1|1)?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,

  // URL
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,

  // Password (at least 8 chars, 1 upper, 1 lower, 1 number)
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,

  // Currency amount (allows decimals)
  currency: /^\d+(\.\d{1,2})?$/,

  // Positive integer
  positiveInteger: /^[1-9]\d*$/,

  // Date (YYYY-MM-DD)
  date: /^\d{4}-\d{2}-\d{2}$/,

  // Time (HH:MM)
  time: /^([01]\d|2[0-3]):([0-5]\d)$/,
};

/**
 * Common error messages
 */
export const errorMessages = {
  required: (field: string) => `${field} is required`,
  invalid: (field: string) => `${field} is invalid`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) => `${field} must be less than ${max} characters`,
  min: (field: string, min: number) => `${field} must be at least ${min}`,
  max: (field: string, max: number) => `${field} must be at most ${max}`,
  email: "Please enter a valid email address",
  phone: "Please enter a valid phone number",
  url: "Please enter a valid URL",
  password: "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number",
  match: (field1: string, field2: string) => `${field1} and ${field2} must match`,
  unique: (field: string) => `${field} already exists`,
  future: (field: string) => `${field} must be in the future`,
  past: (field: string) => `${field} must be in the past`,
};
