"use client";

import { useToast } from "@/components/ui/Toast";
import { PlusCircle, Target, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Quick Actions component for the dashboard
 * Provides convenient buttons for common user actions with toast feedback
 */
export function QuickActions() {
  const { info } = useToast();
  const router = useRouter();

  const handleAddTransaction = () => {
    info(
      "Coming Soon",
      "Transaction form modal will open here",
      3000
    );
    // Future: Open modal or navigate to transactions page
    // router.push("/transactions?action=add");
  };

  const handleCreateBudget = () => {
    info(
      "Redirecting to Budgets",
      "You can create a new budget on the budgets page",
      3000
    );
    router.push("/budgets");
  };

  const handleSetGoal = () => {
    info(
      "Redirecting to Goals",
      "You can set a new goal on the goals page",
      3000
    );
    router.push("/goals");
  };

  const actions = [
    {
      icon: PlusCircle,
      title: "Add Transaction",
      description: "Manually record income or expense",
      onClick: handleAddTransaction,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: DollarSign,
      title: "Create Budget",
      description: "Set up a new monthly budget",
      onClick: handleCreateBudget,
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: Target,
      title: "Set Goal",
      description: "Track savings or debt payoff",
      onClick: handleSetGoal,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.onClick}
              className="w-full text-left px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${action.color} group-hover:scale-110 transition-transform`} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
