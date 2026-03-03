"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Sparkles, Award, Zap, PartyPopper } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export interface Milestone {
  id: string;
  percentage: number; // 25, 50, 75, 100
  label: string;
  reached: boolean;
  celebrationShown: boolean;
}

interface GoalMilestoneProps {
  goalId: string;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  onMilestoneReached?: (milestone: Milestone) => void;
}

const MILESTONE_THRESHOLDS = [
  { percentage: 25, label: "Quarter Way There!", icon: Star, color: "text-yellow-500" },
  { percentage: 50, label: "Halfway There!", icon: Zap, color: "text-orange-500" },
  { percentage: 75, label: "Three Quarters Done!", icon: Award, color: "text-purple-500" },
  { percentage: 100, label: "Goal Achieved!", icon: Trophy, color: "text-green-500" },
];

/**
 * Component that tracks goal milestones and triggers celebration animations
 * when users reach 25%, 50%, 75%, and 100% of their goal
 */
export function GoalMilestone({
  goalId,
  goalName,
  currentAmount,
  targetAmount,
  onMilestoneReached,
}: GoalMilestoneProps) {
  const { showToast } = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const progress = (currentAmount / targetAmount) * 100;
    return MILESTONE_THRESHOLDS.map((threshold) => ({
      id: `${goalId}-${threshold.percentage}`,
      percentage: threshold.percentage,
      label: threshold.label,
      reached: progress >= threshold.percentage,
      celebrationShown: false,
    }));
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{
    label: string;
    icon: any;
    color: string;
  } | null>(null);

  useEffect(() => {
    const progress = (currentAmount / targetAmount) * 100;

    // Check for newly reached milestones
    milestones.forEach((milestone, index) => {
      if (
        progress >= milestone.percentage &&
        !milestone.reached &&
        !milestone.celebrationShown
      ) {
        const threshold = MILESTONE_THRESHOLDS[index];

        // Mark as reached
        setMilestones((prev) =>
          prev.map((m) =>
            m.id === milestone.id
              ? { ...m, reached: true, celebrationShown: true }
              : m
          )
        );

        // Show celebration
        setCelebrationData({
          label: threshold.label,
          icon: threshold.icon,
          color: threshold.color,
        });
        setShowCelebration(true);

        // Show toast notification
        showToast(
          "success",
          `🎉 ${threshold.label}`,
          `You've reached ${milestone.percentage}% of your ${goalName} goal!`,
          8000
        );

        // Callback for parent component
        if (onMilestoneReached) {
          onMilestoneReached({ ...milestone, reached: true, celebrationShown: true });
        }

        // Hide celebration after 4 seconds
        setTimeout(() => {
          setShowCelebration(false);
        }, 4000);
      }
    });
  }, [currentAmount, targetAmount, milestones, goalName, showToast, onMilestoneReached]);

  const progress = (currentAmount / targetAmount) * 100;
  const nextMilestone = milestones.find((m) => !m.reached);

  return (
    <div>
      {/* Milestone Progress Indicators */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Milestones
          </span>
          {nextMilestone && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Next: {nextMilestone.percentage}%
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {MILESTONE_THRESHOLDS.map((threshold, index) => {
            const milestone = milestones[index];
            const Icon = threshold.icon;
            return (
              <div
                key={threshold.percentage}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                    milestone.reached
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
                <Icon
                  className={`h-3 w-3 transition-all duration-300 ${
                    milestone.reached
                      ? `${threshold.color} scale-110`
                      : "text-gray-400 scale-90"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium ${
                    milestone.reached
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400"
                  }`}
                >
                  {threshold.percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Celebration Animation Overlay */}
      {showCelebration && celebrationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative animate-celebration">
            {/* Confetti particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-confetti"
                  style={{
                    left: `${50 + Math.random() * 10 - 5}%`,
                    top: `${50 + Math.random() * 10 - 5}%`,
                    background: [
                      "#fbbf24",
                      "#3b82f6",
                      "#10b981",
                      "#ef4444",
                      "#8b5cf6",
                    ][Math.floor(Math.random() * 5)],
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1 + Math.random()}s`,
                  }}
                />
              ))}
            </div>

            {/* Main celebration card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md border-4 border-yellow-400 dark:border-yellow-500 animate-bounce-slow">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <celebrationData.icon
                      className={`h-20 w-20 ${celebrationData.color} animate-pulse-slow`}
                    />
                    <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-spin-slow" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {celebrationData.label}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  Keep up the amazing work!
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-500">
                  <PartyPopper className="h-5 w-5" />
                  <span className="font-semibold">{goalName}</span>
                  <PartyPopper className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Simple milestone progress bar without celebrations (for display only)
 */
export function MilestoneProgressBar({ progress }: { progress: number }) {
  return (
    <div className="flex gap-1 mt-2">
      {MILESTONE_THRESHOLDS.map((threshold) => {
        const reached = progress >= threshold.percentage;
        const Icon = threshold.icon;
        return (
          <div
            key={threshold.percentage}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className={`w-full h-1 rounded-full transition-all duration-500 ${
                reached
                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
            <Icon
              className={`h-3 w-3 transition-all ${
                reached ? `${threshold.color}` : "text-gray-400"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
