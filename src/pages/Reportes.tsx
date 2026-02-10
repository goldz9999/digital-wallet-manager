import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { SalesPieChart } from "@/components/dashboard/SalesPieChart";
import { SupplierBarChart } from "@/components/dashboard/SupplierBarChart";

const Reportes = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Reportes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SalesPieChart />
      </div>
      <SupplierBarChart />
    </div>
  );
};

export default Reportes;
