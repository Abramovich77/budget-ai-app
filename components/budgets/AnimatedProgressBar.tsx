"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedProgressBarProps {
  percentage: number;
  color: string;
  isOverspent?: boolean;
  isWarning?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  height?: "sm" | "md" | "lg";
}

export function AnimatedProgressBar({
  percentage,
  color,
  isOverspent = false,
  isWarning = false,
  showPercentage = true,
  animated = true,
  height = "md",
}: AnimatedProgressBarProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  const barColorClass = isOverspent
    ? "bg-red-600"
    : isWarning
    ? "bg-yellow-500"
    : "bg-green-500";

  useEffect(() => {
    if (!animated) {
      setDisplayPercentage(percentage);
      return;
    }

    setIsAnimating(true);
    const duration = 1000; // 1 second animation
    const startTime = Date.now();
    const startPercentage = displayPercentage;
    const endPercentage = percentage;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startPercentage + (endPercentage - startPercentage) * easeOut;

      setDisplayPercentage(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [percentage, animated]);

  const clampedPercentage = Math.min(displayPercentage, 100);
  const displayWidth = Math.min(percentage, 100);

  return (
    <div className="relative">
      {/* Progress bar track */}
      <div
        className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClasses[height]}`}
      >
        {/* Progress bar fill */}
        <div
          className={`rounded-full ${heightClasses[height]} transition-all duration-700 ease-out ${barColorClass} ${
            isAnimating ? "animate-pulse-subtle" : ""
          }`}
          style={{
            width: `${displayWidth}%`,
            transition: animated ? "width 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
          }}
        >
          {/* Shimmer effect for active animation */}
          {isAnimating && (
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>

      {/* Percentage label */}
      {showPercentage && (
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-sm font-semibold transition-colors ${
              isOverspent
                ? "text-red-600 dark:text-red-400"
                : isWarning
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {clampedPercentage.toFixed(1)}%
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {isOverspent ? "Over budget" : isWarning ? "Near limit" : "On track"}
          </span>
        </div>
      )}
    </div>
  );
}

// Add custom animations to globals.css
/*
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s ease-in-out infinite;
}
*/
