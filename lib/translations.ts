// Translation files for German and English

export type Language = 'de' | 'en';

export const translations = {
  de: {
    // Header
    appTitle: "PiA Vergütung Tracker",
    settings: "Einstellungen",
    logout: "Abmelden",

    // Dashboard
    dashboard: "Dashboard",
    addEntry: "Eintrag hinzufügen",
    csvExport: "CSV Export",

    // Summary Cards
    totalGross: "Gesamtbruttogehalt",
    totalDeductions: "Gesamtabzüge",
    totalNet: "Gesamtnettoeinkommen",
    months: "Monate",
    month: "Monat",
    ofGross: "vom Brutto",

    // Table Headers
    monthLabel: "Monat",
    alg1Income: "ALG I",
    piaIncome: "PiA-Vergütung",
    grossSalary: "Bruttogehalt",
    incomeTax: "Einkommenssteuer",
    pensionIns: "Rentenvers.",
    healthCare: "Kranken-/Pflege",
    unemploymentIns: "Arbeitslosen.",
    totalDeductionsLabel: "Gesamtabzüge",
    netIncome: "Nettoeinkommen",
    actions: "Aktionen",

    // Chart
    monthlyIncomeTrend: "Monatliche Nettoeinkommensentwicklung",
    monthlyOverview: "Monatliche Übersicht",

    // Empty State
    noEntries: "Keine Einträge für",
    addFirstEntry: "Ersten Eintrag hinzufügen",

    // Errors
    errorLoading: "Fehler beim Laden der Daten",
    errorSaving: "Fehler beim Speichern",
    errorDeleting: "Fehler beim Löschen",
    invalidNumbers: "Bitte geben Sie gültige Zahlen ein",
    entryExists: "Ein Eintrag für",
    existsAlready: "existiert bereits",

    // Add/Edit Dialog
    addRecord: "Neuer Eintrag",
    editRecord: "Eintrag bearbeiten",
    addRecordFor: "Fügen Sie einen neuen Eintrag für",
    editRecordFor: "Bearbeiten Sie den Eintrag für",
    hinzu: "hinzu",
    autoCalculate: "Abzüge automatisch berechnen",
    alg1IncomeLabel: "ALG I (€)",
    alg1IncomeNote: "Arbeitslosengeld I - monatlicher Bezug",
    piaIncomeLabel: "Nebeneinkommen / PiA-Vergütung (€)",
    piaIncomeNote: "Vergütung aus der PiA-Tätigkeit",
    grossSalaryLabel: "Bruttogesamteinkommen (€)",
    grossSalaryNote: "Wird automatisch berechnet (ALG I + PiA-Vergütung)",
    incomeTaxLabel: "Einkommenssteuer (€)",
    incomeTaxNote: "Einkommenssteuer muss manuell eingegeben werden (variiert nach Steuerklasse)",
    pensionInsurance: "Rentenversicherung (€)",
    healthCareIns: "Kranken-/Pflegevers. (€)",
    unemploymentInsurance: "Arbeitslosenvers. (€)",
    notes: "Notizen (optional)",
    notesPlaceholder: "Zusätzliche Notizen...",
    preview: "Vorschau:",
    cancel: "Abbrechen",
    save: "Speichern",
    saving: "Speichern...",

    // Delete Dialog
    deleteEntry: "Eintrag löschen?",
    deleteConfirm: "Möchten Sie den Eintrag für",
    deleteWarning: "wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    delete: "Löschen",

    // Settings Page
    settingsTitle: "Einstellungen",
    settingsSubtitle: "Konfigurieren Sie Ihre Standardabzugssätze",
    deductionCalc: "Abzugsberechnung",
    deductionDesc: "Passen Sie die Standardsätze für die automatische Berechnung der Sozialversicherungsabzüge an",
    autoCalculateLabel: "Automatische Berechnung",
    autoCalculateDesc: "Abzüge automatisch basierend auf den untenstehenden Sätzen berechnen",
    employeeContributions: "Arbeitnehmeranteil der Sozialversicherungen",
    pensionRate: "Rentenversicherung (%)",
    pensionDefault: "Standardwert: 9,30% (Arbeitnehmeranteil)",
    healthCareRate: "Kranken- und Pflegeversicherung (%)",
    healthCareDefault: "Standardwert: 9,00% (7,3% Krankenversicherung + 1,7% Pflegeversicherung, Arbeitnehmeranteil)",
    unemploymentRate: "Arbeitslosenversicherung (%)",
    unemploymentDefault: "Standardwert: 1,30% (Arbeitnehmeranteil)",
    settingsNote: "Diese Sätze entsprechen dem Arbeitnehmeranteil der Sozialversicherungen in Deutschland. Die Einkommenssteuer variiert je nach Steuerklasse und muss bei jedem Eintrag manuell eingegeben werden.",
    settingsSaved: "Einstellungen erfolgreich gespeichert!",

    // Auth
    login: "Anmelden",
    loginSubtitle: "Melden Sie sich bei Ihrem PiA Vergütung Tracker an",
    email: "E-Mail",
    password: "Passwort",
    loggingIn: "Anmelden...",
    noAccount: "Noch kein Konto?",
    register: "Registrieren",

    signup: "Registrieren",
    signupSubtitle: "Erstellen Sie ein Konto für den PiA Vergütung Tracker",
    confirmPassword: "Passwort bestätigen",
    confirmPasswordPlaceholder: "Passwort wiederholen",
    registering: "Registrierung läuft...",
    registerSuccess: "Registrierung erfolgreich! Weiterleitung...",
    alreadyHaveAccount: "Bereits ein Konto?",

    // Common
    loading: "Lädt...",

    // Months
    january: "Januar",
    february: "Februar",
    march: "März",
    april: "April",
    may: "Mai",
    june: "Juni",
    july: "Juli",
    august: "August",
    september: "September",
    october: "Oktober",
    november: "November",
    december: "Dezember",
  },

  en: {
    // Header
    appTitle: "PiA Salary Tracker",
    settings: "Settings",
    logout: "Logout",

    // Dashboard
    dashboard: "Dashboard",
    addEntry: "Add Entry",
    csvExport: "CSV Export",

    // Summary Cards
    totalGross: "Total Gross Salary",
    totalDeductions: "Total Deductions",
    totalNet: "Total Net Income",
    months: "months",
    month: "month",
    ofGross: "of gross",

    // Table Headers
    monthLabel: "Month",
    alg1Income: "ALG I",
    piaIncome: "PiA Income",
    grossSalary: "Gross Salary",
    incomeTax: "Income Tax",
    pensionIns: "Pension Ins.",
    healthCare: "Health/Care",
    unemploymentIns: "Unemployment",
    totalDeductionsLabel: "Total Deductions",
    netIncome: "Net Income",
    actions: "Actions",

    // Chart
    monthlyIncomeTrend: "Monthly Net Income Trend",
    monthlyOverview: "Monthly Overview",

    // Empty State
    noEntries: "No entries for",
    addFirstEntry: "Add first entry",

    // Errors
    errorLoading: "Error loading data",
    errorSaving: "Error saving",
    errorDeleting: "Error deleting",
    invalidNumbers: "Please enter valid numbers",
    entryExists: "An entry for",
    existsAlready: "already exists",

    // Add/Edit Dialog
    addRecord: "New Entry",
    editRecord: "Edit Entry",
    addRecordFor: "Add a new entry for",
    editRecordFor: "Edit the entry for",
    hinzu: "",
    autoCalculate: "Auto-calculate deductions",
    alg1IncomeLabel: "ALG I (€)",
    alg1IncomeNote: "Unemployment benefit I - monthly payment",
    piaIncomeLabel: "Side Income / PiA Salary (€)",
    piaIncomeNote: "Income from PiA training position",
    grossSalaryLabel: "Total Gross Income (€)",
    grossSalaryNote: "Automatically calculated (ALG I + PiA Income)",
    incomeTaxLabel: "Income Tax (€)",
    incomeTaxNote: "Income tax must be entered manually (varies by tax class)",
    pensionInsurance: "Pension Insurance (€)",
    healthCareIns: "Health/Care Insurance (€)",
    unemploymentInsurance: "Unemployment Insurance (€)",
    notes: "Notes (optional)",
    notesPlaceholder: "Additional notes...",
    preview: "Preview:",
    cancel: "Cancel",
    save: "Save",
    saving: "Saving...",

    // Delete Dialog
    deleteEntry: "Delete entry?",
    deleteConfirm: "Do you really want to delete the entry for",
    deleteWarning: "? This action cannot be undone.",
    delete: "Delete",

    // Settings Page
    settingsTitle: "Settings",
    settingsSubtitle: "Configure your default deduction rates",
    deductionCalc: "Deduction Calculation",
    deductionDesc: "Adjust the default rates for automatic social insurance deduction calculations",
    autoCalculateLabel: "Automatic Calculation",
    autoCalculateDesc: "Automatically calculate deductions based on the rates below",
    employeeContributions: "Employee Share of Social Insurance",
    pensionRate: "Pension Insurance (%)",
    pensionDefault: "Default: 9.30% (Employee share)",
    healthCareRate: "Health and Care Insurance (%)",
    healthCareDefault: "Default: 9.00% (7.3% health + 1.7% care, employee share)",
    unemploymentRate: "Unemployment Insurance (%)",
    unemploymentDefault: "Default: 1.30% (Employee share)",
    settingsNote: "These rates represent the employee share of social insurance in Germany. Income tax varies by tax class and must be entered manually for each entry.",
    settingsSaved: "Settings saved successfully!",

    // Auth
    login: "Login",
    loginSubtitle: "Sign in to your PiA Salary Tracker",
    email: "Email",
    password: "Password",
    loggingIn: "Logging in...",
    noAccount: "Don't have an account?",
    register: "Sign Up",

    signup: "Sign Up",
    signupSubtitle: "Create an account for PiA Salary Tracker",
    confirmPassword: "Confirm Password",
    confirmPasswordPlaceholder: "Repeat password",
    registering: "Registering...",
    registerSuccess: "Registration successful! Redirecting...",
    alreadyHaveAccount: "Already have an account?",

    // Common
    loading: "Loading...",

    // Months
    january: "January",
    february: "February",
    march: "March",
    april: "April",
    may: "May",
    june: "June",
    july: "July",
    august: "August",
    september: "September",
    october: "October",
    november: "November",
    december: "December",
  }
};

export const monthTranslations = {
  de: [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
};

export function getMonthName(monthIndex: number, language: Language): string {
  return monthTranslations[language][monthIndex] || "";
}
