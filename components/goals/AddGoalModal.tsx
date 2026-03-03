"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import {
  validateAmount,
  validateRequired,
  validateFutureDate,
  validateGoalAmounts,
} from "@/lib/validation/formValidation";
import { Loader2 } from "lucide-react";

interface SimpleGoal {
  id: string;
  name: string;
  goalType: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: number;
  status: string;
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (goal: SimpleGoal) => void;
}

export function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    goalType: "savings" as "savings" | "debt",
    targetAmount: 0,
    currentAmount: 0,
    targetDate: "",
    priority: 1,
  });

  const [touched, setTouched] = useState({
    name: false,
    targetAmount: false,
    currentAmount: false,
    targetDate: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate fields
  const nameValidation = validateRequired(formData.name, "Goal name");
  const targetAmountValidation = validateAmount(formData.targetAmount, "Target amount");
  const currentAmountValidation = validateAmount(formData.currentAmount, "Current amount");
  const targetDateValidation = validateFutureDate(formData.targetDate);
  const amountsValidation = validateGoalAmounts(formData.currentAmount, formData.targetAmount);

  const isFormValid =
    nameValidation.isValid &&
    targetAmountValidation.isValid &&
    currentAmountValidation.isValid &&
    targetDateValidation.isValid &&
    amountsValidation.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      targetAmount: true,
      currentAmount: true,
      targetDate: true,
    });

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const goal = {
        id: Date.now().toString(),
        name: formData.name,
        goalType: formData.goalType,
        targetAmount: formData.targetAmount,
        currentAmount: formData.currentAmount,
        targetDate: formData.targetDate,
        priority: formData.priority,
        status: "active",
      };

      onSuccess?.(goal);

      // Reset form
      setFormData({
        name: "",
        goalType: "savings",
        targetAmount: 0,
        currentAmount: 0,
        targetDate: "",
        priority: 1,
      });
      setTouched({
        name: false,
        targetAmount: false,
        currentAmount: false,
        targetDate: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "targetAmount" || field === "currentAmount" || field === "priority"
          ? typeof value === "string"
            ? value === ""
              ? 0
              : parseFloat(value)
            : value
          : value,
    }));
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Goal" maxWidth="lg">
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <FormField
          label="Goal Name"
          type="text"
          value={formData.name}
          onChange={(value) => handleFieldChange("name", value)}
          onBlur={() => handleBlur("name")}
          validation={nameValidation}
          touched={touched.name}
          placeholder="e.g., Emergency Fund"
          required
          helpText="Give your goal a descriptive name"
        />

        {/* Goal Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex-1">
              <input
                type="radio"
                name="goalType"
                value="savings"
                checked={formData.goalType === "savings"}
                onChange={() => handleFieldChange("goalType", "savings")}
                className="sr-only peer"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 transition">
                <span className="font-medium text-gray-900 dark:text-white">Savings</span>
              </div>
            </label>
            <label className="flex-1">
              <input
                type="radio"
                name="goalType"
                value="debt"
                checked={formData.goalType === "debt"}
                onChange={() => handleFieldChange("goalType", "debt")}
                className="sr-only peer"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 transition">
                <span className="font-medium text-gray-900 dark:text-white">Debt Payoff</span>
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Choose whether you're saving money or paying off debt
          </p>
        </div>

        {/* Target Amount */}
        <FormField
          label="Target Amount"
          type="number"
          value={formData.targetAmount || ""}
          onChange={(value) => handleFieldChange("targetAmount", value)}
          onBlur={() => handleBlur("targetAmount")}
          validation={targetAmountValidation}
          touched={touched.targetAmount}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          helpText="How much do you want to save or pay off?"
        />

        {/* Current Amount */}
        <FormField
          label="Current Amount"
          type="number"
          value={formData.currentAmount || ""}
          onChange={(value) => handleFieldChange("currentAmount", value)}
          onBlur={() => handleBlur("currentAmount")}
          validation={currentAmountValidation}
          touched={touched.currentAmount}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          helpText="How much progress have you made so far?"
        />

        {/* Amounts validation error */}
        {touched.currentAmount &&
          touched.targetAmount &&
          !amountsValidation.isValid && (
            <div className="mb-4 -mt-3 text-red-600 dark:text-red-400 text-sm">
              {amountsValidation.error}
            </div>
          )}

        {/* Target Date */}
        <FormField
          label="Target Date"
          type="date"
          value={formData.targetDate}
          onChange={(value) => handleFieldChange("targetDate", value)}
          onBlur={() => handleBlur("targetDate")}
          validation={targetDateValidation}
          touched={touched.targetDate}
          min={new Date().toISOString().split("T")[0]}
          required
          helpText="When do you want to achieve this goal?"
        />

        {/* Priority */}
        <FormField
          label="Priority"
          type="select"
          value={formData.priority.toString()}
          onChange={(value) => handleFieldChange("priority", value)}
          options={[
            { value: "1", label: "High Priority" },
            { value: "2", label: "Medium Priority" },
            { value: "3", label: "Low Priority" },
          ]}
          required
          helpText="How important is this goal to you?"
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
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
