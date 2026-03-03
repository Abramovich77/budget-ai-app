"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  showIcon?: boolean;
}

export function Tooltip({
  content,
  children,
  position = "top",
  showIcon = false
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      switch (position) {
        case "top":
          setCoords({
            top: rect.top - 8,
            left: rect.left + rect.width / 2,
          });
          break;
        case "bottom":
          setCoords({
            top: rect.bottom + 8,
            left: rect.left + rect.width / 2,
          });
          break;
        case "left":
          setCoords({
            top: rect.top + rect.height / 2,
            left: rect.left - 8,
          });
          break;
        case "right":
          setCoords({
            top: rect.top + rect.height / 2,
            left: rect.right + 8,
          });
          break;
      }
    }
  }, [isVisible, position]);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      ref={triggerRef}
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        showIcon && <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
      )}

      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 animate-fade-in`}
          style={{ animationDuration: "0.2s" }}
        >
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-normal">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoTooltipProps {
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function InfoTooltip({ content, position = "top" }: InfoTooltipProps) {
  return (
    <Tooltip content={content} position={position} showIcon>
      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help transition" />
    </Tooltip>
  );
}
