import { z } from "zod";

/**
 * Zod validation schemas for form data
 * Provides type-safe validation with detailed error messages
 */

// Transaction validation schema
export const transactionSchema = z.object({
  id: z.string().optional(),
  accountId: z.string().optional(),
  date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: "Invalid date format" }
  ),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must be less than 200 characters"),
  merchant: z.string().optional(),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount is too large"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  aiCategorized: z.boolean().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
});

// Budget validation schema
export const budgetSchema = z.object({
  id: z.string().optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount is too large"),
  period: z.enum(["monthly", "weekly", "yearly"], {
    errorMap: () => ({ message: "Invalid period. Must be monthly, weekly, or yearly" }),
  }),
});

// Goal validation schema
export const goalSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "Goal name is required")
    .max(100, "Goal name must be less than 100 characters"),
  goalType: z.enum(["savings", "debt"], {
    errorMap: () => ({ message: "Invalid goal type. Must be savings or debt" }),
  }),
  targetAmount: z
    .number({ invalid_type_error: "Target amount must be a number" })
    .min(0.01, "Target amount must be greater than 0")
    .max(10000000, "Target amount is too large"),
  currentAmount: z
    .number({ invalid_type_error: "Current amount must be a number" })
    .min(0, "Current amount cannot be negative")
    .max(10000000, "Current amount is too large"),
  targetDate: z.string().refine(
    (date) => {
      const parsed = Date.parse(date);
      if (isNaN(parsed)) return false;
      return new Date(parsed) > new Date();
    },
    { message: "Target date must be in the future" }
  ),
  priority: z
    .number({ invalid_type_error: "Priority must be a number" })
    .int("Priority must be an integer")
    .min(1, "Priority must be at least 1")
    .max(10, "Priority must be at most 10"),
  status: z.enum(["active", "completed", "paused"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
}).refine(
  (data) => data.currentAmount <= data.targetAmount,
  {
    message: "Current amount cannot exceed target amount",
    path: ["currentAmount"],
  }
);

// User settings validation schema
export const userSettingsSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(50, "Display name must be less than 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters"),
  currency: z
    .string()
    .length(3, "Currency code must be 3 characters")
    .regex(/^[A-Z]{3}$/, "Currency code must be uppercase letters"),
  timezone: z.string().min(1, "Timezone is required"),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    budgetAlerts: z.boolean(),
    goalReminders: z.boolean(),
  }),
  theme: z.enum(["light", "dark", "system"]),
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Register validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// Type exports (inferred from schemas)
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;
export type UserSettingsData = z.infer<typeof userSettingsSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Validation helper function
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true as const, data: result.data };
  }

  // Format errors for easier consumption
  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join(".");
    errors[path] = error.message;
  });

  return { success: false as const, errors };
}

// Field-level validation helper
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): { isValid: boolean; error?: string } {
  try {
    // Extract the field schema
    const fieldSchema = (schema as any).shape[fieldName];
    if (!fieldSchema) {
      return { isValid: true };
    }

    fieldSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: "Invalid value" };
  }
}
