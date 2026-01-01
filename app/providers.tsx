"use client";

import { ReactNode } from "react";
import { LanguageProvider } from "@/lib/language-context";
import { DataProvider } from "@/lib/data-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <DataProvider>{children}</DataProvider>
    </LanguageProvider>
  );
}
