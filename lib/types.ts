// Data types for local storage

export interface MonthlyRecord {
  id: string;
  month: number; // 1-12
  year: number;
  alg1_income: number; // ALG I (Arbeitslosengeld I)
  pia_income: number; // PiA-Vergütung (side income)
  gross_salary: number; // Total gross (ALG I + PiA)
  income_tax: number;
  pension_insurance: number;
  health_insurance: number;
  unemployment_insurance: number;
  total_deductions: number;
  net_income: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  auto_calculate_deductions: boolean;
  pension_rate: number; // Decimal 0.0930 = 9.3%
  health_care_rate: number; // Decimal 0.0900 = 9.0%
  unemployment_rate: number; // Decimal 0.0130 = 1.3%
}

// Form types for creating/updating records
export interface MonthlyRecordFormData {
  month: number;
  year: number;
  gross_salary: number;
  income_tax: number;
  pension_insurance: number;
  health_insurance: number;
  unemployment_insurance: number;
  notes?: string;
}

export interface UserSettingsFormData {
  auto_calculate_deductions: boolean;
  pension_rate: number;
  health_care_rate: number;
  unemployment_rate: number;
}

// Calculation helper types
export interface DeductionCalculation {
  pension_insurance: number;
  health_insurance: number;
  unemployment_insurance: number;
  total_deductions: number;
  net_income: number;
}

// Summary statistics types
export interface YearSummary {
  year: number;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  record_count: number;
}

export interface MonthData {
  month: number;
  year: number;
  net_income: number;
  monthName: string;
}
