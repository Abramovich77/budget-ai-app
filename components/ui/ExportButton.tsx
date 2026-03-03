"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, Check } from "lucide-react";

interface ExportButtonProps {
  onExportCSV?: () => void;
  onExportJSON?: () => void;
  onExportPDF?: () => void;
  label?: string;
  variant?: "button" | "icon";
  className?: string;
}

export function ExportButton({
  onExportCSV,
  onExportJSON,
  onExportPDF,
  label = "Export",
  variant = "button",
  className = "",
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const handleExport = (type: string, callback?: () => void) => {
    if (callback) {
      callback();
      setExported(type);
      setTimeout(() => {
        setExported(null);
        setIsOpen(false);
      }, 1500);
    }
  };

  // Count available export options
  const exportOptions = [
    onExportCSV && { type: "CSV", icon: FileSpreadsheet, callback: onExportCSV },
    onExportJSON && { type: "JSON", icon: FileText, callback: onExportJSON },
    onExportPDF && { type: "PDF", icon: FileText, callback: onExportPDF },
  ].filter(Boolean) as Array<{
    type: string;
    icon: React.ComponentType<{ className?: string }>;
    callback: () => void;
  }>;

  // If only one option, show direct button
  if (exportOptions.length === 1) {
    const option = exportOptions[0];
    const Icon = option.icon;

    return (
      <button
        onClick={() => handleExport(option.type, option.callback)}
        className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition ${className}`}
      >
        {exported === option.type ? (
          <>
            <Check className="h-5 w-5 mr-2 text-green-600" />
            Exported!
          </>
        ) : (
          <>
            <Icon className="h-5 w-5 mr-2" />
            {label}
          </>
        )}
      </button>
    );
  }

  // Multiple options - show dropdown
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition ${className}`}
      >
        <Download className="h-5 w-5 mr-2" />
        {label}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 animate-scale-in">
            <div className="py-2">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                const isExported = exported === option.type;

                return (
                  <button
                    key={option.type}
                    onClick={() => handleExport(option.type, option.callback)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between"
                  >
                    <span className="flex items-center">
                      <Icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Export as {option.type}
                      </span>
                    </span>
                    {isExported && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
