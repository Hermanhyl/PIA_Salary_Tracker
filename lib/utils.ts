import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in German locale (EUR)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// Format date in German locale (DD.MM.YYYY)
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("de-DE").format(date);
}

// German month names
export const GERMAN_MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

// Get German month name by index (0-11)
export function getGermanMonth(monthIndex: number): string {
  return GERMAN_MONTHS[monthIndex] || "";
}

// Get month index from German month name
export function getMonthIndex(monthName: string): number {
  return GERMAN_MONTHS.indexOf(monthName);
}
