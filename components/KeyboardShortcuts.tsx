"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Keyboard, X } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Show help menu with ?
      if (event.key === "?") {
        event.preventDefault();
        setShowHelp(!showHelp);
        return;
      }

      // Close help menu with Escape
      if (event.key === "Escape" && showHelp) {
        setShowHelp(false);
        return;
      }

      // Navigation shortcuts (with Alt key)
      if (event.altKey) {
        event.preventDefault();
        switch (event.key.toLowerCase()) {
          case "d":
            router.push("/dashboard");
            break;
          case "t":
            router.push("/transactions");
            break;
          case "b":
            router.push("/budgets");
            break;
          case "g":
            router.push("/goals");
            break;
          case "r":
            router.push("/reports");
            break;
          case "s":
            router.push("/settings");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [router, showHelp]);

  const shortcuts: Shortcut[] = [
    { key: "Alt + D", description: "Go to Dashboard", action: () => router.push("/dashboard") },
    { key: "Alt + T", description: "Go to Transactions", action: () => router.push("/transactions") },
    { key: "Alt + B", description: "Go to Budgets", action: () => router.push("/budgets") },
    { key: "Alt + G", description: "Go to Goals", action: () => router.push("/goals") },
    { key: "Alt + R", description: "Go to Reports", action: () => router.push("/reports") },
    { key: "Alt + S", description: "Go to Settings", action: () => router.push("/settings") },
    { key: "?", description: "Show keyboard shortcuts", action: () => setShowHelp(!showHelp) },
    { key: "Esc", description: "Close dialogs/modals", action: () => {} },
  ];

  return (
    <>
      {/* Keyboard shortcut button */}
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition z-40"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {/* Help modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowHelp(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                id="shortcuts-title"
                className="text-xl font-bold text-gray-900 dark:text-white flex items-center"
              >
                <Keyboard className="h-6 w-6 mr-2 text-blue-600" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                aria-label="Close shortcuts menu"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {shortcut.description}
                  </span>
                  <kbd className="px-3 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Press <kbd className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">?</kbd> anytime to toggle this menu
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
