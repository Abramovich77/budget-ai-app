/**
 * Centralized Zod validation schemas for API endpoints
 * Includes validation rules, sanitization, and custom error messages
 */

import { z } from "zod";

// ============================================================================
// Common Validators
// ============================================================================

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be less than 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

export const descriptionSchema = z
  .string()
  .trim()
  .max(500, "Description must be less than 500 characters")
  .optional();

export const amountSchema = z
  .number()
  .finite("Amount must be a valid number")
  .refine((val) => Math.abs(val) <= 1000000000, {
    message: "Amount must be between -1,000,000,000 and 1,000,000,000",
  });

export const positiveAmountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .finite("Amount must be a valid number")
  .max(1000000000, "Amount must be less than 1,000,000,000");

export const dateSchema = z
  .string()
  .datetime({ message: "Invalid date format. Use ISO 8601 format" })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use YYYY-MM-DD"));

export const uuidSchema = z
  .string()
  .uuid("Invalid ID format");

// ============================================================================
// Pagination & Filtering
// ============================================================================

export const paginationSchema = z.object({
  limit: z.preprocess(
    (val) => (val ? parseInt(String(val), 10) : 50),
    z.number().int().min(1).max(100)
  ),
  offset: z.preprocess(
    (val) => (val ? parseInt(String(val), 10) : 0),
    z.number().int().min(0)
  ),
});

export const dateRangeSchema = z.object({
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
});

// ============================================================================
// Auth Schemas
// ============================================================================

export const registerSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

// ============================================================================
// Transaction Schemas
// ============================================================================

export const createTransactionSchema = z.object({
  accountId: uuidSchema,
  categoryId: uuidSchema.optional(),
  amount: amountSchema,
  date: dateSchema,
  description: descriptionSchema,
  merchantName: z
    .string()
    .trim()
    .max(200, "Merchant name must be less than 200 characters")
    .optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = paginationSchema.merge(
  z.object({
    categoryId: uuidSchema.optional(),
    accountId: uuidSchema.optional(),
    minAmount: z.preprocess(
      (val) => (val ? parseFloat(String(val)) : undefined),
      z.number().optional()
    ),
    maxAmount: z.preprocess(
      (val) => (val ? parseFloat(String(val)) : undefined),
      z.number().optional()
    ),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    search: z.string().trim().max(200).optional(),
  })
);

// ============================================================================
// Budget Schemas
// ============================================================================

export const budgetItemSchema = z.object({
  categoryId: uuidSchema,
  allocatedAmount: positiveAmountSchema,
});

export const createBudgetSchema = z.object({
  householdId: uuidSchema,
  name: z
    .string()
    .trim()
    .min(1, "Budget name is required")
    .max(100, "Budget name must be less than 100 characters"),
  methodology: z.enum(["zero-based", "50-30-20", "envelope"], {
    errorMap: () => ({ message: "Invalid budget methodology" }),
  }),
  periodType: z
    .enum(["weekly", "monthly", "annual"], {
      errorMap: () => ({ message: "Invalid period type" }),
    })
    .default("monthly"),
  startDate: dateSchema,
  items: z
    .array(budgetItemSchema)
    .min(1, "At least one budget item is required")
    .max(50, "Maximum 50 budget items allowed"),
});

export const updateBudgetSchema = createBudgetSchema.partial().omit({ householdId: true });

// ============================================================================
// Goal Schemas
// ============================================================================

const goalBaseSchema = z.object({
  householdId: uuidSchema,
  name: z
    .string()
    .trim()
    .min(1, "Goal name is required")
    .max(100, "Goal name must be less than 100 characters"),
  goalType: z.enum(["savings", "debt"], {
    errorMap: () => ({ message: "Goal type must be 'savings' or 'debt'" }),
  }),
  targetAmount: positiveAmountSchema,
  currentAmount: z
    .number()
    .min(0, "Current amount cannot be negative")
    .finite("Current amount must be a valid number"),
  targetDate: dateSchema,
  priority: z.number().int().min(1).max(10).default(5),
});

export const createGoalSchema = goalBaseSchema
  .refine((data) => data.currentAmount <= data.targetAmount, {
    message: "Current amount cannot exceed target amount",
    path: ["currentAmount"],
  });

export const updateGoalSchema = goalBaseSchema.partial().omit({ householdId: true });

// ============================================================================
// AI Categorization Schema
// ============================================================================

export const categorizationSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Description is required for categorization")
    .max(500, "Description must be less than 500 characters"),
  amount: amountSchema.optional(),
  merchant: z.string().trim().max(200).optional(),
});

// ============================================================================
// Account Schemas
// ============================================================================

export const createAccountSchema = z.object({
  accountName: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(100, "Account name must be less than 100 characters"),
  bankName: z
    .string()
    .trim()
    .max(100, "Bank name must be less than 100 characters")
    .optional(),
  accountType: z.enum(["checking", "savings", "credit", "investment"], {
    errorMap: () => ({ message: "Invalid account type" }),
  }),
  balance: amountSchema.default(0),
  currency: z
    .string()
    .length(3, "Currency code must be 3 characters (e.g., USD)")
    .toUpperCase()
    .default("USD"),
});

export const updateAccountSchema = createAccountSchema.partial();

// ============================================================================
// Type Exports
// ============================================================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
export type CategorizationInput = z.infer<typeof categorizationSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
