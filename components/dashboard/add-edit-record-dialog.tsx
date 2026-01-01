"use client";

import { useState, useEffect, useMemo } from "react";
import { MonthlyRecord } from "@/lib/types";
import { calculateDeductions, calculateManualTotals } from "@/lib/calculations";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { useData } from "@/lib/data-context";
import { getMonthName, monthTranslations } from "@/lib/translations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";

interface AddEditRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: MonthlyRecord | null;
  year: number;
  onClose: () => void;
}

export function AddEditRecordDialog({
  open,
  onOpenChange,
  record,
  year,
  onClose,
}: AddEditRecordDialogProps) {
  const { language, t } = useLanguage();
  const { settings, addRecord, updateRecord, records } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [pendingMonth, setPendingMonth] = useState<number | null>(null);

  // Form fields
  const [month, setMonth] = useState<number>(1);

  // Check if selected month already has an entry
  const existingRecordForMonth = useMemo(() => {
    if (record) return null; // Don't check when editing
    return records.find((r) => r.month === month && r.year === year);
  }, [records, month, year, record]);

  // Get list of months that already have entries
  const monthsWithEntries = useMemo(() => {
    return records
      .filter((r) => r.year === year)
      .map((r) => r.month);
  }, [records, year]);
  const [alg1Income, setAlg1Income] = useState("");
  const [piaIncome, setPiaIncome] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [incomeTax, setIncomeTax] = useState("");
  const [pensionInsurance, setPensionInsurance] = useState("");
  const [healthInsurance, setHealthInsurance] = useState("");
  const [unemploymentInsurance, setUnemploymentInsurance] = useState("");
  const [notes, setNotes] = useState("");
  const [autoCalculate, setAutoCalculate] = useState(
    settings?.auto_calculate_deductions ?? true
  );

  // Initialize form when record changes
  useEffect(() => {
    if (record) {
      // Editing existing record
      setMonth(record.month);
      setAlg1Income(record.alg1_income?.toString() || "0");
      setPiaIncome(record.pia_income?.toString() || "0");
      setGrossSalary(record.gross_salary.toString());
      setIncomeTax(record.income_tax.toString());
      setPensionInsurance(record.pension_insurance.toString());
      setHealthInsurance(record.health_insurance.toString());
      setUnemploymentInsurance(record.unemployment_insurance.toString());
      setNotes(record.notes || "");
    } else {
      // New record - reset form
      setMonth(1);
      setAlg1Income("");
      setPiaIncome("");
      setGrossSalary("");
      setIncomeTax("");
      setPensionInsurance("");
      setHealthInsurance("");
      setUnemploymentInsurance("");
      setNotes("");
      setAutoCalculate(settings?.auto_calculate_deductions ?? true);
    }
    setError(null);
  }, [record, settings]);

  // Auto-calculate gross salary from ALG I + PiA income
  useEffect(() => {
    const alg1 = parseFloat(alg1Income) || 0;
    const pia = parseFloat(piaIncome) || 0;
    const calculatedGross = alg1 + pia;
    if (calculatedGross > 0) {
      setGrossSalary(calculatedGross.toString());
    }
  }, [alg1Income, piaIncome]);

  // Auto-calculate deductions when gross salary or income tax changes
  useEffect(() => {
    if (autoCalculate && grossSalary) {
      const gross = parseFloat(grossSalary) || 0;
      const tax = parseFloat(incomeTax) || 0;

      // Use settings from context or default German rates
      const effectiveSettings = settings || {
        pension_rate: 0.093, // 9.3% (German employee share)
        health_care_rate: 0.09, // 9.0% (Health 7.3% + Care 1.7%)
        unemployment_rate: 0.013, // 1.3% (German employee share)
        auto_calculate_deductions: true,
      };

      const calculated = calculateDeductions(gross, tax, effectiveSettings);

      setPensionInsurance(calculated.pension_insurance.toString());
      setHealthInsurance(calculated.health_insurance.toString());
      setUnemploymentInsurance(calculated.unemployment_insurance.toString());
    }
  }, [autoCalculate, grossSalary, incomeTax, settings]);

  // Calculate totals for preview
  const calculatePreview = () => {
    const gross = parseFloat(grossSalary) || 0;
    const tax = parseFloat(incomeTax) || 0;
    const pension = parseFloat(pensionInsurance) || 0;
    const health = parseFloat(healthInsurance) || 0;
    const unemployment = parseFloat(unemploymentInsurance) || 0;

    const { total_deductions, net_income } = calculateManualTotals(
      gross,
      tax,
      pension,
      health,
      unemployment
    );

    return { total_deductions, net_income };
  };

  const preview = calculatePreview();

  // Handle month selection - show warning if month already has entry
  const handleMonthChange = (value: string) => {
    const newMonth = Number(value);
    const existingEntry = records.find((r) => r.month === newMonth && r.year === year);

    if (existingEntry && !record) {
      // Month already has an entry - ask for confirmation
      setPendingMonth(newMonth);
      setShowOverwriteConfirm(true);
    } else {
      setMonth(newMonth);
    }
  };

  // Confirm overwrite - switch to edit mode for existing record
  const handleConfirmOverwrite = () => {
    if (pendingMonth !== null) {
      setMonth(pendingMonth);
      // Load the existing record data into the form
      const existingEntry = records.find((r) => r.month === pendingMonth && r.year === year);
      if (existingEntry) {
        setAlg1Income(existingEntry.alg1_income?.toString() || "0");
        setPiaIncome(existingEntry.pia_income?.toString() || "0");
        setGrossSalary(existingEntry.gross_salary.toString());
        setIncomeTax(existingEntry.income_tax.toString());
        setPensionInsurance(existingEntry.pension_insurance.toString());
        setHealthInsurance(existingEntry.health_insurance.toString());
        setUnemploymentInsurance(existingEntry.unemployment_insurance.toString());
        setNotes(existingEntry.notes || "");
      }
    }
    setShowOverwriteConfirm(false);
    setPendingMonth(null);
  };

  // Cancel overwrite - keep previous month selection
  const handleCancelOverwrite = () => {
    setShowOverwriteConfirm(false);
    setPendingMonth(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const alg1 = parseFloat(alg1Income) || 0;
      const pia = parseFloat(piaIncome) || 0;
      const gross = parseFloat(grossSalary);
      const tax = parseFloat(incomeTax);
      const pension = parseFloat(pensionInsurance);
      const health = parseFloat(healthInsurance);
      const unemployment = parseFloat(unemploymentInsurance);

      if (
        isNaN(gross) ||
        isNaN(tax) ||
        isNaN(pension) ||
        isNaN(health) ||
        isNaN(unemployment)
      ) {
        setError(t.invalidNumbers);
        setLoading(false);
        return;
      }

      // Check for duplicate month/year - if exists, we'll update instead of add
      const existingRecordToUpdate = !record
        ? records.find((r) => r.month === month && r.year === year)
        : null;

      const { total_deductions, net_income } = calculateManualTotals(
        gross,
        tax,
        pension,
        health,
        unemployment
      );

      const recordData = {
        month,
        year,
        alg1_income: alg1,
        pia_income: pia,
        gross_salary: gross,
        income_tax: tax,
        pension_insurance: pension,
        health_insurance: health,
        unemployment_insurance: unemployment,
        total_deductions,
        net_income,
        notes: notes.trim() || null,
      };

      if (record) {
        // Update existing record (editing mode)
        updateRecord(record.id, recordData);
      } else if (existingRecordToUpdate) {
        // Update existing record for this month (overwrite mode)
        updateRecord(existingRecordToUpdate.id, recordData);
      } else {
        // Add new record
        addRecord(recordData);
      }

      onClose();
    } catch (err: any) {
      console.error("Error saving record:", err);
      setError(err.message || t.errorSaving);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle>{record ? t.editRecord : t.addRecord}</DialogTitle>
          <DialogDescription>
            {record
              ? `${t.editRecordFor} ${getMonthName(record.month - 1, language)} ${record.year}`
              : `${t.addRecordFor} ${year} ${t.hinzu}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:border-red-900/50">
                {error}
              </div>
            )}

            {/* Month Selector */}
            <div className="space-y-2">
              <Label htmlFor="month">{t.monthLabel}</Label>
              <Select
                value={month.toString()}
                onValueChange={handleMonthChange}
                disabled={!!record} // Can't change month when editing
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthTranslations[language].map((monthName, index) => {
                    const monthNum = index + 1;
                    const hasEntry = monthsWithEntries.includes(monthNum);
                    return (
                      <SelectItem
                        key={monthNum}
                        value={monthNum.toString()}
                        className={hasEntry ? "text-amber-600 dark:text-amber-400" : ""}
                      >
                        {monthName} {hasEntry && "●"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {!record && (
                <p className="text-xs text-muted-foreground">
                  {language === "de"
                    ? "● = Eintrag vorhanden"
                    : "● = Entry exists"}
                </p>
              )}
            </div>

            {/* Warning for existing entry */}
            {existingRecordForMonth && !record && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    {language === "de"
                      ? `Eintrag für ${getMonthName(month - 1, language)} existiert bereits`
                      : `Entry for ${getMonthName(month - 1, language)} already exists`}
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    {language === "de"
                      ? "Wenn Sie speichern, wird der bestehende Eintrag aktualisiert."
                      : "If you save, the existing entry will be updated."}
                  </p>
                </div>
              </div>
            )}

            {/* Auto-calculate toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-calculate"
                checked={autoCalculate}
                onCheckedChange={setAutoCalculate}
              />
              <Label htmlFor="auto-calculate">{t.autoCalculate}</Label>
            </div>

            {/* ALG I and PiA Income */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="alg1-income">{t.alg1IncomeLabel}</Label>
                <Input
                  id="alg1-income"
                  type="number"
                  step="0.01"
                  min="0"
                  value={alg1Income}
                  onChange={(e) => setAlg1Income(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">{t.alg1IncomeNote}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pia-income">{t.piaIncomeLabel}</Label>
                <Input
                  id="pia-income"
                  type="number"
                  step="0.01"
                  min="0"
                  value={piaIncome}
                  onChange={(e) => setPiaIncome(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-xs text-muted-foreground">{t.piaIncomeNote}</p>
              </div>
            </div>

            {/* Gross Salary (calculated) */}
            <div className="space-y-2">
              <Label htmlFor="gross-salary">{t.grossSalaryLabel} *</Label>
              <Input
                id="gross-salary"
                type="number"
                step="0.01"
                min="0"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                required
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">{t.grossSalaryNote}</p>
            </div>

            {/* Income Tax */}
            <div className="space-y-2">
              <Label htmlFor="income-tax">{t.incomeTaxLabel} *</Label>
              <Input
                id="income-tax"
                type="number"
                step="0.01"
                min="0"
                value={incomeTax}
                onChange={(e) => setIncomeTax(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">{t.incomeTaxNote}</p>
            </div>

            {/* Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="pension">{t.pensionInsurance} *</Label>
                <Input
                  id="pension"
                  type="number"
                  step="0.01"
                  min="0"
                  value={pensionInsurance}
                  onChange={(e) => setPensionInsurance(e.target.value)}
                  disabled={autoCalculate}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="health">{t.healthCareIns} *</Label>
                <Input
                  id="health"
                  type="number"
                  step="0.01"
                  min="0"
                  value={healthInsurance}
                  onChange={(e) => setHealthInsurance(e.target.value)}
                  disabled={autoCalculate}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unemployment">{t.unemploymentInsurance} *</Label>
                <Input
                  id="unemployment"
                  type="number"
                  step="0.01"
                  min="0"
                  value={unemploymentInsurance}
                  onChange={(e) => setUnemploymentInsurance(e.target.value)}
                  disabled={autoCalculate}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t.notes}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={t.notesPlaceholder}
              />
            </div>

            {/* Preview */}
            <div className="bg-muted p-5 rounded-lg space-y-3 border border-border">
              <h4 className="font-semibold text-sm">{t.preview}</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {t.totalDeductionsLabel}:
                  </span>
                </div>
                <div className="text-right font-medium">
                  {formatCurrency(preview.total_deductions)}
                </div>
                <div>
                  <span className="text-muted-foreground">{t.netIncome}:</span>
                </div>
                <div className="text-right font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(preview.net_income)}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t.saving : t.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Overwrite Confirmation Dialog */}
      <AlertDialog open={showOverwriteConfirm} onOpenChange={setShowOverwriteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              {language === "de" ? "Eintrag existiert bereits" : "Entry Already Exists"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "de"
                ? `Für ${pendingMonth ? getMonthName(pendingMonth - 1, language) : ""} ${year} existiert bereits ein Eintrag. Möchten Sie den bestehenden Eintrag bearbeiten und aktualisieren?`
                : `An entry for ${pendingMonth ? getMonthName(pendingMonth - 1, language) : ""} ${year} already exists. Would you like to edit and update the existing entry?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelOverwrite}>
              {language === "de" ? "Anderen Monat wählen" : "Choose Different Month"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOverwrite}>
              {language === "de" ? "Eintrag bearbeiten" : "Edit Entry"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
