import { KPICards } from "@/components/dashboard/KPICards";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { SalesPieChart } from "@/components/dashboard/SalesPieChart";
import { SupplierBarChart } from "@/components/dashboard/SupplierBarChart";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <KPICards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SalesPieChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SupplierBarChart />
      </div>
    </div>
  );
};

export default Dashboard;
