/**
 * Accessibility announcer for screen readers
 * Provides live region updates for dynamic content changes
 */

"use client";

import { useEffect, useState } from "react";

let announceQueue: string[] = [];
let announceCallback: ((message: string) => void) | null = null;

/**
 * Announce a message to screen readers
 * @param message - The message to announce
 * @param priority - "polite" (default) or "assertive" for urgent announcements
 */
export function announce(message: string, priority: "polite" | "assertive" = "polite") {
  if (announceCallback) {
    announceCallback(message);
  } else {
    announceQueue.push(message);
  }
}

export function AccessibilityAnnouncer() {
  const [announcement, setAnnouncement] = useState("");
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");

  useEffect(() => {
    // Set up the callback
    announceCallback = (message: string) => {
      setAnnouncement(message);
      // Clear after a short delay to allow for new announcements
      setTimeout(() => setAnnouncement(""), 500);
    };

    // Process any queued messages
    announceQueue.forEach((message) => announceCallback?.(message));
    announceQueue = [];

    return () => {
      announceCallback = null;
    };
  }, []);

  return (
    <>
      {/* Polite announcements (won't interrupt current speech) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {priority === "polite" && announcement}
      </div>

      {/* Assertive announcements (will interrupt) */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {priority === "assertive" && announcement}
      </div>
    </>
  );
}
