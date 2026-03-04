"use client";

import { useMemo } from "react";

interface CategoryData {
  name: string;
  amount: number;
  color: string;
}

interface CategorySpendingChartProps {
  data: CategoryData[];
}

export function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  const total = useMemo(() => data.reduce((sum, cat) => sum + cat.amount, 0), [data]);

  const chartData = useMemo(() => {
    let cumulativePercentage = 0;
    return data
      .sort((a, b) => b.amount - a.amount)
      .map((category) => {
        const percentage = (category.amount / total) * 100;
        const startPercentage = cumulativePercentage;
        cumulativePercentage += percentage;
        return {
          ...category,
          percentage,
          startPercentage,
        };
      });
  }, [data, total]);

  const createArcPath = (startPercentage: number, percentage: number) => {
    const start = (startPercentage / 100) * 360 - 90;
    const end = ((startPercentage + percentage) / 100) * 360 - 90;
    
    const startRad = (start * Math.PI) / 180;
    const endRad = (end * Math.PI) / 180;
    
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArc = percentage > 50 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Spending by Category
      </h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="0 0 200 200" className="transform -rotate-90">
            {chartData.map((category, index) => (
              <g key={category.name} className="group cursor-pointer">
                <path
                  d={createArcPath(category.startPercentage, category.percentage)}
                  fill={category.color}
                  className="transition-all duration-300 hover:opacity-80 hover:scale-105"
                  style={{
                    animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                    transformOrigin: 'center',
                  }}
                />
              </g>
            ))}
            {/* Center circle for donut effect */}
            <circle cx="100" cy="100" r="50" fill="currentColor" className="text-white dark:text-gray-800" />
          </svg>
          
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${(total / 1000).toFixed(1)}k
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex-1 w-full">
          <div className="space-y-3">
            {chartData.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group hover:scale-[1.02] hover:shadow-sm"
                style={{
                  animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
                    ${category.amount.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 min-w-[3rem] text-right">
                    {category.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
