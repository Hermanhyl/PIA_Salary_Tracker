// Excel file storage utilities using xlsx library
import * as XLSX from "xlsx";
import { MonthlyRecord, UserSettings } from "../types";

// German month names for Excel
const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember"
];

// Excel column headers matching PiA structure
const HEADERS = [
  "Monat",
  "ALG I (€)",
  "Nebeneinkommen / PiA-Vergütung (€)",
  "Bruttogesamteinkommen (€)",
  "Einkommenssteuer (€)",
  "Rentenversicherung (€)",
  "Kranken-/Pflegeversicherung (€)",
  "Arbeitslosenversicherung (€)",
  "Gesamtabzüge (€)",
  "Nettoeinkommen (€)",
  "Bemerkungen"
];

export interface ExcelData {
  records: MonthlyRecord[];
  settings: UserSettings;
  year: number;
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  auto_calculate_deductions: true,
  pension_rate: 0.093,
  health_care_rate: 0.09,
  unemployment_rate: 0.013,
};

// Generate unique ID
export function generateId(): string {
  return crypto.randomUUID();
}

// Create Excel workbook from records
export function createWorkbook(records: MonthlyRecord[], year: number): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();

  // Create data array with headers
  const data: (string | number)[][] = [HEADERS];

  // Calculate totals while adding rows
  let totalAlg1 = 0;
  let totalPia = 0;
  let totalGross = 0;
  let totalIncomeTax = 0;
  let totalPension = 0;
  let totalHealth = 0;
  let totalUnemployment = 0;
  let totalDeductions = 0;
  let totalNet = 0;
  let recordCount = 0;

  // Add rows for each month (Januar - Dezember)
  for (let month = 1; month <= 12; month++) {
    const record = records.find(r => r.month === month && r.year === year);

    if (record) {
      data.push([
        MONTH_NAMES[month - 1],
        record.alg1_income || 0,
        record.pia_income || 0,
        record.gross_salary,
        record.income_tax,
        record.pension_insurance,
        record.health_insurance,
        record.unemployment_insurance,
        record.total_deductions,
        record.net_income,
        record.notes || ""
      ]);

      // Accumulate totals
      totalAlg1 += record.alg1_income || 0;
      totalPia += record.pia_income || 0;
      totalGross += record.gross_salary || 0;
      totalIncomeTax += record.income_tax || 0;
      totalPension += record.pension_insurance || 0;
      totalHealth += record.health_insurance || 0;
      totalUnemployment += record.unemployment_insurance || 0;
      totalDeductions += record.total_deductions || 0;
      totalNet += record.net_income || 0;
      recordCount++;
    } else {
      // Empty row for month without data
      data.push([MONTH_NAMES[month - 1], "", "", "", "", "", "", "", "", "", ""]);
    }
  }

  // Add empty row as separator
  data.push(["", "", "", "", "", "", "", "", "", "", ""]);

  // Add summary section
  data.push([
    "JAHRESÜBERSICHT",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    `${recordCount} Monate erfasst`
  ]);

  // Add totals row
  data.push([
    "Gesamt " + year,
    totalAlg1,
    totalPia,
    totalGross,
    totalIncomeTax,
    totalPension,
    totalHealth,
    totalUnemployment,
    totalDeductions,
    totalNet,
    ""
  ]);

  // Add average row (if there are records)
  if (recordCount > 0) {
    data.push([
      "Durchschnitt/Monat",
      Math.round((totalAlg1 / recordCount) * 100) / 100,
      Math.round((totalPia / recordCount) * 100) / 100,
      Math.round((totalGross / recordCount) * 100) / 100,
      Math.round((totalIncomeTax / recordCount) * 100) / 100,
      Math.round((totalPension / recordCount) * 100) / 100,
      Math.round((totalHealth / recordCount) * 100) / 100,
      Math.round((totalUnemployment / recordCount) * 100) / 100,
      Math.round((totalDeductions / recordCount) * 100) / 100,
      Math.round((totalNet / recordCount) * 100) / 100,
      ""
    ]);
  }

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  worksheet["!cols"] = [
    { wch: 18 },  // Monat (wider for summary labels)
    { wch: 12 },  // ALG I
    { wch: 30 },  // PiA-Vergütung
    { wch: 22 },  // Bruttogesamteinkommen
    { wch: 18 },  // Einkommenssteuer
    { wch: 20 },  // Rentenversicherung
    { wch: 25 },  // Kranken-/Pflegeversicherung
    { wch: 22 },  // Arbeitslosenversicherung
    { wch: 16 },  // Gesamtabzüge
    { wch: 16 },  // Nettoeinkommen
    { wch: 40 },  // Bemerkungen
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, `${year}`);

  return workbook;
}

// Export to Excel file (browser download)
export function exportToExcel(records: MonthlyRecord[], year: number, filename?: string): void {
  const workbook = createWorkbook(records, year);
  const defaultFilename = filename || `PiA_Abrechnung_${year}.xlsx`;
  XLSX.writeFile(workbook, defaultFilename);
}

