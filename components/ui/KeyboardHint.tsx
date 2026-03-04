/**
 * KeyboardHint Component
 *
 * Displays keyboard shortcut hints inline with buttons and interactive elements.
 * Provides visual cues for available keyboard shortcuts to improve discoverability.
 */

import { ReactNode } from "react";

interface KeyboardHintProps {
  /** The keyboard shortcut key(s) */
  shortcut: string;
  /** Optional: Show only on hover */
  showOnHover?: boolean;
  /** Optional: Size variant */
  size?: "xs" | "sm" | "md";
  /** Optional: Custom styling */
  className?: string;
}

/**
 * KeyboardHint
 *
 * Shows a keyboard shortcut badge next to UI elements
 */
export function KeyboardHint({
  shortcut,
  showOnHover = false,
  size = "sm",
  className = "",
}: KeyboardHintProps) {
  const sizeClasses = {
    xs: "text-[10px] px-1 py-0.5",
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-mono font-semibold
    bg-gray-100 dark:bg-gray-700
    text-gray-600 dark:text-gray-300
    border border-gray-300 dark:border-gray-600
    rounded
    shadow-sm
    ${sizeClasses[size]}
    ${showOnHover ? "opacity-0 group-hover:opacity-100 transition-opacity" : ""}
    ${className}
  `.trim().replace(/\s+/g, " ");

  return (
    <kbd className={baseClasses} aria-label={`Keyboard shortcut: ${shortcut}`}>
      {shortcut}
    </kbd>
  );
}

/**
 * ShortcutButton
 *
 * Button component with built-in keyboard hint
 */
interface ShortcutButtonProps {
  children: ReactNode;
  shortcut?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function ShortcutButton({
  children,
  shortcut,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
  className = "",
}: ShortcutButtonProps) {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group
        flex items-center gap-2
        px-4 py-2
        rounded-lg
        font-medium
        transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {shortcut && (
        <KeyboardHint shortcut={shortcut} showOnHover size="xs" className="ml-1" />
      )}
    </button>
  );
}

/**
 * ShortcutInput
 *
 * Input component with keyboard hint label
 */
interface ShortcutInputProps {
  label?: string;
  shortcut?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: "text" | "search" | "email" | "password";
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export function ShortcutInput({
  label,
  shortcut,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  inputRef,
}: ShortcutInputProps) {
  return (
    <div className={className}>
      {label && (
        <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>{label}</span>
          {shortcut && <KeyboardHint shortcut={shortcut} size="xs" />}
        </label>
      )}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}

/**
 * ShortcutTooltip
 *
 * Tooltip that shows keyboard shortcut information
 */
interface ShortcutTooltipProps {
  children: ReactNode;
  shortcut: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function ShortcutTooltip({
  children,
  shortcut,
  description,
  position = "bottom",
}: ShortcutTooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div
        className={`
          absolute ${positionClasses[position]}
          hidden group-hover:block
          z-50
          w-max max-w-xs
          px-3 py-2
          bg-gray-900 dark:bg-gray-700
          text-white text-sm
          rounded-lg
          shadow-lg
          pointer-events-none
        `.trim().replace(/\s+/g, " ")}
      >
        <div className="flex items-center gap-2">
          <span>{description}</span>
          <KeyboardHint shortcut={shortcut} size="xs" className="bg-gray-800 dark:bg-gray-600 border-gray-700" />
        </div>
      </div>
    </div>
  );
}

/**
 * QuickTip
 *
 * Inline tip showing keyboard shortcut for an action
 */
interface QuickTipProps {
  shortcut: string;
  description: string;
  icon?: ReactNode;
}

export function QuickTip({ shortcut, description, icon }: QuickTipProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
      {icon && <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">{icon}</span>}
      <span className="text-gray-700 dark:text-gray-300">{description}</span>
      <KeyboardHint shortcut={shortcut} size="sm" className="ml-auto" />
    </div>
  );
}
