import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ChartContainer({
  title,
  description,
  children,
  action,
}: ChartContainerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}

interface ChartLoadingProps {
  height?: number;
}

export function ChartLoading({ height = 300 }: ChartLoadingProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg animate-pulse"
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading chart data...
        </p>
      </div>
    </div>
  );
}

interface ChartEmptyProps {
  title: string;
  description: string;
  height?: number;
}

export function ChartEmpty({ title, description, height = 300 }: ChartEmptyProps) {
  return (
    <div
      className="flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg"
      style={{ height: `${height}px` }}
    >
      <div className="text-center px-4">
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
