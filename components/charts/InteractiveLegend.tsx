/**
 * Interactive legend component with click-to-toggle functionality
 */

import { memo } from "react";
import { Eye, EyeOff } from "lucide-react";

interface LegendItem {
  dataKey: string;
  label: string;
  color: string;
  value?: number;
}

interface InteractiveLegendProps {
  items: LegendItem[];
  hiddenItems: Set<string>;
  onToggle: (dataKey: string) => void;
  showValues?: boolean;
}

export const InteractiveLegend = memo(function InteractiveLegend({
  items,
  hiddenItems,
  onToggle,
  showValues = false,
}: InteractiveLegendProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {items.map((item) => {
        const isHidden = hiddenItems.has(item.dataKey);

        return (
          <button
            key={item.dataKey}
            onClick={() => onToggle(item.dataKey)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 ${
              isHidden
                ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-50"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
            }`}
          >
            {/* Color Indicator */}
            <div
              className={`w-3 h-3 rounded transition-all ${isHidden ? "opacity-30" : ""}`}
              style={{ backgroundColor: item.color }}
            />

            {/* Label */}
            <span
              className={`text-sm font-medium transition-all ${
                isHidden
                  ? "text-gray-400 dark:text-gray-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {item.label}
            </span>

            {/* Value (if provided) */}
            {showValues && item.value !== undefined && (
              <span
                className={`text-xs font-semibold ${
                  isHidden
                    ? "text-gray-400 dark:text-gray-600"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                ${item.value.toLocaleString()}
              </span>
            )}

            {/* Eye Icon */}
            {isHidden ? (
              <EyeOff className="h-3 w-3 text-gray-400" />
            ) : (
              <Eye className="h-3 w-3 text-gray-500" />
            )}
          </button>
        );
      })}
    </div>
  );
});

/**
 * Simple legend for pie charts with categories
 */
interface CategoryLegendProps {
  categories: Array<{
    name: string;
    color: string;
    value: number;
    percentage: number;
  }>;
  selectedCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
}

export const CategoryLegend = memo(function CategoryLegend({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryLegendProps) {
  const totalValue = categories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Category</span>
        <span>Amount</span>
      </div>

      {categories.map((category) => {
        const isSelected = selectedCategory === category.name;
        const isOtherSelected = selectedCategory && selectedCategory !== category.name;

        return (
          <button
            key={category.name}
            onClick={() =>
              onSelectCategory?.(isSelected ? null : category.name)
            }
            className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all ${
              isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                : isOtherSelected
                ? "border-gray-200 dark:border-gray-700 opacity-40"
                : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Color dot */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color }}
              />

              {/* Category name */}
              <span className="text-sm font-medium text-gray-900 dark:text-white text-left">
                {category.name}
              </span>

              {/* Percentage bar */}
              <div className="flex-1 mx-2">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Amount and percentage */}
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                ${category.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {category.percentage.toFixed(1)}%
              </div>
            </div>
          </button>
        );
      })}

      {/* Total */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          ${totalValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
});
