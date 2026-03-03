/**
 * Custom hook for registering keyboard shortcuts
 * Makes it easy to add shortcuts to any component
 */

import { useEffect } from "react";

export interface KeyboardShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  enabled?: boolean;
  preventDefault?: boolean;
  ignoreInputs?: boolean;
}

export function useKeyboardShortcut(config: KeyboardShortcutConfig) {
  const {
    key,
    ctrlKey = false,
    altKey = false,
    shiftKey = false,
    metaKey = false,
    callback,
    enabled = true,
    preventDefault = true,
    ignoreInputs = true,
  } = config;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        if (
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // Check if the key combination matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatches = ctrlKey ? event.ctrlKey : !event.ctrlKey;
      const altMatches = altKey ? event.altKey : !event.altKey;
      const shiftMatches = shiftKey ? event.shiftKey : !event.shiftKey;
      const metaMatches = metaKey ? event.metaKey : !event.metaKey;

      if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, ctrlKey, altKey, shiftKey, metaKey, callback, enabled, preventDefault, ignoreInputs]);
}

/**
 * Hook for registering multiple keyboard shortcuts at once
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcutConfig[]) {
  shortcuts.forEach((shortcut) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useKeyboardShortcut(shortcut);
  });
}
