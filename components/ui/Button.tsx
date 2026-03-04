"use client";

import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Button Variants
 * - primary: Main action button
 * - secondary: Secondary actions
 * - outline: Outlined style
 * - ghost: Minimal style
 * - danger: Destructive actions
 * - success: Positive actions
 */
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";

/**
 * Button Sizes
 */
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  rounded?: boolean;
}

/**
 * Comprehensive Button Component
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger, success)
 * - Multiple sizes (sm, md, lg, xl)
 * - Loading state with spinner
 * - Icon support (left or right)
 * - Full width option
 * - Rounded corners option
 * - Smooth animations and transitions
 * - Accessible (keyboard navigation, focus styles)
 * - Disabled state
 *
 * @example
 * <Button variant="primary" size="md" loading={isLoading}>
 *   Save Changes
 * </Button>
 *
 * @example
 * <Button variant="danger" icon={<TrashIcon />} iconPosition="left">
 *   Delete
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      rounded = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles - always applied
    const baseStyles = [
      "inline-flex items-center justify-center",
      "font-medium",
      "transition-all duration-200 ease-in-out",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "active:scale-95", // Press animation
      "select-none",
    ].join(" ");

    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: [
        "bg-blue-600 text-white",
        "hover:bg-blue-700",
        "focus:ring-blue-500",
        "dark:bg-blue-500 dark:hover:bg-blue-600",
        "shadow-sm hover:shadow-md",
      ].join(" "),
      secondary: [
        "bg-gray-600 text-white",
        "hover:bg-gray-700",
        "focus:ring-gray-500",
        "dark:bg-gray-500 dark:hover:bg-gray-600",
        "shadow-sm hover:shadow-md",
      ].join(" "),
      outline: [
        "border-2 border-gray-300 text-gray-700",
        "hover:border-gray-400 hover:bg-gray-50",
        "focus:ring-gray-500",
        "dark:border-gray-600 dark:text-gray-300",
        "dark:hover:border-gray-500 dark:hover:bg-gray-800",
      ].join(" "),
      ghost: [
        "text-gray-700",
        "hover:bg-gray-100",
        "focus:ring-gray-500",
        "dark:text-gray-300",
        "dark:hover:bg-gray-800",
      ].join(" "),
      danger: [
        "bg-red-600 text-white",
        "hover:bg-red-700",
        "focus:ring-red-500",
        "dark:bg-red-500 dark:hover:bg-red-600",
        "shadow-sm hover:shadow-md",
      ].join(" "),
      success: [
        "bg-green-600 text-white",
        "hover:bg-green-700",
        "focus:ring-green-500",
        "dark:bg-green-500 dark:hover:bg-green-600",
        "shadow-sm hover:shadow-md",
      ].join(" "),
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
      xl: "px-8 py-4 text-xl",
    };

    // Rounded styles
    const roundedStyles = rounded ? "rounded-full" : "rounded-lg";

    // Full width
    const widthStyles = fullWidth ? "w-full" : "";

    // Icon spacing
    const iconSpacing = {
      sm: "gap-1.5",
      md: "gap-2",
      lg: "gap-2.5",
      xl: "gap-3",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles,
          widthStyles,
          iconSpacing[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === "left" && (
          <span className="inline-flex">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === "right" && (
          <span className="inline-flex">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * Button Group Component
 * Groups multiple buttons together with proper spacing
 */
interface ButtonGroupProps {
  children: React.ReactNode;
  spacing?: "tight" | "normal" | "loose";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  spacing = "normal",
  orientation = "horizontal",
  className,
}) => {
  const spacingStyles = {
    tight: "gap-1",
    normal: "gap-2",
    loose: "gap-4",
  };

  const orientationStyles = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  return (
    <div
      className={cn(
        "flex",
        orientationStyles[orientation],
        spacingStyles[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};
