import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { InfoTooltip } from "@/components/ui/Tooltip";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: string;
  trendColor?: string;
  tooltip: string;
  delay?: string;
}

function StatCardComponent({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  trend,
  trendColor,
  tooltip,
  delay = "0s",
}: StatCardProps) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-scale-in"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          <InfoTooltip content={tooltip} />
        </div>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
      {trend && (
        <p className={`text-sm mt-2 ${trendColor}`}>
          {trend}
        </p>
      )}
      {subtitle && !trend && (
        <p className="text-sm text-gray-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
}

// Memoized to prevent re-renders when parent re-renders but props haven't changed
export const StatCard = memo(StatCardComponent);
