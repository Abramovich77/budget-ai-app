import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { MobileNav } from "@/components/MobileNav";
import {
  Brain,
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
    { name: "Budgets", href: "/budgets", icon: PiggyBank },
    { name: "Goals", href: "/goals", icon: Target },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      {/* Mobile Navigation */}
      <MobileNav
        navigation={navigation}
        userName={session.user?.name || undefined}
        userEmail={session.user?.email || undefined}
        userInitial={session.user?.name?.charAt(0) || undefined}
      />

      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-64 lg:flex lg:flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <Brain className="h-8 w-8 text-blue-600 mr-3" aria-hidden="true" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Budget AI</span>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label={`Navigate to ${item.name}`}
            >
              <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold"
                aria-hidden="true"
              >
                {session.user?.name?.charAt(0) || "U"}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session.user?.email}
                </p>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content - Responsive padding for mobile */}
      <main id="main-content" className="lg:ml-64 min-h-screen pt-[57px] lg:pt-0" role="main">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </div>
      </main>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />
    </div>
  );
}
