import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";

interface SupplierStat {
  name: string;
  sales: number;
}

function fetchSalesBySupplier(): Promise<SupplierStat[]> {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  return fetch(`${base}/api/stats/by-supplier`).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });
}

export function SupplierBarChart() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sales-by-supplier"],
    queryFn: fetchSalesBySupplier,
    staleTime: 60_000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-base font-semibold mb-4">Productos más vendidos</h3>
        <div className="h-[300px] flex flex-col justify-center gap-3 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 bg-secondary rounded animate-pulse" style={{ width: `${40 + i * 10}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-base font-semibold mb-4">Productos más vendidos</h3>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{isError ? `Error: ${String(error)}` : "Sin datos disponibles"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Productos más vendidos</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 16%)" horizontal={false} />
            <XAxis type="number" stroke="hsl(215 12% 50%)" fontSize={12} />
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
