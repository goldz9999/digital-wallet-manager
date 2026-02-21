import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, ListOrdered, AlertTriangle, Info, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

interface PendingOrder {
  id: string;
  product: string;
  platform: string;
  salePrice: number;
  createdAt: string;
  status: "queued" | "fulfilling" | "sent";
}

interface AutoAlert {
  id: string;
  type: "error" | "warning";
  title: string;
  message: string;
  timestamp: string;
}

const levelStyles: Record<LogEntry["level"], string> = {
  info: "text-muted-foreground",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

const levelIcons = { info: Info, success: Zap, warning: AlertTriangle, error: AlertTriangle };

const Automatizacion = () => {
  const [isActive, setIsActive] = useState(true);

  const { data: logData, isLoading: logLoading, isError: logError } = useQuery<LogEntry[]>({
    queryKey: ["automation-log"],
    queryFn: () => fetch(`${BASE}/api/automation/log`).then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    refetchInterval: isActive ? 5000 : false,
    staleTime: 0,
  });

  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useQuery<PendingOrder[]>({
    queryKey: ["automation-orders"],
    queryFn: () => fetch(`${BASE}/api/automation/pending-orders`).then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    refetchInterval: isActive ? 10000 : false,
    staleTime: 0,
  });

  const { data: alertsData, isLoading: alertsLoading, isError: alertsError } = useQuery<AutoAlert[]>({
    queryKey: ["automation-alerts"],
    queryFn: () => fetch(`${BASE}/api/automation/alerts`).then((r) => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    refetchInterval: isActive ? 15000 : false,
    staleTime: 0,
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Automatización</h2>
        <div className="flex items-center gap-3">
          <Label htmlFor="automation-toggle" className="text-sm cursor-pointer">
            {isActive ? "Sistema activo" : "Sistema pausado"}
          </Label>
          <Switch id="automation-toggle" checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Log en tiempo real</h3>
            {logLoading && <Loader2 className="h-3.5 w-3.5 animate-spin ml-auto text-muted-foreground" />}
          </div>
          <ScrollArea className="h-[280px] p-3">
            {logError ? (
              <div className="flex items-center gap-2 text-destructive text-xs p-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Error al cargar logs
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {(logData ?? []).map((entry) => {
                  const Icon = levelIcons[entry.level];
                  return (
                    <div key={entry.id} className={cn("flex gap-2 items-start", levelStyles[entry.level])}>
                      <span className="text-muted-foreground shrink-0">{formatTime(entry.timestamp)}</span>
                      <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span className="break-words">{entry.message}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Pending orders */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <ListOrdered className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Cola de órdenes pendientes</h3>
            {ordersLoading && <Loader2 className="h-3.5 w-3.5 animate-spin ml-auto text-muted-foreground" />}
          </div>
          <ScrollArea className="h-[280px] p-3">
            {ordersError ? (
              <div className="flex items-center gap-2 text-destructive text-xs p-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Error al cargar órdenes
              </div>
            ) : (ordersData ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No hay órdenes pendientes.</p>
            ) : (
              <ul className="space-y-3">
                {(ordersData ?? []).map((o) => (
                  <li key={o.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/30 border border-border/50">
                    <div>
                      <p className="font-medium text-sm">{o.product}</p>
                      <p className="text-xs text-muted-foreground">{o.platform}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-primary">${o.salePrice.toFixed(2)}</p>
                      <Badge variant="outline" className={cn("text-[10px] mt-1",
                        o.status === "sent" && "bg-success/15 text-success border-success/30",
                        o.status === "fulfilling" && "bg-warning/15 text-warning border-warning/30",
                        o.status === "queued" && "bg-muted text-muted-foreground",
                      )}>
                        {o.status === "sent" ? "Enviado" : o.status === "fulfilling" ? "Procesando" : "En cola"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold">Alertas y errores</h3>
          {alertsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin ml-auto text-muted-foreground" />}
        </div>
        <div className="p-4">
          {alertsError ? (
            <div className="flex items-center gap-2 text-destructive text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              Error al cargar alertas
            </div>
          ) : (alertsData ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay alertas.</p>
          ) : (
            <ul className="space-y-3">
              {(alertsData ?? []).map((a) => (
                <li key={a.id} className={cn("flex gap-3 p-3 rounded-lg border",
                  a.type === "error" ? "bg-destructive/10 border-destructive/30" : "bg-warning/10 border-warning/30"
                )}>
                  <AlertTriangle className={cn("h-4 w-4 shrink-0", a.type === "error" ? "text-destructive" : "text-warning")} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{formatTime(a.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Automatizacion;
