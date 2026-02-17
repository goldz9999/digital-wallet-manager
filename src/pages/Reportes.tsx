import { useState, useMemo } from "react";
import {
  productProfitability,
  platformComparison,
  type ProductProfitability as Row,
} from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type DateRangeKey = "7d" | "30d" | "3m" | "custom";

const dateRangeOptions: { key: DateRangeKey; label: string }[] = [
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "3m", label: "3 meses" },
  { key: "custom", label: "Personalizado" },
];

const Reportes = () => {
  const [dateRange, setDateRange] = useState<DateRangeKey>("30d");

  const sortedByProfit = useMemo(() => {
    const copy = [...productProfitability];
    return copy.sort((a, b) => b.marginPct - a.marginPct);
  }, []);

  const bestProduct = sortedByProfit[0];
  const worstProduct = sortedByProfit[sortedByProfit.length - 1];

  const handleExportCSV = () => {
    const headers = ["Producto", "Plataforma", "Ingresos", "Costo", "Beneficio", "Margen %", "Unidades"];
    const rows = productProfitability.map(
      (r) => [r.product, r.platform, r.revenue, r.cost, r.profit, r.marginPct, r.unitsSold].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-rentabilidad-${dateRange}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          {dateRange === "custom" && (
            <span className="text-xs text-muted-foreground">(Selector custom simulado)</span>
          )}
        </div>
      </div>

      {/* Mejor y peor producto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-lg p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-success/10">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Mejor producto</p>
            <p className="font-semibold">{bestProduct?.product ?? "—"}</p>
            <p className="text-sm font-mono text-success">
              Margen {bestProduct?.marginPct.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="glass-card rounded-lg p-5 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <TrendingDown className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Peor producto</p>
            <p className="font-semibold">{worstProduct?.product ?? "—"}</p>
            <p className="text-sm font-mono text-destructive">
              Margen {worstProduct?.marginPct.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Comparativa entre plataformas */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-sm font-semibold mb-4">Comparativa por plataforma</h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformComparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="platform" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(220 18% 12%)", border: "1px solid hsl(220 14% 18%)", borderRadius: "8px" }}
                formatter={(value: number, name: string) => [
                  name === "revenue" ? `$${value.toLocaleString()}` : name === "profit" ? `$${value.toLocaleString()}` : `${value.toFixed(1)}%`,
                  name === "revenue" ? "Ingresos" : name === "profit" ? "Beneficio" : "Margen %",
                ]}
                labelFormatter={(label) => label}
              />
              <Legend formatter={(value) => (value === "revenue" ? "Ingresos" : value === "profit" ? "Beneficio" : "Margen %")} />
              <Bar dataKey="revenue" fill="hsl(174 72% 50% / 0.7)" name="revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="hsl(150 60% 45% / 0.8)" name="profit" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla rentabilidad por producto + Export CSV */}
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
            {productProfitability.map((row: Row) => (
              <TableRow key={`${row.product}-${row.platform}`} className="border-border/50">
                <TableCell className="font-medium">{row.product}</TableCell>
                <TableCell className="text-muted-foreground">{row.platform}</TableCell>
                <TableCell className="text-right font-mono">${row.revenue.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono">${row.cost.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-success">${row.profit.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono">{row.marginPct.toFixed(1)}%</TableCell>
                <TableCell className="text-right font-mono">{row.unitsSold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Reportes;
