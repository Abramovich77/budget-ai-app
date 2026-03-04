"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Keyboard, X, Search, Clock } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category?: string;
  searchTerms?: string[];
}

export function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();
  const [showHelp, setShowHelp] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Command palette with Cmd/Ctrl + K
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setShowCommandPalette(!showCommandPalette);
        setSearchQuery("");
        setSelectedIndex(0);
        return;
      }

      // Ignore other shortcuts if user is typing in an input/textarea
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

      // Close modals with Escape
      if (event.key === "Escape") {
        if (showCommandPalette) {
          setShowCommandPalette(false);
          setSearchQuery("");
        } else if (showHelp) {
          setShowHelp(false);
        }
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
  }, [router, showHelp, showCommandPalette]);

  // Focus search input when command palette opens
  useEffect(() => {
    if (showCommandPalette && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showCommandPalette]);

  // Define shortcuts array
  const shortcuts: Shortcut[] = [
    {
      key: "⌘ K / Ctrl K",
      description: "Open command palette",
      action: () => setShowCommandPalette(true),
      category: "General",
      searchTerms: ["search", "find", "palette", "command"]
    },
    {
      key: "?",
      description: "Show keyboard shortcuts",
      action: () => setShowHelp(!showHelp),
      category: "General",
      searchTerms: ["help", "shortcuts", "keys"]
    },
    {
      key: "Esc",
      description: "Close dialogs/modals",
      action: () => {},
      category: "General",
      searchTerms: ["close", "cancel", "dismiss"]
    },
    {
      key: "Alt + D",
      description: "Go to Dashboard",
      action: () => { router.push("/dashboard"); setShowCommandPalette(false); },
      category: "Navigation",
      searchTerms: ["dashboard", "home", "overview"]
    },
    {
      key: "Alt + T",
      description: "Go to Transactions",
      action: () => { router.push("/transactions"); setShowCommandPalette(false); },
      category: "Navigation",
      searchTerms: ["transactions", "expenses", "income"]
    },
    {
      key: "Alt + B",
      description: "Go to Budgets",
      action: () => { router.push("/budgets"); setShowCommandPalette(false); },
      category: "Navigation",
      searchTerms: ["budgets", "spending", "limits"]
    },
    {
      key: "Alt + G",
      description: "Go to Goals",
      action: () => { router.push("/goals"); setShowCommandPalette(false); },
      category: "Navigation",
      searchTerms: ["goals", "savings", "targets"]
    },
    {
      key: "Alt + R",
      description: "Go to Reports",
      action: () => { router.push("/reports"); setShowCommandPalette(false); },
      category: "Navigation",
      searchTerms: ["reports", "analytics", "charts"]
    },
    {
      key: "Alt + S",
      description: "Go to Settings",
      action: () => { router.push("/settings"); setShowCommandPalette(false); },
      category: "Navigation",
      searchTerms: ["settings", "preferences", "profile"]
    },
    {
      key: "N",
      description: "Create new item",
      action: () => {},
      category: "Actions",
      searchTerms: ["new", "create", "add", "transaction", "budget", "goal"]
    },
    {
      key: "F",
      description: "Focus search",
      action: () => {},
      category: "Actions",
      searchTerms: ["search", "find", "filter"]
    },
    {
      key: "E",
      description: "Export data",
      action: () => {},
      category: "Actions",
      searchTerms: ["export", "download", "csv", "json"]
    },
    {
      key: "A",
      description: "Toggle alerts",
      action: () => {},
      category: "Actions",
      searchTerms: ["alerts", "notifications", "warnings"]
    },
  ];

  // Execute command handler
  const executeCommand = (shortcut: Shortcut) => {
    shortcut.action();
    // Add to recent commands
    setRecentCommands((prev) => {
      const filtered = prev.filter((cmd) => cmd !== shortcut.description);
      return [shortcut.description, ...filtered].slice(0, 5);
    });
    setShowCommandPalette(false);
    setSearchQuery("");
  };

  // Filter shortcuts based on search query
  const filteredShortcuts = shortcuts.filter((shortcut) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      shortcut.description.toLowerCase().includes(query) ||
      shortcut.key.toLowerCase().includes(query) ||
      shortcut.category?.toLowerCase().includes(query) ||
      shortcut.searchTerms?.some((term) => term.toLowerCase().includes(query))
    );
  });

  // Group shortcuts by category
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // Handle keyboard navigation in command palette
  useEffect(() => {
    if (!showCommandPalette) return;

    const handleCommandPaletteKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredShortcuts.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const selectedShortcut = filteredShortcuts[selectedIndex];
        if (selectedShortcut) {
          executeCommand(selectedShortcut);
        }
      }
    };

    window.addEventListener("keydown", handleCommandPaletteKeys);
    return () => window.removeEventListener("keydown", handleCommandPaletteKeys);
  }, [showCommandPalette, selectedIndex, filteredShortcuts]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  return (
    <>
      {/* Command Palette */}
      {showCommandPalette && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-[15vh] animate-fade-in"
          onClick={() => setShowCommandPalette(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-palette-title"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Search commands"
                />
              </div>
            </div>

            {/* Recent Commands */}
            {!searchQuery && recentCommands.length > 0 && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent
                </div>
                {recentCommands.map((cmd, index) => {
                  const shortcut = shortcuts.find((s) => s.description === cmd);
                  if (!shortcut) return null;
                  return (
                    <button
                      key={`recent-${index}`}
                      onClick={() => executeCommand(shortcut)}
                      className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-left"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                      <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 rounded">
                        {shortcut.key}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Commands List */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {Object.keys(groupedShortcuts).length === 0 ? (
                <div className="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No commands found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
              ) : (
                Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category} className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {category}
                    </div>
                    {categoryShortcuts.map((shortcut, index) => {
                      const globalIndex = filteredShortcuts.indexOf(shortcut);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={`${category}-${index}`}
                          onClick={() => executeCommand(shortcut)}
                          className={`w-full px-3 py-2 flex items-center justify-between rounded-lg transition text-left ${
                            isSelected
                              ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-600"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span className={`text-sm ${isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"}`}>
                            {shortcut.description}
                          </span>
                          <kbd className="px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 rounded">
                            {shortcut.key}
                          </kbd>
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Esc</kbd>
                    Close
                  </span>
                </div>
                <span>{filteredShortcuts.length} commands</span>
              </div>
            </div>
          </div>
        </div>
      )}

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

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-1">
                    {category}
                  </p>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut) => (
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
