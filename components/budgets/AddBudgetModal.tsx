"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormError";
import { validateBudget } from "@/lib/validation";
import { BUDGET_CATEGORIES, BUDGET_PERIODS } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import type { Budget, BudgetFormData } from "@/types";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (budget: Budget) => void;
}

export function AddBudgetModal({ isOpen, onClose, onSuccess }: AddBudgetModalProps) {
  const [formData, setFormData] = useState<BudgetFormData>({
    category: "",
    amount: "",
    period: "monthly",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateBudget({
      category: formData.category,
      amount: formData.amount,
      period: formData.period,
    });

    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const budget = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        spent: 0,
        progress: 0,
      };

      onSuccess?.(budget);

      // Reset form
      setFormData({
        category: "",
        amount: "",
        period: "monthly",
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to create budget. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Budget" maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Set spending limits for different categories to help you stay on track with your financial goals.
        </p>

        {/* Category */}
        <FormField label="Category" error={errors.category} required>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.category
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select a category</option>
            {BUDGET_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </FormField>

        {/* Budget Amount */}
        <FormField label="Budget Amount" error={errors.amount} required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.amount
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Maximum amount you want to spend in this category
          </p>
        </FormField>

        {/* Period */}
        <FormField label="Period" error={errors.period} required>
          <div className="grid grid-cols-3 gap-3">
            {BUDGET_PERIODS.map((period) => (
              <label key={period.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="period"
                  value={period.value}
                  checked={formData.period === period.value}
                  onChange={(e) => handleChange("period", e.target.value)}
                  className="sr-only peer"
                />
                <div className="px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {period.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </FormField>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
            {errors.submit}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Budget"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
