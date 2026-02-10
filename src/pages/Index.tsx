import { Gamepad2, Bell } from "lucide-react";
import { KPICards } from "@/components/dashboard/KPICards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { SalesPieChart } from "@/components/dashboard/SalesPieChart";
import { SalesHistory } from "@/components/dashboard/SalesHistory";
import { SupplierOverview } from "@/components/dashboard/SupplierOverview";
import { SupplierBarChart } from "@/components/dashboard/SupplierBarChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Gamepad2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">CodeVault</h1>
            <p className="text-xs text-muted-foreground">Gestión de Códigos Digitales</p>
          </div>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
        </button>
      </header>

      {/* Content */}
      <main className="p-6 max-w-[1400px] mx-auto space-y-6">
        <KPICards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <SalesPieChart />
        </div>

        <SupplierOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SupplierBarChart />
          <div className="lg:hidden xl:block" />
        </div>

        <SalesHistory />
      </main>
    </div>
  );
};

export default Index;
