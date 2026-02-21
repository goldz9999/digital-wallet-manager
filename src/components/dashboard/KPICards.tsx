import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, AlertCircle } from "lucide-react";
import { useDashboardStats } from "@/hooks/useApi";

export function KPICards() {
  const { data, isLoading, isError, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card rounded-lg p-5 animate-pulse">
            <div className="h-4 bg-secondary rounded w-2/3 mb-3" />
            <div className="h-8 bg-secondary rounded w-1/2 mb-2" />
            <div className="h-3 bg-secondary rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="glass-card rounded-lg p-6 flex items-center gap-3 text-destructive border-destructive/30">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-medium text-sm">Error al cargar estadísticas</p>
          <p className="text-xs text-muted-foreground mt-0.5">{String(error)}</p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Ingresos Totales",
      value: `$${data.total_revenue.toLocaleString()}`,
      change: `${data.revenue_change_pct >= 0 ? "+" : ""}${data.revenue_change_pct.toFixed(1)}%`,
      trend: data.revenue_change_pct >= 0 ? ("up" as const) : ("down" as const),
      icon: DollarSign,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      title: "Gastos Totales",
      value: `$${data.total_expenses.toLocaleString()}`,
      change: `${data.expenses_change_pct >= 0 ? "+" : ""}${data.expenses_change_pct.toFixed(1)}%`,
      trend: "up" as const,
      icon: TrendingDown,
      colorClass: "text-destructive",
      bgClass: "bg-destructive/10",
    },
    {
      title: "Ganancia Neta",
      value: `$${data.net_profit.toLocaleString()}`,
      change: `${data.profit_change_pct >= 0 ? "+" : ""}${data.profit_change_pct.toFixed(1)}%`,
      trend: data.profit_change_pct >= 0 ? ("up" as const) : ("down" as const),
      icon: TrendingUp,
      colorClass: "text-success",
      bgClass: "bg-success/10",
    },
    {
      title: "Códigos Vendidos",
      value: data.codes_sold.toLocaleString(),
      change: `${data.codes_sold_change_pct >= 0 ? "+" : ""}${data.codes_sold_change_pct.toFixed(1)}%`,
      trend: data.codes_sold_change_pct >= 0 ? ("up" as const) : ("down" as const),
      icon: ShoppingCart,
      colorClass: "text-warning",
      bgClass: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="glass-card rounded-lg p-5 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{kpi.title}</span>
            <div className={`p-2 rounded-md ${kpi.bgClass}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.colorClass}`} />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight font-mono">{kpi.value}</p>
          <p className={`text-xs mt-1 ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
            {kpi.change} vs mes anterior
          </p>
        </div>
      ))}
    </div>
  );
}
