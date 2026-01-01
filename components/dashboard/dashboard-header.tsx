"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Languages, Save, FolderOpen, FilePlus, Moon, Sun } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useData } from "@/lib/data-context";

export function DashboardHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { hasUnsavedChanges, saveToFile, loadFromFile, newFile, currentFileName, hasFileHandle } = useData();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      setIsDarkMode(stored === "true");
    } else {
      // Check system preference
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleLanguage = () => {
    setLanguage(language === "de" ? "en" : "de");
  };

  const handleSave = async () => {
    await saveToFile();
  };

  const handleLoad = async () => {
    await loadFromFile();
  };

  const handleNew = () => {
    if (hasUnsavedChanges) {
      const confirmNew = window.confirm(
        language === "de"
          ? "Es gibt ungespeicherte Änderungen. Möchten Sie wirklich eine neue Datei erstellen?"
          : "There are unsaved changes. Do you really want to create a new file?"
      );
      if (!confirmNew) return;
    }
    newFile();
  };

  return (
    <header className="border-b bg-white dark:bg-gray-800 w-full shadow-sm">
      <div className="w-full mx-auto max-w-[1400px]">
        <div className="flex h-16 items-center justify-between px-10 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link href="/">
              <h1 className="text-lg md:text-xl font-bold">{t.appTitle}</h1>
            </Link>
            {currentFileName && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full max-w-[200px] truncate" title={currentFileName}>
                {currentFileName}
              </span>
            )}
            {hasUnsavedChanges && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                {language === "de" ? "Ungespeichert" : "Unsaved"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* New File Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNew}
              className="gap-1.5"
              title={language === "de" ? "Neue Datei" : "New File"}
            >
              <FilePlus className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">
                {language === "de" ? "Neu" : "New"}
              </span>
            </Button>

            {/* Load Excel Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoad}
              className="gap-1.5"
              title={language === "de" ? "Excel laden" : "Load Excel"}
            >
              <FolderOpen className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">
                {language === "de" ? "Laden" : "Load"}
              </span>
            </Button>

            {/* Save to Excel Button */}
            <Button
              variant={hasUnsavedChanges ? "default" : "outline"}
              size="sm"
              onClick={handleSave}
              className="gap-1.5"
              title={language === "de" ? (hasFileHandle ? "Speichern" : "Speichern unter...") : (hasFileHandle ? "Save" : "Save As...")}
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">
                {language === "de" ? "Speichern" : "Save"}
              </span>
            </Button>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="gap-1.5"
              title={
                language === "de" ? "Switch to English" : "Zu Deutsch wechseln"
              }
            >
              <Languages className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              title={
                language === "de"
                  ? (isDarkMode ? "Heller Modus" : "Dunkler Modus")
                  : (isDarkMode ? "Light Mode" : "Dark Mode")
              }
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Link href="/settings">
              <Button variant="ghost" size="icon" title={t.settings}>
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
