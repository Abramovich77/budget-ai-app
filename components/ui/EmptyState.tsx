import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-4 transition-transform hover:scale-105">
        <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          variant="primary"
        >
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  compact?: boolean;
}

export function EmptyStateCard({ icon: Icon, title, description, compact = false }: EmptyStateCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center animate-fade-in ${compact ? 'py-8' : 'py-12'}`}>
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-full transition-transform hover:scale-105 ${compact ? 'p-4 mb-3' : 'p-6 mb-4'}`}>
        <Icon className={`${compact ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 dark:text-gray-500`} />
      </div>
      <h3 className={`${compact ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white mb-2`}>
        {title}
      </h3>
      <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 max-w-xs`}>
        {description}
      </p>
    </div>
  );
}
