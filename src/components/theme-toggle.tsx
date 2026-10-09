"use client";

import { useEffect, useSyncExternalStore } from "react";

type ThemeChoice = "light" | "dark" | "system";

const nextTheme: Record<ThemeChoice, ThemeChoice> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const themeListeners = new Set<() => void>();

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getThemeChoice(): ThemeChoice {
  const stored = window.localStorage.getItem("quicktools-theme");
  return stored === "light" || stored === "dark" ? stored : "system";
}

function getServerThemeChoice(): ThemeChoice {
  return "system";
}

function saveThemeChoice(choice: ThemeChoice) {
  window.localStorage.setItem("quicktools-theme", choice);
  themeListeners.forEach((listener) => listener());
}

function applyTheme(choice: ThemeChoice) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = choice === "system"
    ? (prefersDark ? "dark" : "light")
    : choice;
  document.documentElement.dataset.themePreference = choice;
}

export function ThemeToggle() {
  const choice = useSyncExternalStore(subscribeToTheme, getThemeChoice, getServerThemeChoice);

  useEffect(() => {
    applyTheme(choice);
    if (choice !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => applyTheme("system");
    media.addEventListener("change", updateSystemTheme);
    return () => media.removeEventListener("change", updateSystemTheme);
  }, [choice]);

  return (
    <div className="theme-toggle">
      <button
        className="theme-toggle-trigger"
        type="button"
        aria-label={`Color theme: ${choice}. Switch to ${nextTheme[choice]} theme`}
        title={`Theme: ${choice}`}
        onClick={() => {
          const updatedChoice = nextTheme[choice];
          saveThemeChoice(updatedChoice);
          applyTheme(updatedChoice);
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {choice === "light" ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </>
          ) : choice === "dark" ? (
            <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" />
          ) : (
            <>
              <rect x="3" y="4" width="18" height="13" rx="2" />
              <path d="M8 21h8m-4-4v4" />
              <path d="M12 7v7" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
