"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Brain } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface MobileNavProps {
  navigation: NavigationItem[];
  userName?: string;
  userEmail?: string;
  userInitial?: string;
}

export function MobileNav({ navigation, userName, userEmail, userInitial }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAnimating(true);
    } else {
      document.body.style.overflow = "unset";
      // Delay removing animation class to allow closing animation
      const timeout = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle swipe to close
  useEffect(() => {
    if (!isOpen) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchCurrentX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchCurrentX.current = e.touches[0].clientX;
      const diff = touchCurrentX.current - touchStartX.current;

      // Only allow swipe to close (swipe left)
      if (diff < 0 && sidebarRef.current) {
        const translateX = Math.max(diff, -288); // Max sidebar width
        sidebarRef.current.style.transform = `translateX(${translateX}px)`;
      }
    };

    const handleTouchEnd = () => {
      const diff = touchCurrentX.current - touchStartX.current;

      // If swiped more than 100px to the left, close the menu
      if (diff < -100) {
        setIsOpen(false);
      }

      // Reset transform
      if (sidebarRef.current) {
        sidebarRef.current.style.transform = "";
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("touchstart", handleTouchStart);
      sidebar.addEventListener("touchmove", handleTouchMove);
      sidebar.addEventListener("touchend", handleTouchEnd);

      return () => {
        sidebar.removeEventListener("touchstart", handleTouchStart);
        sidebar.removeEventListener("touchmove", handleTouchMove);
        sidebar.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isOpen]);

  // Trap focus inside sidebar when open
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = sidebarRef.current?.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Budget AI</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
            ) : (
              <Menu className="h-6 w-6 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {(isOpen || isAnimating) && (
        <div
          className={`lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        ref={sidebarRef}
        className={`lg:hidden fixed top-[57px] left-0 bottom-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-2xl z-40 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
      >
        {/* Navigation Links */}
        <nav className="px-4 py-6 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group relative flex items-center px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 animate-fade-in ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1"
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
                aria-label={`Navigate to ${item.name}`}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <item.icon
                  className={`h-5 w-5 mr-3 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <div
                className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0"
                aria-hidden="true"
              >
                {userInitial || "U"}
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userEmail}
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
    </>
  );
}
