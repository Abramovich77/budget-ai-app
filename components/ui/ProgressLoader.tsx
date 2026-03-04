/**
 * ProgressLoader Component
 *
 * A loading indicator with progress percentage for long operations.
 * Provides visual feedback with animated progress bar and percentage display.
 */

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProgressLoaderProps {
  /** Progress percentage (0-100) */
  progress?: number;
  /** Loading message to display */
  message?: string;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Show percentage text */
  showPercentage?: boolean;
  /** Simulate progress if no actual progress provided */
  simulate?: boolean;
  /** Estimated duration in ms for simulation */
  estimatedDuration?: number;
}

export function ProgressLoader({
  progress: externalProgress,
  message = "Loading...",
  size = "md",
  showPercentage = true,
  simulate = false,
  estimatedDuration = 3000,
}: ProgressLoaderProps) {
  const [simulatedProgress, setSimulatedProgress] = useState(0);

  // Simulate progress if no external progress provided
  useEffect(() => {
    if (!simulate || externalProgress !== undefined) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 95);
      setSimulatedProgress(Math.floor(progress));

      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [simulate, externalProgress, estimatedDuration]);

  const currentProgress = externalProgress ?? (simulate ? simulatedProgress : 0);

  const sizeClasses = {
    sm: {
      container: "w-48",
      bar: "h-1",
      icon: "h-4 w-4",
      text: "text-xs",
    },
    md: {
      container: "w-64",
      bar: "h-2",
      icon: "h-5 w-5",
      text: "text-sm",
    },
    lg: {
      container: "w-80",
      bar: "h-3",
      icon: "h-6 w-6",
      text: "text-base",
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`${classes.container} space-y-3`}>
      {/* Message and icon */}
      <div className="flex items-center justify-center gap-2">
        <Loader2 className={`${classes.icon} text-blue-600 dark:text-blue-400 animate-spin`} />
        <span className={`${classes.text} text-gray-700 dark:text-gray-300 font-medium`}>
          {message}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative">
        <div className={`${classes.bar} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
          <div
            className={`${classes.bar} bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out`}
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        {/* Percentage text */}
        {showPercentage && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {currentProgress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ProgressLoadingScreen
 *
 * Full-screen loading overlay with progress indicator
 */
interface ProgressLoadingScreenProps {
  progress?: number;
  message?: string;
  simulate?: boolean;
  estimatedDuration?: number;
}

export function ProgressLoadingScreen({
  progress,
  message = "Loading your data...",
  simulate = true,
  estimatedDuration = 3000,
}: ProgressLoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <ProgressLoader
          progress={progress}
          message={message}
          size="lg"
          showPercentage={true}
          simulate={simulate}
          estimatedDuration={estimatedDuration}
        />
        <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we process your request...
        </p>
      </div>
    </div>
  );
}

/**
 * InlineProgressLoader
 *
 * Compact inline loader for cards and smaller containers
 */
interface InlineProgressLoaderProps {
  progress?: number;
  message?: string;
  simulate?: boolean;
}

export function InlineProgressLoader({
  progress,
  message = "Loading...",
  simulate = true,
}: InlineProgressLoaderProps) {
  return (
    <div className="flex items-center justify-center py-8">
      <ProgressLoader
        progress={progress}
        message={message}
        size="sm"
        showPercentage={true}
        simulate={simulate}
        estimatedDuration={2000}
      />
    </div>
  );
}
