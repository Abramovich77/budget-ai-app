import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
  className?: string;
}

export function FormError({ message, className = "" }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className={`flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mt-1 ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <FormError message={error} />
    </div>
  );
}
