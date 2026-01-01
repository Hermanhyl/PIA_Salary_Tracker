"use client";

import { useState } from "react";
import { MonthlyRecord } from "@/lib/types";
import { formatCurrency, getGermanMonth } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";
import { getMonthName } from "@/lib/translations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Edit, Trash2 } from "lucide-react";

interface MonthlyDataTableProps {
  records: MonthlyRecord[];
  onEdit: (record: MonthlyRecord) => void;
  onDelete: (recordId: string) => void;
}

export function MonthlyDataTable({
  records,
  onEdit,
  onDelete,
}: MonthlyDataTableProps) {
  const { language, t } = useLanguage();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MonthlyRecord | null>(
    null
  );

  const handleDeleteClick = (record: MonthlyRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (recordToDelete) {
      onDelete(recordToDelete.id);
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.monthLabel}</TableHead>
              <TableHead className="text-right">{t.alg1Income}</TableHead>
              <TableHead className="text-right">{t.piaIncome}</TableHead>
              <TableHead className="text-right">{t.grossSalary}</TableHead>
              <TableHead className="text-right">{t.incomeTax}</TableHead>
              <TableHead className="text-right">{t.pensionIns}</TableHead>
              <TableHead className="text-right">{t.healthCare}</TableHead>
              <TableHead className="text-right">{t.unemploymentIns}</TableHead>
              <TableHead className="text-right">{t.totalDeductionsLabel}</TableHead>
              <TableHead className="text-right">{t.netIncome}</TableHead>
              <TableHead className="text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">
                  {getMonthName(record.month - 1, language)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.alg1_income || 0))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.pia_income || 0))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.gross_salary))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.income_tax))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.pension_insurance))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.health_insurance))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(Number(record.unemployment_insurance))}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(Number(record.total_deductions))}
                </TableCell>
                <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(Number(record.net_income))}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(record)}
                      title="Bearbeiten"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(record)}
                      title="Löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteEntry}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteConfirm}{" "}
              {recordToDelete &&
                `${getMonthName(recordToDelete.month - 1, language)} ${recordToDelete.year}`}{" "}
              {t.deleteWarning}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {t.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
