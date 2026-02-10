import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthlyStats } from "@/data/mockData";

export function RevenueChart() {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Ingresos vs Gastos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyStats} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" />
            <XAxis dataKey="month" stroke="hsl(215 12% 50%)" fontSize={12} />
            <YAxis stroke="hsl(215 12% 50%)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220 18% 10%)",
                border: "1px solid hsl(220 14% 18%)",
                borderRadius: "8px",
                color: "hsl(210 20% 92%)",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend />
            <Bar dataKey="revenue" name="Ingresos" fill="hsl(174 72% 50%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Gastos" fill="hsl(270 60% 58%)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Ganancia" fill="hsl(150 60% 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
