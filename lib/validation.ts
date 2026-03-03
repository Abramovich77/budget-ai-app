// Form validation utilities

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Transaction validation
export function validateTransaction(data: {
  description?: string;
  amount?: number | string;
  category?: string;
  date?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.description || data.description.trim().length === 0) {
    errors.push({ field: "description", message: "Description is required" });
  } else if (data.description.length > 200) {
    errors.push({ field: "description", message: "Description must be less than 200 characters" });
  }

  if (!data.amount) {
    errors.push({ field: "amount", message: "Amount is required" });
  } else {
    const amount = typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
    if (isNaN(amount)) {
      errors.push({ field: "amount", message: "Amount must be a valid number" });
    } else if (amount === 0) {
      errors.push({ field: "amount", message: "Amount cannot be zero" });
    }
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: "category", message: "Category is required" });
  }

  if (!data.date || data.date.trim().length === 0) {
    errors.push({ field: "date", message: "Date is required" });
  } else {
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      errors.push({ field: "date", message: "Date must be valid" });
    } else if (date > new Date()) {
      errors.push({ field: "date", message: "Date cannot be in the future" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Budget validation
export function validateBudget(data: {
  category?: string;
  amount?: number | string;
  period?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.category || data.category.trim().length === 0) {
    errors.push({ field: "category", message: "Category is required" });
  }

  if (!data.amount) {
    errors.push({ field: "amount", message: "Budget amount is required" });
  } else {
    const amount = typeof data.amount === "string" ? parseFloat(data.amount) : data.amount;
    if (isNaN(amount)) {
      errors.push({ field: "amount", message: "Amount must be a valid number" });
    } else if (amount <= 0) {
      errors.push({ field: "amount", message: "Amount must be greater than zero" });
    }
  }

  if (!data.period || data.period.trim().length === 0) {
    errors.push({ field: "period", message: "Period is required" });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Goal validation
export function validateGoal(data: {
  name?: string;
  targetAmount?: number | string;
  currentAmount?: number | string;
  deadline?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push({ field: "name", message: "Goal name is required" });
  } else if (data.name.length > 100) {
    errors.push({ field: "name", message: "Goal name must be less than 100 characters" });
  }

  if (!data.targetAmount) {
    errors.push({ field: "targetAmount", message: "Target amount is required" });
  } else {
    const amount = typeof data.targetAmount === "string" ? parseFloat(data.targetAmount) : data.targetAmount;
    if (isNaN(amount)) {
      errors.push({ field: "targetAmount", message: "Target amount must be a valid number" });
    } else if (amount <= 0) {
      errors.push({ field: "targetAmount", message: "Target amount must be greater than zero" });
    }
  }

  if (data.currentAmount !== undefined && data.currentAmount !== "") {
    const amount = typeof data.currentAmount === "string" ? parseFloat(data.currentAmount) : data.currentAmount;
    if (isNaN(amount)) {
      errors.push({ field: "currentAmount", message: "Current amount must be a valid number" });
    } else if (amount < 0) {
      errors.push({ field: "currentAmount", message: "Current amount cannot be negative" });
    }
  }

  if (data.deadline && data.deadline.trim().length > 0) {
    const deadline = new Date(data.deadline);
    if (isNaN(deadline.getTime())) {
      errors.push({ field: "deadline", message: "Deadline must be valid" });
    } else if (deadline < new Date()) {
      errors.push({ field: "deadline", message: "Deadline cannot be in the past" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!password || password.length === 0) {
    errors.push({ field: "password", message: "Password is required" });
  } else {
    if (password.length < 8) {
      errors.push({ field: "password", message: "Password must be at least 8 characters" });
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({ field: "password", message: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(password)) {
      errors.push({ field: "password", message: "Password must contain at least one lowercase letter" });
    }
    if (!/[0-9]/.test(password)) {
      errors.push({ field: "password", message: "Password must contain at least one number" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
