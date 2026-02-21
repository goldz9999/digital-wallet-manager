import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, Calendar, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type DateRangeKey = "7d" | "30d" | "3m";

const dateRangeOptions: { key: DateRangeKey; label: string }[] = [
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "3m", label: "3 meses" },
];

interface ProductRow {
  product: string;
  platform: string;
  revenue: number;
  cost: number;
  profit: number;
  marginPct: number;
  unitsSold: number;
}

interface PlatformRow {
  platform: string;
  revenue: number;
  profit: number;
  marginPct: number;
}

interface ReportData {
  products: ProductRow[];
  platforms: PlatformRow[];
}

function fetchReport(range: DateRangeKey): Promise<ReportData> {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  return fetch(`${base}/api/reports?range=${range}`).then((r) => {
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  });
}

const Reportes = () => {
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["reports", dateRange],
    queryFn: () => fetchReport(dateRange),
    staleTime: 60_000,
    retry: 2,
  });

  const handleExportCSV = () => {
    if (!data?.products) return;
    const headers = ["Producto", "Plataforma", "Ingresos", "Costo", "Beneficio", "Margen %", "Unidades"];
    const rows = data.products.map((r) =>
      [r.product, r.platform, r.revenue, r.cost, r.profit, r.marginPct, r.unitsSold].join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-${dateRange}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Reportes</h2>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Reportes</h2>
        <div className="glass-card rounded-lg p-6 flex items-center gap-3 text-destructive border-destructive/30">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium text-sm">Error al cargar reportes</p>
            <p className="text-xs text-muted-foreground mt-0.5">{String(error)}</p>
          </div>
        </div>
      </div>
    );
  }

  const sorted = [...(data.products ?? [])].sort((a, b) => b.marginPct - a.marginPct);
  const bestProduct = sorted[0];
  const worstProduct = sorted[sorted.length - 1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Reportes</h2>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="flex rounded-lg border border-border bg-secondary/30 p-0.5">
            {dateRangeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setDateRange(opt.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  dateRange === opt.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Best / Worst */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-lg p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Mejor producto</p>
            <p className="font-semibold">{bestProduct?.product ?? "—"}</p>
            <p className="text-sm font-mono text-success">Margen {bestProduct?.marginPct.toFixed(1)}%</p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Peor producto</p>
            <p className="font-semibold">{worstProduct?.product ?? "—"}</p>
            <p className="text-sm font-mono text-destructive">Margen {worstProduct?.marginPct.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Platform chart */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Comparativa por plataforma</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.platforms} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="platform" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(220 18% 12%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px" }}
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`,
                  name === "revenue" ? "Ingresos" : "Beneficio",
                ]}
              />
              <Legend formatter={(v) => (v === "revenue" ? "Ingresos" : "Beneficio")} />
              <Bar dataKey="revenue" fill="hsl(174 72% 50% / 0.7)" name="revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="hsl(150 60% 45% / 0.8)" name="profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold">Rentabilidad por producto</h3>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 border-border">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="text-muted-foreground">Producto</TableHead>
              <TableHead className="text-muted-foreground">Plataforma</TableHead>
              <TableHead className="text-right text-muted-foreground">Ingresos</TableHead>
              <TableHead className="text-right text-muted-foreground">Costo</TableHead>
              <TableHead className="text-right text-muted-foreground">Beneficio</TableHead>
              <TableHead className="text-right text-muted-foreground">Margen %</TableHead>
              <TableHead className="text-right text-muted-foreground">Unidades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground text-sm">
                  Sin datos para el período seleccionado.
                </TableCell>
              </TableRow>
            ) : (
              data.products.map((row) => (
                <TableRow key={`${row.product}-${row.platform}`} className="border-border/50">
                  <TableCell className="font-medium">{row.product}</TableCell>
                  <TableCell className="text-muted-foreground">{row.platform}</TableCell>
                  <TableCell className="text-right font-mono">${row.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">${row.cost.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-success">${row.profit.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{row.marginPct.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-mono">{row.unitsSold}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Reportes;
