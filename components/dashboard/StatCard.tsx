import { memo } from "react";
import { LucideIcon } from "lucide-react";
import { InfoTooltip } from "@/components/ui/Tooltip";
import { Sparkline } from "@/components/ui/Sparkline";

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
  sparklineData?: number[];
  sparklineColor?: string;
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
  sparklineData,
  sparklineColor,
}: StatCardProps) {
  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-scale-in transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-900/50"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
            {title}
          </h3>
          <InfoTooltip content={tooltip} />
        </div>
        <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:scale-110 transition-transform">
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform origin-left">
          {value}
        </p>
        {sparklineData && sparklineData.length > 0 && (
          <div className="mb-1 group-hover:scale-105 transition-transform">
            <Sparkline
              data={sparklineData}
              width={80}
              height={28}
              color={sparklineColor || iconColor.replace('text-', '#')}
              animate={true}
            />
          </div>
        )}
      </div>
      {trend && (
        <p className={`text-sm mt-2 ${trendColor} flex items-center gap-1`}>
          {trend}
        </p>
      )}
      {subtitle && !trend && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
      )}
    </div>
  );
}

// Memoized to prevent re-renders when parent re-renders but props haven't changed
export const StatCard = memo(StatCardComponent);
