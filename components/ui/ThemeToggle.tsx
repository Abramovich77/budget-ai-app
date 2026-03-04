/**
 * ThemeToggle Component
 *
 * A toggle button for switching between light, dark, and system themes.
 * Features smooth transitions and animated icons.
 */

"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { useState, useEffect } from "react";

interface ThemeToggleProps {
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show labels */
  showLabel?: boolean;
  /** Variant style */
  variant?: "icon" | "dropdown" | "segmented";
}

export function ThemeToggle({
  size = "md",
  showLabel = false,
  variant = "icon",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />; // Placeholder to avoid layout shift
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  if (variant === "icon") {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600`}
        aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className={`${iconSizeClasses[size]} text-yellow-500 animate-fade-in`} />
        ) : (
          <Moon className={`${iconSizeClasses[size]} text-blue-600 animate-fade-in`} />
        )}
      </button>
    );
  }

  if (variant === "segmented") {
    return (
      <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            theme === "light"
              ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label="Light mode"
          title="Light mode"
        >
          <Sun className="h-4 w-4" />
          {showLabel && <span className="text-sm font-medium">Light</span>}
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            theme === "dark"
              ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label="Dark mode"
          title="Dark mode"
        >
          <Moon className="h-4 w-4" />
          {showLabel && <span className="text-sm font-medium">Dark</span>}
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            theme === "system"
              ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          aria-label="System mode"
          title="System mode"
        >
          <Monitor className="h-4 w-4" />
          {showLabel && <span className="text-sm font-medium">System</span>}
        </button>
      </div>
    );
  }

  // Dropdown variant
  return (
    <div className="relative group">
      <button
        className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600`}
        aria-label="Theme options"
        title="Change theme"
      >
        {theme === "light" && <Sun className={`${iconSizeClasses[size]} text-yellow-500`} />}
        {theme === "dark" && <Moon className={`${iconSizeClasses[size]} text-blue-600`} />}
        {theme === "system" && <Monitor className={`${iconSizeClasses[size]} text-gray-600 dark:text-gray-400`} />}
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => setTheme("light")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg ${
            theme === "light" ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Sun className="h-4 w-4" />
          <span className="text-sm">Light</span>
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            theme === "dark" ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Moon className="h-4 w-4" />
          <span className="text-sm">Dark</span>
        </button>
        <button
          onClick={() => setTheme("system")}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-lg ${
            theme === "system" ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          <Monitor className="h-4 w-4" />
          <span className="text-sm">System</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Compact variant for mobile header
 */
export function MobileThemeToggle() {
  return <ThemeToggle size="sm" variant="icon" />;
}

/**
 * Full variant for settings page
 */
export function SettingsThemeToggle() {
  return <ThemeToggle size="md" variant="segmented" showLabel />;
}
