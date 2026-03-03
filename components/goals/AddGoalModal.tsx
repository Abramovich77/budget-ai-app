"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormError";
import { validateGoal } from "@/lib/validation";
import { GOAL_PRIORITIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import type { Goal, GoalFormData } from "@/types";

interface SimpleGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: string;
  progress: number;
  status: "active" | "completed";
}

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (goal: SimpleGoal) => void;
}

export function AddGoalModal({ isOpen, onClose, onSuccess }: AddGoalModalProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    priority: "medium",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateGoal({
      name: formData.name,
      targetAmount: formData.targetAmount,
      currentAmount: formData.currentAmount,
      deadline: formData.deadline,
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

      const targetAmount = typeof formData.targetAmount === 'string'
        ? parseFloat(formData.targetAmount)
        : formData.targetAmount;
      const currentAmount = typeof formData.currentAmount === 'string'
        ? parseFloat(formData.currentAmount || "0")
        : (formData.currentAmount || 0);
      const progress = (currentAmount / targetAmount) * 100;

      const goal: SimpleGoal = {
        id: Date.now().toString(),
        name: formData.name,
        targetAmount,
        currentAmount,
        deadline: formData.deadline,
        priority: formData.priority,
        progress: Math.min(progress, 100),
        status: progress >= 100 ? "completed" : "active",
      };

      onSuccess?.(goal);

      // Reset form
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "0",
        deadline: "",
        priority: "medium",
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to create goal. Please try again." });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create Savings Goal" maxWidth="lg">
      <form onSubmit={handleSubmit}>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Set a savings goal and track your progress towards achieving it.
        </p>

        {/* Goal Name */}
        <FormField label="Goal Name" error={errors.name} required>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g., Emergency Fund, Vacation, New Car"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.name
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
        </FormField>

        {/* Target Amount */}
        <FormField label="Target Amount" error={errors.targetAmount} required>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => handleChange("targetAmount", e.target.value)}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.targetAmount
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Total amount you want to save
          </p>
        </FormField>

        {/* Current Amount */}
        <FormField label="Current Amount" error={errors.currentAmount}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => handleChange("currentAmount", e.target.value)}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                errors.currentAmount
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Amount you've already saved (optional)
          </p>
        </FormField>

        {/* Deadline */}
        <FormField label="Target Date" error={errors.deadline}>
          <input
            type="date"
            value={formData.deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.deadline
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            When do you want to achieve this goal? (optional)
          </p>
        </FormField>

        {/* Priority */}
        <FormField label="Priority" error={errors.priority}>
          <div className="grid grid-cols-3 gap-3">
            {GOAL_PRIORITIES.map((priority) => (
              <label key={priority.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  value={priority.value}
                  checked={formData.priority === priority.value}
                  onChange={(e) => handleChange("priority", e.target.value)}
                  className="sr-only peer"
                />
                <div
                  className={`px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg peer-checked:border-${priority.color}-500 peer-checked:bg-${priority.color}-50 dark:peer-checked:bg-${priority.color}-900/20 transition`}
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {priority.label}
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
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
