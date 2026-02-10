import { recentSales } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  completed: { label: "Completado", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "Pendiente", className: "bg-warning/15 text-warning border-warning/30" },
  refunded: { label: "Reembolsado", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export function SalesHistory() {
  return (
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Historial de Ventas</h3>
        <span className="text-xs text-muted-foreground">Últimas 12 transacciones</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-2 text-muted-foreground font-medium text-xs">Fecha</th>
              <th className="text-left py-2.5 px-2 text-muted-foreground font-medium text-xs">Producto</th>
              <th className="text-left py-2.5 px-2 text-muted-foreground font-medium text-xs">Proveedor</th>
              <th className="text-left py-2.5 px-2 text-muted-foreground font-medium text-xs">Vendido en</th>
              <th className="text-right py-2.5 px-2 text-muted-foreground font-medium text-xs">Costo</th>
              <th className="text-right py-2.5 px-2 text-muted-foreground font-medium text-xs">Venta</th>
              <th className="text-right py-2.5 px-2 text-muted-foreground font-medium text-xs">Ganancia</th>
              <th className="text-center py-2.5 px-2 text-muted-foreground font-medium text-xs">Estado</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale) => {
              const profit = sale.salePrice - sale.costPrice;
              const st = statusConfig[sale.status];
              return (
                <tr key={sale.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-2.5 px-2 font-mono text-xs text-muted-foreground">{sale.date}</td>
                  <td className="py-2.5 px-2 font-medium">{sale.product}</td>
                  <td className="py-2.5 px-2 text-muted-foreground">{sale.supplier}</td>
                  <td className="py-2.5 px-2 text-primary">{sale.soldOn}</td>
                  <td className="py-2.5 px-2 text-right font-mono">${sale.costPrice.toFixed(2)}</td>
                  <td className="py-2.5 px-2 text-right font-mono">${sale.salePrice.toFixed(2)}</td>
                  <td className={`py-2.5 px-2 text-right font-mono ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                    ${profit.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                      {st.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
