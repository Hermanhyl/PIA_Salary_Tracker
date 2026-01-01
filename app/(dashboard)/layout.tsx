import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-x-hidden">
      <DashboardHeader />
      <main className="w-full mx-auto py-8 md:py-10 lg:py-12 max-w-[1400px]">
        <div className="px-10 sm:px-12 md:px-16 lg:px-24 xl:px-32">
          {children}
        </div>
      </main>
    </div>
  );
}
