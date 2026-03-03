"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { FormField } from "@/components/ui/FormField";
import { validateAmount, validateRequired, validateDate } from "@/lib/validation/formValidation";
import { TRANSACTION_CATEGORIES } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import type { TransactionFormData } from "@/types/forms";

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
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [touched, setTouched] = useState({
    description: false,
    amount: false,
    category: false,
    date: false,
  });

  const [transactionType, setTransactionType] = useState<"income" | "expense">("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate fields
  const descriptionValidation = validateRequired(formData.description, "Description");
  const amountValidation = validateAmount(formData.amount);
  const categoryValidation = validateRequired(formData.category, "Category");
  const dateValidation = validateDate(formData.date);

  const isFormValid =
    descriptionValidation.isValid &&
    amountValidation.isValid &&
    categoryValidation.isValid &&
    dateValidation.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      description: true,
      amount: true,
      category: true,
      date: true,
    });

    if (!isFormValid) {
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
        amount: transactionType === "expense" ? -Math.abs(parsedAmount) : Math.abs(parsedAmount),
        category: formData.category,
        date: formData.date,
        type: transactionType,
        aiCategorized: false,
      };

      onSuccess?.(transaction);

      // Reset form
      setFormData({
        description: "",
        amount: 0,
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setTouched({
        description: false,
        amount: false,
        category: false,
        date: false,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction" maxWidth="lg">
      <form onSubmit={handleSubmit}>
        {/* Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex-1">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={transactionType === "expense"}
                onChange={() => setTransactionType("expense")}
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
                checked={transactionType === "income"}
                onChange={() => setTransactionType("income")}
                className="sr-only peer"
              />
              <div className="px-4 py-3 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/20 transition">
                <span className="font-medium text-gray-900 dark:text-white">Income</span>
              </div>
            </label>
          </div>
        </div>

        {/* Description */}
        <FormField
          label="Description"
          type="text"
          value={formData.description}
          onChange={(value) => handleFieldChange("description", value)}
          onBlur={() => handleBlur("description")}
          validation={descriptionValidation}
          touched={touched.description}
          placeholder="e.g., Grocery shopping at Whole Foods"
          required
        />

        {/* Amount */}
        <FormField
          label="Amount"
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
        />

        {/* Category */}
        <FormField
          label="Category"
          type="select"
          value={formData.category}
          onChange={(value) => handleFieldChange("category", value)}
          onBlur={() => handleBlur("category")}
          validation={categoryValidation}
          touched={touched.category}
          options={TRANSACTION_CATEGORIES.map((cat) => ({
            value: cat,
            label: cat,
          }))}
          required
        />

        {/* Date */}
        <FormField
          label="Date"
          type="date"
          value={formData.date}
          onChange={(value) => handleFieldChange("date", value)}
          onBlur={() => handleBlur("date")}
          validation={dateValidation}
          touched={touched.date}
          max={new Date().toISOString().split("T")[0]}
          required
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
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
