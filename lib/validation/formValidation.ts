/**
 * Form validation utilities for real-time input validation
 * Provides consistent validation rules and error messages across all forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an amount field (positive number, max 2 decimals)
 */
export function validateAmount(value: string | number, fieldName = "Amount"): ValidationResult {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (!value || value === "") {
    return { isValid: false, error: `${fieldName} is required - please enter a value` };
  }

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number (e.g., 10.50)` };
  }

  if (numValue <= 0) {
    return { isValid: false, error: `${fieldName} must be greater than 0` };
  }

  if (numValue > 999999999) {
    return { isValid: false, error: `${fieldName} is too large (max: 999,999,999)` };
  }

  // Check for max 2 decimal places
  if (typeof value === "string" && value.includes(".")) {
    const decimals = value.split(".")[1];
    if (decimals && decimals.length > 2) {
      return { isValid: false, error: `${fieldName} can have at most 2 decimal places (e.g., 10.50)` };
    }
  }

  return { isValid: true };
}

/**
 * Validates a required text field
 */
export function validateRequired(value: string, fieldName = "This field"): ValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required - please enter a value` };
  }

  if (value.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
  }

  if (value.length > 200) {
    return { isValid: false, error: `${fieldName} is too long (max 200 characters, currently ${value.length})` };
  }

  return { isValid: true };
}

/**
 * Validates a date field
 */
export function validateDate(value: string, fieldName = "Date"): ValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: `${fieldName} is required - please select a date` };
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return { isValid: false, error: `${fieldName} is not a valid date - please use the date picker` };
  }

  // Check if date is not too far in the past (before 1900)
  if (date.getFullYear() < 1900) {
    return { isValid: false, error: `${fieldName} must be after 1900` };
  }

  // Check if date is not too far in the future (after 2100)
  if (date.getFullYear() > 2100) {
    return { isValid: false, error: `${fieldName} must be before 2100` };
  }

  return { isValid: true };
}

/**
 * Validates a future date field (for goals)
 */
export function validateFutureDate(value: string, fieldName = "Target Date"): ValidationResult {
  const dateResult = validateDate(value, fieldName);
  if (!dateResult.isValid) {
    return dateResult;
  }

  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to compare dates only

  if (date < today) {
    return { isValid: false, error: `${fieldName} must be in the future` };
  }

  return { isValid: true };
}

/**
 * Validates a category selection
 */
export function validateCategory(value: string): ValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "Category is required" };
  }

  return { isValid: true };
}

/**
 * Validates an email address
 */
export function validateEmail(value: string): ValidationResult {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { isValid: false, error: "Email is not valid" };
  }

  return { isValid: true };
}

/**
 * Validates that current amount is less than or equal to target amount
 */
export function validateGoalAmounts(
  currentAmount: number,
  targetAmount: number
): ValidationResult {
  if (currentAmount > targetAmount) {
    return {
      isValid: false,
      error: "Current amount cannot exceed target amount",
    };
  }

  return { isValid: true };
}

/**
 * Validates a transaction form
 */
export interface TransactionFormValidation {
  description: ValidationResult;
  amount: ValidationResult;
  date: ValidationResult;
  category: ValidationResult;
  isValid: boolean;
}

export function validateTransactionForm(data: {
  description: string;
  amount: string | number;
  date: string;
  category: string;
}): TransactionFormValidation {
  const description = validateRequired(data.description, "Description");
  const amount = validateAmount(data.amount);
  const date = validateDate(data.date);
  const category = validateCategory(data.category);

  return {
    description,
    amount,
    date,
    category,
    isValid: description.isValid && amount.isValid && date.isValid && category.isValid,
  };
}

/**
 * Validates a budget form
 */
export interface BudgetFormValidation {
  category: ValidationResult;
  amount: ValidationResult;
  isValid: boolean;
}

export function validateBudgetForm(data: {
  category: string;
  amount: string | number;
}): BudgetFormValidation {
  const category = validateRequired(data.category, "Category");
  const amount = validateAmount(data.amount, "Budget amount");

  return {
    category,
    amount,
    isValid: category.isValid && amount.isValid,
  };
}

/**
 * Validates a goal form
 */
export interface GoalFormValidation {
  name: ValidationResult;
  targetAmount: ValidationResult;
  currentAmount: ValidationResult;
  targetDate: ValidationResult;
  amounts: ValidationResult;
  isValid: boolean;
}

export function validateGoalForm(data: {
  name: string;
  targetAmount: string | number;
  currentAmount: string | number;
  targetDate: string;
}): GoalFormValidation {
  const name = validateRequired(data.name, "Goal name");
  const targetAmount = validateAmount(data.targetAmount, "Target amount");
  const currentAmount = validateAmount(data.currentAmount, "Current amount");
  const targetDate = validateFutureDate(data.targetDate);

  const targetNum = typeof data.targetAmount === "string"
    ? parseFloat(data.targetAmount)
    : data.targetAmount;
  const currentNum = typeof data.currentAmount === "string"
    ? parseFloat(data.currentAmount)
    : data.currentAmount;

  const amounts = validateGoalAmounts(currentNum, targetNum);

  return {
    name,
    targetAmount,
    currentAmount,
    targetDate,
    amounts,
    isValid:
      name.isValid &&
      targetAmount.isValid &&
      currentAmount.isValid &&
      targetDate.isValid &&
      amounts.isValid,
  };
}

/**
 * Password strength levels
 */
export type PasswordStrength = "weak" | "fair" | "good" | "strong";

export interface PasswordValidationResult extends ValidationResult {
  strength?: PasswordStrength;
  suggestions?: string[];
}

/**
 * Validates password strength and returns detailed feedback
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password || password.trim() === "") {
    return {
      isValid: false,
      error: "Password is required",
      strength: "weak",
    };
  }

  const suggestions: string[] = [];
  let strength: PasswordStrength = "weak";
  let score = 0;

  // Length check
  if (password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
      strength: "weak",
      suggestions: ["Use at least 6 characters"],
    };
  }

  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add lowercase letters");
  }

  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add uppercase letters");
  }

  // Contains numbers
  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add numbers");
  }

  // Contains special characters
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add special characters (!@#$%...)");
  }

  // Determine strength
  if (score <= 2) {
    strength = "weak";
  } else if (score === 3) {
    strength = "fair";
  } else if (score === 4) {
    strength = "good";
  } else {
    strength = "strong";
  }

  // Weak passwords are not valid
  if (strength === "weak") {
    return {
      isValid: false,
      error: "Password is too weak - add more variety",
      strength,
      suggestions,
    };
  }

  return {
    isValid: true,
    strength,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

/**
 * Validates password confirmation
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): ValidationResult {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return {
      isValid: false,
      error: "Please confirm your password",
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: "Passwords do not match",
    };
  }

  return { isValid: true };
}
