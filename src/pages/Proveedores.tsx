import { useState } from "react";
import { suppliers, type Supplier, type SupplierOrder } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Proveedores = () => {
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestConnection = async (s: Supplier) => {
    setTestingId(s.id);
    await new Promise((r) => setTimeout(r, 1500));
    setTestingId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Proveedores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => {
          const codigos = s.codigosComprados;
          const invertido = s.invertido;
          const saldo = s.saldo;
          const status = s.connectionStatus ?? "connected";
          const lastOrders: SupplierOrder[] = s.lastOrders ?? [];

          return (
            <div
              key={s.id}
              className="glass-card rounded-lg p-5 hover:border-primary/40 transition-colors cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{s.logo}</div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] gap-1",
                    status === "connected"
                      ? "bg-success/15 text-success border-success/30"
                      : "bg-destructive/15 text-destructive border-destructive/30",
                  )}
                >
                  {status === "connected" ? (
                    <Wifi className="h-3 w-3" />
                  ) : (
                    <WifiOff className="h-3 w-3" />
                  )}
                  {status === "connected" ? "Conectado" : "Error"}
                </Badge>
              </div>
              <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.name}</p>

              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Balance disponible</span>
                  <span className="font-mono text-green-600">${saldo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Códigos</span>
                  <span className="font-mono">{codigos.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Invertido</span>
                  <span className="font-mono text-primary">${invertido.toLocaleString()}</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full border-border text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTestConnection(s);
                }}
                disabled={testingId !== null}
              >
                {testingId === s.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                <span className="ml-1.5">Probar conexión</span>
              </Button>

              {lastOrders.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                    Últimas 3 órdenes
                  </p>
                  <ul className="space-y-1.5">
                    {lastOrders.map((o) => (
                      <li key={o.id} className="flex justify-between text-xs">
                        <span className="truncate max-w-[120px]">{o.product}</span>
                        <span className="font-mono shrink-0">${o.total.toFixed(0)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Proveedores;
