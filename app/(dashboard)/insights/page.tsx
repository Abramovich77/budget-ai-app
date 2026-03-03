/**
 * Insights Page
 *
 * Dedicated page for viewing all AI-powered financial insights.
 */

import { auth } from "@/lib/auth";
import { InsightsCard } from "@/components/dashboard/InsightsCard";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

export default async function InsightsPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Insights
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized financial recommendations powered by AI
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Smart Analysis
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Our AI analyzes your spending patterns to provide actionable recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Track Progress
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Monitor your financial health and see improvements over time
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Early Warnings
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Get alerts before budget overruns and identify cost savings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Insights Section */}
      <InsightsCard maxInsights={20} />

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Understanding Your Insights
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
            <p>
              <span className="font-medium text-gray-900 dark:text-white">Critical:</span>{" "}
              Requires immediate attention - budget overruns or urgent issues
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
            <p>
              <span className="font-medium text-gray-900 dark:text-white">Warning:</span>{" "}
              Approaching limits or moderate concerns that need monitoring
            </p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
            <p>
              <span className="font-medium text-gray-900 dark:text-white">Info:</span>{" "}
              Helpful tips, positive trends, and general recommendations
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-white">Tip:</span>{" "}
            Click "Show More" on any insight to see detailed recommendations and impact analysis.
            Use the "Take Action" button to navigate directly to the relevant page.
          </p>
        </div>
      </div>
    </div>
  );
}
