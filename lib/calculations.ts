// Salary calculation utilities

import { DeductionCalculation, UserSettings } from "./types";

/**
 * Calculate automatic deductions based on user settings
 * @param grossSalary - The gross salary amount
 * @param incomeTax - Manual income tax (must be entered manually as it varies by tax class)
 * @param settings - User settings with deduction rates
 * @returns Calculated deductions and net income
 */
export function calculateDeductions(
  grossSalary: number,
  incomeTax: number,
  settings: UserSettings
): DeductionCalculation {
  // Calculate insurance deductions based on rates
  const pension_insurance = grossSalary * settings.pension_rate;
  const health_insurance = grossSalary * settings.health_care_rate;
  const unemployment_insurance = grossSalary * settings.unemployment_rate;

  // Total deductions include all insurances plus income tax
  const total_deductions =
    incomeTax +
    pension_insurance +
    health_insurance +
    unemployment_insurance;

  // Net income is gross minus all deductions
  const net_income = grossSalary - total_deductions;

  return {
    pension_insurance: roundToTwoDecimals(pension_insurance),
    health_insurance: roundToTwoDecimals(health_insurance),
    unemployment_insurance: roundToTwoDecimals(unemployment_insurance),
    total_deductions: roundToTwoDecimals(total_deductions),
    net_income: roundToTwoDecimals(net_income),
  };
}

/**
 * Calculate total deductions and net income from manual entries
 * @param grossSalary - The gross salary amount
 * @param incomeTax - Income tax amount
 * @param pensionInsurance - Pension insurance amount
 * @param healthInsurance - Health/care insurance amount
 * @param unemploymentInsurance - Unemployment insurance amount
 * @returns Calculated totals
 */
export function calculateManualTotals(
  grossSalary: number,
  incomeTax: number,
  pensionInsurance: number,
  healthInsurance: number,
  unemploymentInsurance: number
): Pick<DeductionCalculation, "total_deductions" | "net_income"> {
  const total_deductions =
    incomeTax +
    pensionInsurance +
    healthInsurance +
    unemploymentInsurance;

  const net_income = grossSalary - total_deductions;

  return {
    total_deductions: roundToTwoDecimals(total_deductions),
    net_income: roundToTwoDecimals(net_income),
  };
}

/**
 * Round number to 2 decimal places (for currency)
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Convert percentage to decimal rate (e.g., 9.3% -> 0.093)
 */
export function percentageToRate(percentage: number): number {
  return percentage / 100;
}

/**
 * Convert decimal rate to percentage (e.g., 0.093 -> 9.3%)
 */
export function rateToPercentage(rate: number): number {
  return rate * 100;
}
