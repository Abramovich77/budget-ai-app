import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  currency?: string;
  showPercentage?: boolean;
}

export function CustomLineTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
        {label}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            ${entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CustomPieTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: data.payload.color }}
        />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {data.name}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Amount: <span className="font-semibold text-gray-900 dark:text-white">
            ${data.value?.toLocaleString()}
          </span>
        </p>
        {data.payload.percentage && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Percentage: <span className="font-semibold text-gray-900 dark:text-white">
              {data.payload.percentage.toFixed(1)}%
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export function CustomBarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {label}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => {
          const isIncrease = entry.dataKey === 'thisMonth';
          return (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}:
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                ${entry.value?.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
