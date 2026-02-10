import { useState, useMemo } from "react";
import { recentSales, suppliers, salesPlatforms } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const statusConfig = {
  completed: { label: "Completado", className: "bg-success/15 text-success border-success/30" },
  pending: { label: "Pendiente", className: "bg-warning/15 text-warning border-warning/30" },
  refunded: { label: "Reembolsado", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const PAGE_SIZE = 10;

const Ventas = () => {
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return recentSales.filter((s) => {
      if (supplierFilter !== "all" && s.supplier !== supplierFilter) return false;
      if (platformFilter !== "all" && s.soldOn !== platformFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [supplierFilter, platformFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">Historial de Ventas</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={supplierFilter} onValueChange={(v) => { setSupplierFilter(v); resetPage(); }}>
          <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
            <SelectValue placeholder="Proveedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los proveedores</SelectItem>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.name}>{s.logo} {s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={platformFilter} onValueChange={(v) => { setPlatformFilter(v); resetPage(); }}>
          <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las plataformas</SelectItem>
            {salesPlatforms.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPage(); }}>
          <SelectTrigger className="w-[160px] bg-secondary/50 border-border">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="refunded">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs">Fecha</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs">Producto</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs">Proveedor</th>
                <th className="text-left py-3 px-3 text-muted-foreground font-medium text-xs">Vendido en</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium text-xs">Costo</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium text-xs">Venta</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium text-xs">Ganancia</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium text-xs">Estado</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No se encontraron ventas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginated.map((sale) => {
                  const profit = sale.salePrice - sale.costPrice;
                  const st = statusConfig[sale.status];
                  return (
                    <tr key={sale.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-xs text-muted-foreground">{sale.date}</td>
                      <td className="py-2.5 px-3 font-medium">{sale.product}</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{sale.supplier}</td>
                      <td className="py-2.5 px-3 text-primary">{sale.soldOn}</td>
                      <td className="py-2.5 px-3 text-right font-mono">${sale.costPrice.toFixed(2)}</td>
                      <td className="py-2.5 px-3 text-right font-mono">${sale.salePrice.toFixed(2)}</td>
                      <td className={`py-2.5 px-3 text-right font-mono ${profit >= 0 ? "text-success" : "text-destructive"}`}>
                        ${profit.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Badge variant="outline" className={`text-[10px] ${st.className}`}>
                          {st.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} — Página {currentPage} de {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                  n === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
