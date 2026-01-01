// Local JSON file storage utilities

import { MonthlyRecord, UserSettings } from "../types";

export interface AppData {
  version: string;
  lastModified: string;
  settings: Omit<UserSettings, "user_id" | "created_at" | "updated_at">;
  records: MonthlyRecord[];
}

// Default settings for new data
export const DEFAULT_SETTINGS: AppData["settings"] = {
  auto_calculate_deductions: true,
  pension_rate: 0.093, // 9.3%
  health_care_rate: 0.09, // 9.0%
  unemployment_rate: 0.013, // 1.3%
};

// Create empty data structure
export function getEmptyData(): AppData {
  return {
    version: "1.0",
    lastModified: new Date().toISOString(),
    settings: { ...DEFAULT_SETTINGS },
    records: [],
  };
}

// Generate unique ID for records
export function generateId(): string {
  return crypto.randomUUID();
}

// Export data to JSON file (with file picker)
export async function exportData(data: AppData): Promise<boolean> {
  try {
    const dataToSave: AppData = {
      ...data,
      lastModified: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Try modern File System Access API first (Chrome, Edge)
    if ("showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: `pia-salary-data-${new Date().toISOString().split("T")[0]}.json`,
          types: [
            {
              description: "JSON Files",
              accept: { "application/json": [".json"] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      } catch (err: any) {
        // User cancelled the picker
        if (err.name === "AbortError") {
          return false;
        }
        throw err;
      }
    }

    // Fallback for Firefox and other browsers
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pia-salary-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Error exporting data:", error);
    return false;
  }
}

// Import data from JSON file
export function importData(): Promise<AppData | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }

      try {
        const text = await file.text();
        const data = JSON.parse(text) as AppData;

        // Validate the data structure
        if (!validateAppData(data)) {
          console.error("Invalid data format");
          resolve(null);
          return;
        }

        resolve(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        resolve(null);
      }
    };

    input.oncancel = () => {
      resolve(null);
    };

    input.click();
  });
}

// Validate imported data structure
function validateAppData(data: any): data is AppData {
  if (!data || typeof data !== "object") return false;
  if (typeof data.version !== "string") return false;
  if (!data.settings || typeof data.settings !== "object") return false;
  if (!Array.isArray(data.records)) return false;

  // Validate settings
  const s = data.settings;
  if (typeof s.auto_calculate_deductions !== "boolean") return false;
  if (typeof s.pension_rate !== "number") return false;
  if (typeof s.health_care_rate !== "number") return false;
  if (typeof s.unemployment_rate !== "number") return false;

  // Validate records (basic check)
  for (const record of data.records) {
    if (!record.id || typeof record.month !== "number" || typeof record.year !== "number") {
      return false;
    }
  }

  return true;
}
