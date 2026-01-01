"use client";

import { useState, useEffect } from "react";
import { rateToPercentage, percentageToRate } from "@/lib/calculations";
import { useLanguage } from "@/lib/language-context";
import { useData } from "@/lib/data-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { t } = useLanguage();
  const { settings, updateSettings } = useData();

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [autoCalculate, setAutoCalculate] = useState(true);
  const [pensionRate, setPensionRate] = useState("9.30");
  const [healthCareRate, setHealthCareRate] = useState("9.00");
  const [unemploymentRate, setUnemploymentRate] = useState("1.30");

  // Load settings from context when component mounts
  useEffect(() => {
    if (settings) {
      setAutoCalculate(settings.auto_calculate_deductions);
      setPensionRate(rateToPercentage(settings.pension_rate).toFixed(2));
      setHealthCareRate(rateToPercentage(settings.health_care_rate).toFixed(2));
      setUnemploymentRate(
        rateToPercentage(settings.unemployment_rate).toFixed(2)
      );
    }
  }, [settings]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const pension = parseFloat(pensionRate);
      const health = parseFloat(healthCareRate);
      const unemployment = parseFloat(unemploymentRate);

      if (
        isNaN(pension) ||
        isNaN(health) ||
        isNaN(unemployment) ||
        pension < 0 ||
        health < 0 ||
        unemployment < 0
      ) {
        setError(t.invalidNumbers);
        setSaving(false);
        return;
      }

      updateSettings({
        auto_calculate_deductions: autoCalculate,
        pension_rate: percentageToRate(pension),
        health_care_rate: percentageToRate(health),
        unemployment_rate: percentageToRate(unemployment),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error saving settings:", err);
      setError(err.message || t.errorSaving);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{t.settingsTitle}</h1>
          <p className="text-muted-foreground mt-1">{t.settingsSubtitle}</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t.deductionCalc}</CardTitle>
          <CardDescription>{t.deductionDesc}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-8">
            {error && (
              <div className="p-4 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/10 dark:border-red-900/50">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 text-sm text-green-500 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/10 dark:border-green-900/50">
                {t.settingsSaved}
              </div>
            )}

            {/* Auto-calculate toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-calculate">{t.autoCalculateLabel}</Label>
                <p className="text-sm text-muted-foreground">
                  {t.autoCalculateDesc}
                </p>
              </div>
              <Switch
                id="auto-calculate"
                checked={autoCalculate}
                onCheckedChange={setAutoCalculate}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-5">
                {t.employeeContributions}
              </h3>

              <div className="space-y-6">
                {/* Pension Insurance */}
                <div className="space-y-2">
                  <Label htmlFor="pension-rate">{t.pensionRate}</Label>
                  <Input
                    id="pension-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={pensionRate}
                    onChange={(e) => setPensionRate(e.target.value)}
                    disabled={saving}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.pensionDefault}
                  </p>
                </div>

                {/* Health + Care Insurance */}
                <div className="space-y-2">
                  <Label htmlFor="health-rate">{t.healthCareRate}</Label>
                  <Input
                    id="health-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={healthCareRate}
                    onChange={(e) => setHealthCareRate(e.target.value)}
                    disabled={saving}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.healthCareDefault}
                  </p>
                </div>

                {/* Unemployment Insurance */}
                <div className="space-y-2">
                  <Label htmlFor="unemployment-rate">{t.unemploymentRate}</Label>
                  <Input
                    id="unemployment-rate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={unemploymentRate}
                    onChange={(e) => setUnemploymentRate(e.target.value)}
                    disabled={saving}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    {t.unemploymentDefault}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {t.settingsNote}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/">
                <Button type="button" variant="outline" disabled={saving}>
                  {t.cancel}
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? t.saving : t.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
