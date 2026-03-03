"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormError";
import { validateTransaction } from "@/lib/validation";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import type { TransactionFormData } from "@/types";

interface SimpleTransaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
  aiCategorized: boolean;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: SimpleTransaction) => void;
}

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateTransaction({
      description: formData.description,
      amount: formData.amount,
      category: formData.category,
      date: formData.date,
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

      const parsedAmount = typeof formData.amount === 'string' ? parseFloat(formData.amount) : formData.amount;
      const transaction = {
        id: Date.now().toString(),
        description: formData.description,
        amount: formData.type === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
        category: formData.category,
        date: formData.date,
        type: formData.type,
        aiCategorized: false,
      };

      onSuccess?.(transaction);

      // Reset form
      setFormData({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "expense",
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to add transaction. Please try again." });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction" maxWidth="lg">
      <form onSubmit={handleSubmit}>
        {/* Type Selection */}
        <div className="mb-6">
          <div className="flex gap-4">
            <label className="flex-1">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === "expense"}
                onChange={(e) => handleChange("type", e.target.value)}
                className="sr-only peer"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/20 transition">
                <span className="font-medium text-gray-900 dark:text-white">Expense</span>
              </div>
            </label>
            <label className="flex-1">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === "income"}
                onChange={(e) => handleChange("type", e.target.value)}
                className="sr-only peer"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 transition">
                <span className="font-medium text-gray-900 dark:text-white">Income</span>
              </div>
            </label>
          </div>
        </div>

        {/* Description */}
        <FormField label="Description" error={errors.description} required>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="e.g., Grocery shopping at Whole Foods"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.description
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
        </FormField>

        {/* Amount */}
        <FormField label="Amount" error={errors.amount} required>
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
        </FormField>

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
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </FormField>

        {/* Date */}
        <FormField label="Date" error={errors.date} required>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              errors.date
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
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
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
