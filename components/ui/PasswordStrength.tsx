import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { PasswordStrength } from "@/lib/validation/formValidation";

interface PasswordStrengthIndicatorProps {
  strength: PasswordStrength;
  suggestions?: string[];
  isValid: boolean;
}

export function PasswordStrengthIndicator({
  strength,
  suggestions,
  isValid,
}: PasswordStrengthIndicatorProps) {
  const strengthConfig = {
    weak: {
      color: "bg-red-500",
      textColor: "text-red-600 dark:text-red-400",
      label: "Weak",
      width: "w-1/4",
    },
    fair: {
      color: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400",
      label: "Fair",
      width: "w-1/2",
    },
    good: {
      color: "bg-yellow-500",
      textColor: "text-yellow-600 dark:text-yellow-400",
      label: "Good",
      width: "w-3/4",
    },
    strong: {
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      label: "Strong",
      width: "w-full",
    },
  };

  const config = strengthConfig[strength];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.color} transition-all duration-300 ${config.width}`}
          />
        </div>
        <span className={`text-xs font-medium ${config.textColor}`}>
          {config.label}
        </span>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            To strengthen your password:
          </p>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1"
              >
                <AlertCircle className="h-3 w-3" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success message for strong passwords */}
      {isValid && strength === "strong" && (
        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
          <CheckCircle className="h-3 w-3" />
          <span>Great password!</span>
        </div>
      )}
    </div>
  );
}
