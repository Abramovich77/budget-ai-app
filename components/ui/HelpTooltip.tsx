/**
 * Help tooltip component for providing contextual hints and guidance
 */

"use client";

import { useState } from "react";
import { HelpCircle, Info, Lightbulb, AlertCircle } from "lucide-react";

interface HelpTooltipProps {
  content: string;
  type?: "help" | "info" | "tip" | "warning";
  position?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg";
}

export function HelpTooltip({
  content,
  type = "help",
  position = "top",
  size = "sm",
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Icon based on type
  const Icon = {
    help: HelpCircle,
    info: Info,
    tip: Lightbulb,
    warning: AlertCircle,
  }[type];

  // Colors based on type
  const colors = {
    help: "text-blue-600 dark:text-blue-400",
    info: "text-gray-600 dark:text-gray-400",
    tip: "text-yellow-600 dark:text-yellow-400",
    warning: "text-orange-600 dark:text-orange-400",
  }[type];

  // Tooltip background colors
  const bgColors = {
    help: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    info: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
    tip: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
    warning: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
  }[type];

  // Text colors for tooltip content
  const textColors = {
    help: "text-blue-900 dark:text-blue-100",
    info: "text-gray-900 dark:text-gray-100",
    tip: "text-yellow-900 dark:text-yellow-100",
    warning: "text-orange-900 dark:text-orange-100",
  }[type];

  // Icon sizes
  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }[position];

  // Arrow position classes
  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-200 dark:border-t-gray-700",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-200 dark:border-b-gray-700",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-200 dark:border-l-gray-700",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-200 dark:border-r-gray-700",
  }[position];

  return (
    <div className="relative inline-flex">
      {/* Trigger Icon */}
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={`${colors} hover:opacity-80 transition cursor-help focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full`}
        aria-label="Help"
      >
        <Icon className={iconSize} />
      </button>

      {/* Tooltip */}
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses} w-64 animate-fade-in`}
          role="tooltip"
        >
          <div
            className={`${bgColors} ${textColors} border rounded-lg shadow-lg p-3 text-sm`}
          >
            {content}
          </div>
          {/* Arrow */}
          <div
            className={`absolute ${arrowClasses} w-0 h-0 border-4 border-transparent`}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Inline help text component for subtle hints
 */
interface InlineHelpProps {
  text: string;
  type?: "help" | "info" | "tip" | "warning";
  icon?: boolean;
}

export function InlineHelp({ text, type = "info", icon = true }: InlineHelpProps) {
  const Icon = {
    help: HelpCircle,
    info: Info,
    tip: Lightbulb,
    warning: AlertCircle,
  }[type];

  const colors = {
    help: "text-blue-600 dark:text-blue-400",
    info: "text-gray-500 dark:text-gray-400",
    tip: "text-yellow-600 dark:text-yellow-400",
    warning: "text-orange-600 dark:text-orange-400",
  }[type];

  return (
    <div className={`flex items-start gap-2 text-xs ${colors} mt-1`}>
      {icon && <Icon className="h-3 w-3 mt-0.5 flex-shrink-0" />}
      <span>{text}</span>
    </div>
  );
}

/**
 * Feature banner component for highlighting new features or important info
 */
interface FeatureBannerProps {
  title: string;
  description: string;
  type?: "info" | "tip" | "warning" | "success";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function FeatureBanner({
  title,
  description,
  type = "info",
  dismissible = false,
  onDismiss,
}: FeatureBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const styles = {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100",
    },
    tip: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      icon: "text-yellow-600 dark:text-yellow-400",
      text: "text-yellow-900 dark:text-yellow-100",
    },
    warning: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      icon: "text-orange-600 dark:text-orange-400",
      text: "text-orange-900 dark:text-orange-100",
    },
    success: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      text: "text-green-900 dark:text-green-100",
    },
  }[type];

  const Icon = type === "tip" ? Lightbulb : type === "warning" ? AlertCircle : Info;

  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-lg p-4 mb-6 animate-fade-in`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${styles.text} mb-1`}>{title}</h3>
          <p className={`text-sm ${styles.text}`}>{description}</p>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`${styles.icon} hover:opacity-70 transition`}
            aria-label="Dismiss"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
