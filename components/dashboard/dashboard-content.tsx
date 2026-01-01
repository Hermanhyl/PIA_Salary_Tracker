"use client";

import { useState } from "react";
import { MonthlyRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useData } from "@/lib/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Download, Languages } from "lucide-react";
import { MonthlyDataTable } from "./monthly-data-table";
import { AddEditRecordDialog } from "./add-edit-record-dialog";
import { MonthlyIncomeChart } from "./monthly-income-chart";
import { useLanguage } from "@/lib/language-context";

export function DashboardContent() {
  const { language, setLanguage, t } = useLanguage();
  const { getRecordsByYear, deleteRecord, settings } = useData();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MonthlyRecord | null>(null);

  // Get records for selected year
  const records = getRecordsByYear(selectedYear);

  // Generate year options (current year ± 5 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Calculate summary statistics
  const summary = records.reduce(
    (acc, record) => ({
      totalGross: acc.totalGross + Number(record.gross_salary),
      totalDeductions: acc.totalDeductions + Number(record.total_deductions),
      totalNet: acc.totalNet + Number(record.net_income),
    }),
    { totalGross: 0, totalDeductions: 0, totalNet: 0 }
  );

  const handleAddRecord = () => {
    setEditingRecord(null);
    setIsDialogOpen(true);
  };

  const handleEditRecord = (record: MonthlyRecord) => {
    setEditingRecord(record);
    setIsDialogOpen(true);
  };

  const handleDeleteRecord = async (recordId: string) => {
    deleteRecord(recordId);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRecord(null);
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;

    // CSV header
    const headers = [
      "Monat",
      "Jahr",
      "Bruttogehalt",
      "Einkommenssteuer",
      "Rentenversicherung",
      "Kranken-/Pflegeversicherung",
      "Arbeitslosenversicherung",
      "Gesamtabzüge",
      "Nettoeinkommen",
      "Notizen",
    ];

    // CSV rows
    const rows = records.map((record) => [
      record.month,
      record.year,
      record.gross_salary,
      record.income_tax,
      record.pension_insurance,
      record.health_insurance,
      record.unemployment_insurance,
      record.total_deductions,
      record.net_income,
      record.notes || "",
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pia-verguetung-${selectedYear}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 w-full px-0">
      {/* Language Switcher - Professional & Clean */}
      <Card className="border border-border shadow-sm">
        <CardContent className="py-4 px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="text-sm font-medium">Language / Sprache</h3>
                <p className="text-xs text-muted-foreground">
                  {language === "de"
                    ? "Switch to English for easier reading"
                    : "Zu Deutsch wechseln"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={language === "de" ? "default" : "outline"}
                onClick={() => setLanguage("de")}
                className="min-w-[90px]"
              >
                DE
              </Button>
              <Button
                size="sm"
                variant={language === "en" ? "default" : "outline"}
                onClick={() => setLanguage("en")}
                className="min-w-[90px]"
              >
                EN
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header with year selector and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{t.dashboard}</h2>
          <Select
            value={selectedYear.toString()}
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={records.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            {t.csvExport}
          </Button>
          <Button size="sm" onClick={handleAddRecord}>
            <Plus className="h-4 w-4 mr-2" />
            {t.addEntry}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.totalGross}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalGross)}
            </div>
            <p className="text-xs text-muted-foreground">
              {records.length} {records.length === 1 ? t.month : t.months}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t.totalDeductions}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalDeductions)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalGross > 0
                ? `${((summary.totalDeductions / summary.totalGross) * 100).toFixed(1)}% ${t.ofGross}`
                : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.totalNet}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalNet)}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.totalGross > 0
                ? `${((summary.totalNet / summary.totalGross) * 100).toFixed(1)}% ${t.ofGross}`
                : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t.monthlyIncomeTrend}</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyIncomeChart records={records} />
          </CardContent>
        </Card>
      )}

      {/* Monthly Data Table */}
      {records.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t.monthlyOverview}</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyDataTable
              records={records}
              onEdit={handleEditRecord}
              onDelete={handleDeleteRecord}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {t.noEntries} {selectedYear}
            </p>
            <Button onClick={handleAddRecord}>
              <Plus className="h-4 w-4 mr-2" />
              {t.addFirstEntry}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <AddEditRecordDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        record={editingRecord}
        year={selectedYear}
        onClose={handleDialogClose}
      />
    </div>
  );
}
