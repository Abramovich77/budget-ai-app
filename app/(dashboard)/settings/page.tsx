"use client";

import { useState, useMemo } from "react";
import { User, Bell, Lock, CreditCard, Globe, Moon, Sun, Mail, Shield, Monitor, Download, Search, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/ui/Toast";
import { ExportDataModal } from "@/components/ExportDataModal";
import { DataManagement } from "@/components/settings/DataManagement";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { success, error, warning, info } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSaveProfile = () => {
    success("Profile Updated", "Your profile changes have been saved successfully.");
  };

  const handleToggleNotification = (type: string, value: boolean) => {
    info(
      `${type} ${value ? "Enabled" : "Disabled"}`,
      `You will ${value ? "now" : "no longer"} receive ${type.toLowerCase()}.`
    );
  };

  // Define searchable sections with keywords
  const sections = useMemo(() => [
    {
      id: "profile",
      title: "Profile Information",
      keywords: ["profile", "name", "email", "personal", "account", "information", "user"],
    },
    {
      id: "notifications",
      title: "Notification Settings",
      keywords: ["notifications", "alerts", "email", "push", "budget", "goals", "reminders"],
    },
    {
      id: "security",
      title: "Security & Privacy",
      keywords: ["security", "privacy", "password", "two-factor", "2fa", "authentication", "login"],
    },
    {
      id: "appearance",
      title: "Appearance",
      keywords: ["appearance", "theme", "dark", "light", "mode", "display", "ui"],
    },
    {
      id: "data",
      title: "Data Management",
      keywords: ["data", "export", "import", "download", "backup", "delete", "account"],
    },
  ], []);

  // Filter sections based on search query
  const visibleSections = useMemo(() => {
    if (!searchQuery.trim()) {
      return sections.map(s => s.id);
    }

    const query = searchQuery.toLowerCase();
    return sections
      .filter(section =>
        section.title.toLowerCase().includes(query) ||
        section.keywords.some(keyword => keyword.includes(query))
      )
      .map(s => s.id);
  }, [searchQuery, sections]);

  return (
    <div>
      {/* Export Modal */}
      <ExportDataModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Found {visibleSections.length} matching section{visibleSections.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
            <button className="w-full flex items-center px-4 py-3 text-left bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
              <User className="h-5 w-5 mr-3" />
              Profile
            </button>
            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </button>
            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
              <Lock className="h-5 w-5 mr-3" />
              Security
            </button>
            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
              <CreditCard className="h-5 w-5 mr-3" />
              Billing
            </button>
            <button className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition">
              <Globe className="h-5 w-5 mr-3" />
              Preferences
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* No Results */}
          {searchQuery && visibleSections.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No settings found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search or browse all settings below.
              </p>
              <Button
                onClick={() => setSearchQuery("")}
                variant="primary"
              >
                Clear search
              </Button>
            </div>
          )}

          {/* Profile Section */}
          {visibleSections.includes("profile") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Edit
              </button>
            </div>

            <div className="flex items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-6">
                O
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Oleg</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">oleg@budgetai.com</p>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Change photo
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Oleg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="oleg@budgetai.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue="Israel"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                  <option>ILS - Israeli Shekel</option>
                  <option>JPY - Japanese Yen</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="primary" onClick={handleSaveProfile}>
                Save Changes
              </Button>
              <Button variant="outline">
                Cancel
              </Button>
            </div>
          </div>
          )}

          {/* Notifications Section */}
          {visibleSections.includes("notifications") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Notification Preferences
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Email Notifications
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEmailNotifications(!emailNotifications);
                    handleToggleNotification("Email Notifications", !emailNotifications);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    emailNotifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      emailNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Push Notifications
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Get notifications on your device
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    pushNotifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      pushNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Budget Alerts</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Alert when approaching budget limits
                  </p>
                </div>
                <button
                  onClick={() => setBudgetAlerts(!budgetAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    budgetAlerts ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      budgetAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Goal Reminders</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reminders to stay on track with goals
                  </p>
                </div>
                <button
                  onClick={() => setGoalReminders(!goalReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    goalReminders ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      goalReminders ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Appearance Section */}
          {visibleSections.includes("appearance") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Appearance
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-4">
                  {theme === "light" && <Sun className="h-5 w-5 text-gray-400 mr-3" />}
                  {theme === "dark" && <Moon className="h-5 w-5 text-gray-400 mr-3" />}
                  {theme === "system" && <Monitor className="h-5 w-5 text-gray-400 mr-3" />}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Choose your preferred theme
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      theme === "light"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Sun className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Light
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      theme === "dark"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Moon className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Dark
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition ${
                      theme === "system"
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Monitor className="h-6 w-6 mb-2 text-gray-700 dark:text-gray-300" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      System
                    </span>
                  </button>
                </div>

                {theme === "system" && (
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Currently using: {resolvedTheme === "dark" ? "Dark" : "Light"} (based on system preference)
                  </p>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Security Section */}
          {visibleSections.includes("security") && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security
                    </p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Enable
                </button>
              </div>
            </div>
          </div>
          )}

          {/* Data Management Section */}
          {visibleSections.includes("data") && (
          <DataManagement />
          )}

          {/* Danger Zone */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 dark:text-red-400 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-red-700 dark:text-red-400 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
