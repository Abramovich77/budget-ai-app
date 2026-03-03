"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { validateAmount, validateRequired } from "@/lib/validation/formValidation";
import { BUDGET_CATEGORIES, BUDGET_PERIODS } from "@/lib/constants";
import { Loader2 } from "lucide-react";

interface SimpleBudget {
  id: string;
  category: string;
  amount: number;
  period: string;
  spent: number;
  progress: number;
}

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (budget: SimpleBudget) => void;
}

export function AddBudgetModal({ isOpen, onClose, onSuccess }: AddBudgetModalProps) {
  const [formData, setFormData] = useState({
    category: "",
    amount: 0,
    period: "monthly",
  });

  const [touched, setTouched] = useState({
    category: false,
    amount: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate fields
  const categoryValidation = validateRequired(formData.category, "Category");
  const amountValidation = validateAmount(formData.amount, "Budget amount");

  const isFormValid = categoryValidation.isValid && amountValidation.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      category: true,
      amount: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const budget = {
        id: Date.now().toString(),
        category: formData.category,
        amount: formData.amount,
        period: formData.period,
        spent: 0,
        progress: 0,
      };

      onSuccess?.(budget);

      // Reset form
      setFormData({
        category: "",
        amount: 0,
        period: "monthly",
      });
      setTouched({
        category: false,
        amount: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "amount" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Budget" maxWidth="lg">
      <form onSubmit={handleSubmit}>
        {/* Category */}
        <FormField
          label="Category"
          type="select"
          value={formData.category}
          onChange={(value) => handleFieldChange("category", value)}
          onBlur={() => handleBlur("category")}
          validation={categoryValidation}
          touched={touched.category}
          options={BUDGET_CATEGORIES.map((cat) => ({
            value: cat,
            label: cat,
          }))}
          required
          helpText="Select the spending category for this budget"
        />

        {/* Amount */}
        <FormField
          label="Budget Amount"
          type="number"
          value={formData.amount || ""}
          onChange={(value) => handleFieldChange("amount", value)}
          onBlur={() => handleBlur("amount")}
          validation={amountValidation}
          touched={touched.amount}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          helpText="Enter the maximum amount to spend in this category"
        />

        {/* Period */}
        <FormField
          label="Period"
          type="select"
          value={formData.period}
          onChange={(value) => handleFieldChange("period", value)}
          options={BUDGET_PERIODS}
          required
          helpText="How often should this budget reset?"
        />

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Budget"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
