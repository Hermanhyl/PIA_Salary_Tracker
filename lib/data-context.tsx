"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { MonthlyRecord, UserSettings } from "./types";
import {
  importFromExcel,
  saveToCurrentFile,
  getCurrentFileHandle,
  clearFileHandle,
  DEFAULT_SETTINGS,
  generateId,
} from "./storage/excel-storage";

interface DataContextType {
  // Data
  records: MonthlyRecord[];
  settings: UserSettings;
  hasUnsavedChanges: boolean;
  currentYear: number;
  currentFileName: string | null;
  hasFileHandle: boolean;

  // Record operations
  addRecord: (record: Omit<MonthlyRecord, "id" | "created_at" | "updated_at">) => void;
  updateRecord: (id: string, record: Partial<MonthlyRecord>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByYear: (year: number) => MonthlyRecord[];

  // Settings operations
  updateSettings: (settings: Partial<UserSettings>) => void;

  // File operations
  saveToFile: () => Promise<boolean>;
  loadFromFile: () => Promise<boolean>;
  newFile: () => void;
  setCurrentYear: (year: number) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [hasFileHandle, setHasFileHandle] = useState(false);

  // Record operations
  const addRecord = useCallback(
    (recordData: Omit<MonthlyRecord, "id" | "created_at" | "updated_at">) => {
      const now = new Date().toISOString();
      const newRecord: MonthlyRecord = {
        ...recordData,
        id: generateId(),
        created_at: now,
        updated_at: now,
      };

      setRecords((prev) => [...prev, newRecord]);
      setHasUnsavedChanges(true);
    },
    []
  );

  const updateRecord = useCallback((id: string, updates: Partial<MonthlyRecord>) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id
          ? { ...record, ...updates, updated_at: new Date().toISOString() }
          : record
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  const getRecordsByYear = useCallback(
    (year: number) => {
      return records
        .filter((record) => record.year === year)
        .sort((a, b) => a.month - b.month);
    },
    [records]
  );

  // Settings operations
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  // File operations - Save to Excel
  const saveToFile = useCallback(async (): Promise<boolean> => {
    const success = await saveToCurrentFile(records, currentYear);
    if (success) {
      setHasUnsavedChanges(false);
      // Update file handle status
      setHasFileHandle(getCurrentFileHandle() !== null);
    }
    return success;
  }, [records, currentYear]);

  // Load from Excel file
  const loadFromFile = useCallback(async (): Promise<boolean> => {
    const result = await importFromExcel();
    if (result) {
      // Replace all records with imported ones for the loaded year
      setRecords(result.records);
      setCurrentYear(result.year);
      setCurrentFileName(result.fileName);
      setHasFileHandle(getCurrentFileHandle() !== null);
      setHasUnsavedChanges(false);
      return true;
    }
    return false;
  }, []);

  // Start a new file (clear current data)
  const newFile = useCallback(() => {
    setRecords([]);
    setCurrentFileName(null);
    setHasFileHandle(false);
    setHasUnsavedChanges(false);
    clearFileHandle();
  }, []);

  const value: DataContextType = {
    records,
    settings,
    hasUnsavedChanges,
    currentYear,
    currentFileName,
    hasFileHandle,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecordsByYear,
    updateSettings,
    saveToFile,
    loadFromFile,
    newFile,
    setCurrentYear,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
