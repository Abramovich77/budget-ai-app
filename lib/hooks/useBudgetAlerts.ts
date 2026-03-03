import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";

export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color?: string;
}

export interface BudgetAlertThresholds {
  warning: number; // e.g., 80% = show warning
  critical: number; // e.g., 95% = show critical alert
  overspent: boolean; // Alert when overspent
}

const DEFAULT_THRESHOLDS: BudgetAlertThresholds = {
  warning: 80,
  critical: 95,
  overspent: true,
};

/**
 * Custom hook that monitors budget categories and triggers toast notifications
 * when spending approaches or exceeds allocated amounts.
 *
 * @param categories - Array of budget categories to monitor
 * @param thresholds - Custom alert thresholds (optional)
 */
export function useBudgetAlerts(
  categories: BudgetCategory[],
  thresholds: Partial<BudgetAlertThresholds> = {}
) {
  const { warning, error, info } = useToast();
  const alertedCategories = useRef<Set<string>>(new Set());
  const mergedThresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };

  useEffect(() => {
    if (!categories || categories.length === 0) return;

    categories.forEach((category) => {
      const percentage = (category.spent / category.allocated) * 100;
      const alertKey = `${category.id}-${Math.floor(percentage / 10)}`; // Group by 10% buckets

      // Skip if we've already alerted for this threshold
      if (alertedCategories.current.has(alertKey)) return;

      // Check for overspending
      if (mergedThresholds.overspent && percentage > 100) {
        const overspentAmount = category.spent - category.allocated;
        error(
          `${category.name} Over Budget!`,
          `You've exceeded your budget by $${overspentAmount.toFixed(2)}`
        );
        alertedCategories.current.add(alertKey);
      }
      // Check for critical threshold (near limit)
      else if (percentage >= mergedThresholds.critical) {
        const remaining = category.allocated - category.spent;
        warning(
          `${category.name} Almost Exhausted`,
          `Only $${remaining.toFixed(2)} remaining (${(100 - percentage).toFixed(1)}% left)`
        );
        alertedCategories.current.add(alertKey);
      }
      // Check for warning threshold
      else if (percentage >= mergedThresholds.warning) {
        const remaining = category.allocated - category.spent;
        info(
          `${category.name} Running Low`,
          `$${remaining.toFixed(2)} remaining - you've used ${percentage.toFixed(0)}% of your budget`
        );
        alertedCategories.current.add(alertKey);
      }
    });

    // Cleanup old alerts when categories update (e.g., month changes)
    const currentIds = new Set(categories.map(c => c.id));
    const outdatedAlerts = Array.from(alertedCategories.current).filter(
      key => !currentIds.has(key.split('-')[0])
    );
    outdatedAlerts.forEach(key => alertedCategories.current.delete(key));

  }, [categories, mergedThresholds, warning, error, info]);

  // Return a function to manually reset alerts (useful when user acknowledges them)
  const resetAlerts = () => {
    alertedCategories.current.clear();
  };

  return { resetAlerts };
}

/**
 * Hook to check overall budget health and provide summary alerts
 */
export function useOverallBudgetAlert(
  totalAllocated: number,
  totalSpent: number,
  enabled: boolean = true
) {
  const { warning, success } = useToast();
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (!enabled || hasAlerted.current) return;

    const percentage = (totalSpent / totalAllocated) * 100;

    if (percentage >= 100) {
      warning(
        "Budget Fully Spent",
        "You've used 100% of your allocated budget for this period"
      );
      hasAlerted.current = true;
    } else if (percentage >= 90) {
      warning(
        "Budget Nearly Exhausted",
        `${percentage.toFixed(0)}% of your total budget has been spent`
      );
      hasAlerted.current = true;
    }
  }, [totalAllocated, totalSpent, enabled, warning, success]);

  const resetAlert = () => {
    hasAlerted.current = false;
  };

  return { resetAlert };
}
