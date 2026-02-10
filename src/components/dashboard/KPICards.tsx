import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from "lucide-react";

const kpis = [
  {
    title: "Ingresos Totales",
    value: "$156,000",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    title: "Gastos Totales",
    value: "$224,100",
    change: "+8.2%",
    trend: "up" as const,
    icon: TrendingDown,
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  {
    title: "Ganancia Neta",
    value: "$38,600",
    change: "+18.3%",
    trend: "up" as const,
    icon: TrendingUp,
    colorClass: "text-success",
    bgClass: "bg-success/10",
  },
  {
    title: "Códigos Vendidos",
    value: "7,035",
    change: "+5.7%",
    trend: "up" as const,
    icon: ShoppingCart,
    colorClass: "text-warning",
    bgClass: "bg-warning/10",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className="glass-card rounded-lg p-5 animate-slide-up"
        >
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
