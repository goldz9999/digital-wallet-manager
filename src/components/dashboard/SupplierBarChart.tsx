import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { salesBySupplier } from "@/data/mockData";

export function SupplierBarChart() {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Productos más vendidos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesBySupplier} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" horizontal={false} />
            <XAxis type="number" stroke="hsl(215 12% 50%)" fontSize={12} tickFormatter={(v) => `${v}`} />
            <YAxis dataKey="name" type="category" stroke="hsl(215 12% 50%)" fontSize={12} width={85} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 18% 10%)",
                border: "1px solid hsl(220 14% 18%)",
                borderRadius: "8px",
                color: "hsl(210 20% 92%)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="sales" name="Códigos vendidos" fill="hsl(174 72% 50%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
