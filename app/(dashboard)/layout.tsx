import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/shared/dashboard-sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | ZeroPlag",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-900">
      <DashboardSidebar />

      {/* Main content — offset on mobile for hamburger button */}
      <main className="flex-1 min-w-0 flex flex-col md:overflow-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
