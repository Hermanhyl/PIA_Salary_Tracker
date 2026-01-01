"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid hydration mismatch with Radix UI components
const DashboardContent = dynamic(
  () => import("@/components/dashboard/dashboard-content").then(mod => ({ default: mod.DashboardContent })),
  { ssr: false }
);

export default function HomePage() {
  return <DashboardContent />;
}
