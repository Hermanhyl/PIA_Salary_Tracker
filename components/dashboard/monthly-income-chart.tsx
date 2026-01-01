"use client";

import { MonthlyRecord } from "@/lib/types";
import { getGermanMonth } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyIncomeChartProps {
  records: MonthlyRecord[];
}

export function MonthlyIncomeChart({ records }: MonthlyIncomeChartProps) {
  // Transform data for chart
  const chartData = records.map((record) => ({
    month: getGermanMonth(record.month - 1).substring(0, 3), // Short month name
    nettoeinkommen: Number(record.net_income),
    bruttogehalt: Number(record.gross_salary),
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-lg space-y-1.5">
          <p className="font-medium text-sm">{payload[0].payload.month}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Netto: €{payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Brutto: €{payload[1].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="nettoeinkommen"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          name="Nettoeinkommen"
        />
        <Line
          type="monotone"
          dataKey="bruttogehalt"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          name="Bruttogehalt"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
