"use client";

import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  animate?: boolean;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = "#3b82f6",
  fillOpacity = 0.1,
  strokeWidth = 1.5,
  animate = true,
}: SparklineProps) {
  const { points, path, areaPath } = useMemo(() => {
    if (data.length < 2) {
      return { points: [], path: "", areaPath: "" };
    }

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const xStep = chartWidth / (data.length - 1);

    const points = data.map((value, index) => {
      const x = padding + index * xStep;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return { x, y, value };
    });

    // Create line path
    const pathString = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    // Create area path (filled below the line)
    const areaPathString = `${pathString} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return {
      points,
      path: pathString,
      areaPath: areaPathString,
    };
  }, [data, width, height]);

  if (data.length < 2) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center text-gray-400 text-xs"
      >
        —
      </div>
    );
  }

  const trend = data[data.length - 1] - data[0];
  const isPositive = trend >= 0;

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
      style={{ display: "block" }}
    >
      {/* Area fill */}
      <path
        d={areaPath}
        fill={color}
        fillOpacity={fillOpacity}
        className={animate ? "animate-fade-in" : ""}
      />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "animate-draw-line" : ""}
        style={
          animate
            ? {
                strokeDasharray: 200,
                strokeDashoffset: 200,
                animation: "drawLine 0.8s ease-out forwards",
              }
            : undefined
        }
      />

      {/* End point dot */}
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={2}
          fill={color}
          className={animate ? "animate-scale-in" : ""}
          style={animate ? { animationDelay: "0.6s" } : undefined}
        />
      )}
    </svg>
  );
}

// Add animation to globals.css:
/*
@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}
*/