// Save to specific path (for auto-save feature)
export async function saveToPath(records: MonthlyRecord[], year: number, filePath: string): Promise<boolean> {
  try {
    const workbook = createWorkbook(records, year);

    // Use File System Access API if available
    if ("showSaveFilePicker" in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filePath.split(/[\\/]/).pop() || `PiA_Abrechnung_${year}.xlsx`,
        types: [
          {
            description: "Excel Files",
            accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      await writable.write(buffer);
      await writable.close();
      return true;
    } else {
      // Fallback: download file
      XLSX.writeFile(workbook, `PiA_Abrechnung_${year}.xlsx`);
      return true;
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return false; // User cancelled
    }
    console.error("Error saving Excel:", error);
    return false;
  }
}

// Store the file handle for saving back to the same file
let currentFileHandle: FileSystemFileHandle | null = null;

// Get the current file handle (for checking if a file is loaded)
export function getCurrentFileHandle(): FileSystemFileHandle | null {
  return currentFileHandle;
}

// Clear the current file handle
export function clearFileHandle(): void {
  currentFileHandle = null;
}

// Import from Excel file using File System Access API
export async function importFromExcel(): Promise<{ records: MonthlyRecord[]; year: number; fileName: string } | null> {
  try {
    // Try to use File System Access API first (allows saving back to same file)
    if ("showOpenFilePicker" in window) {
      const [handle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: "Excel Files",
            accept: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
              "application/vnd.ms-excel": [".xls"]
            },
          },
        ],
        multiple: false,
      });

      // Store the handle for later saving
      currentFileHandle = handle;

      const file = await handle.getFile();
      const result = await parseExcelFile(file);
      if (result) {
        return { ...result, fileName: file.name };
      }
      return null;
    } else {
      // Fallback for browsers without File System Access API
      return new Promise((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx,.xls";

        input.onchange = async (event) => {
          const file = (event.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          currentFileHandle = null; // Can't save back without File System Access API
          const result = await parseExcelFile(file);
          if (result) {
            resolve({ ...result, fileName: file.name });
          } else {
            resolve(null);
          }
        };

        input.oncancel = () => {
          resolve(null);
        };

        input.click();
      });
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return null; // User cancelled
    }
    console.error("Error opening Excel file:", error);
    return null;
  }
}

// Parse Excel file contents
async function parseExcelFile(file: File): Promise<{ records: MonthlyRecord[]; year: number } | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: "" });

    // Try to determine year from sheet name or filename
    let year = new Date().getFullYear();
    const yearMatch = sheetName.match(/\d{4}/) || file.name.match(/\d{4}/);
    if (yearMatch) {
      year = parseInt(yearMatch[0], 10);
    }

    // Parse records from rows (skip header row)
    const records: MonthlyRecord[] = [];

    for (let i = 1; i < data.length && i <= 12; i++) {
      const row = data[i] as any[];
      if (!row || row.length === 0) continue;

      // Check if row has any numeric data
      const alg1 = parseFloat(row[1]) || 0;
      const pia = parseFloat(row[2]) || 0;
      const gross = parseFloat(row[3]) || 0;

      // Only create record if there's actual data
      if (alg1 > 0 || pia > 0 || gross > 0) {
        const now = new Date().toISOString();
        records.push({
          id: generateId(),
          month: i, // January = 1, etc.
          year,
          alg1_income: alg1,
          pia_income: pia,
          gross_salary: gross || (alg1 + pia),
          income_tax: parseFloat(row[4]) || 0,
          pension_insurance: parseFloat(row[5]) || 0,
          health_insurance: parseFloat(row[6]) || 0,
          unemployment_insurance: parseFloat(row[7]) || 0,
          total_deductions: parseFloat(row[8]) || 0,
          net_income: parseFloat(row[9]) || 0,
          notes: row[10]?.toString() || null,
          created_at: now,
          updated_at: now,
        });
      }
    }

    return { records, year };
  } catch (error) {
    console.error("Error parsing Excel:", error);
    return null;
  }
}

// Save to the currently loaded file (or prompt for new location)
export async function saveToCurrentFile(records: MonthlyRecord[], year: number): Promise<boolean> {
  try {
    const workbook = createWorkbook(records, year);
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    if (currentFileHandle) {
      // Save to the same file that was loaded
      const writable = await currentFileHandle.createWritable();
      await writable.write(buffer);
      await writable.close();
      return true;
    } else if ("showSaveFilePicker" in window) {
      // No file loaded, prompt user to choose save location
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `PiA_Abrechnung_${year}.xlsx`,
        types: [
          {
            description: "Excel Files",
            accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] },
          },
        ],
      });

      // Store the handle for future saves
      currentFileHandle = handle;

      const writable = await handle.createWritable();
      await writable.write(buffer);
      await writable.close();
      return true;
    } else {
      // Fallback: download file
      XLSX.writeFile(workbook, `PiA_Abrechnung_${year}.xlsx`);
      return true;
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      return false; // User cancelled
    }
    console.error("Error saving Excel:", error);
    return false;
  }
}

// Quick save (download immediately)
export function quickSave(records: MonthlyRecord[], year: number): void {
  exportToExcel(records, year);
}
