import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

interface MonthlyStat {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

function fetchMonthlyStats(): Promise<MonthlyStat[]> {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  return fetch(`${base}/api/stats/monthly`).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });
}

export function RevenueChart() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["monthly-stats"],
    queryFn: fetchMonthlyStats,
    staleTime: 60_000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-base font-semibold mb-4">Ingresos vs Gastos</h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="space-y-3 w-full px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-secondary rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-base font-semibold mb-4">Ingresos vs Gastos</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{isError ? `Error: ${String(error)}` : "Sin datos disponibles"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Ingresos vs Gastos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
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
