import { useProviderStatus } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchProviderStatus } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Proveedores = () => {
  const queryClient = useQueryClient();
  const [testingId, setTestingId] = useState<string | null>(null);
  const { data: providers, isLoading, isError, error } = useProviderStatus();

  const handleTestConnection = async (name: string) => {
    setTestingId(name);
    try {
      const result = await fetchProviderStatus(name);
      queryClient.setQueryData(["provider-status"], (old: typeof providers) => {
        const list = Array.isArray(old) ? [...old] : [];
        const idx = list.findIndex((p) => p.name === name);
        const updated = result[0] ? { ...result[0] } : null;
        if (updated) {
          if (idx >= 0) list[idx] = updated;
          else list.push(updated);
        }
        return list;
      });
    } finally {
      setTestingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Proveedores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-lg p-5 animate-pulse space-y-3">
              <div className="h-8 w-8 bg-secondary rounded" />
              <div className="h-4 bg-secondary rounded w-1/2" />
              <div className="h-3 bg-secondary rounded w-2/3" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !providers) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Proveedores</h2>
        <div className="glass-card rounded-lg p-6 flex items-center gap-3 text-destructive border-destructive/30">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium text-sm">Error al cargar proveedores</p>
            <p className="text-xs text-muted-foreground mt-0.5">{String(error)}</p>
          </div>
        </div>
      </div>
    );
  }

  const logoMap: Record<string, string> = { Bamboo: "🎮", CardOne: "🍄", EZ: "🎵" };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Proveedores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((p) => (
          <div key={p.name} className="glass-card rounded-lg p-5 hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="flex items-start justify-between mb-2">
              <div className="text-3xl">{logoMap[p.name] ?? "🏪"}</div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] gap-1",
                  p.status === "connected"
                    ? "bg-success/15 text-success border-success/30"
                    : p.status === "pending"
                      ? "bg-secondary text-secondary-foreground border-border"
                      : "bg-destructive/15 text-destructive border-destructive/30",
                )}
              >
                {p.status === "connected" ? <Wifi className="h-3 w-3" /> : p.status === "pending" ? <RefreshCw className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {p.status === "connected" ? "Conectado" : p.status === "pending" ? "Pendiente" : "Error"}
              </Badge>
            </div>

            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{p.name}</p>

            {p.message && (
              <p className="text-xs text-muted-foreground mt-1">{p.message}</p>
            )}

            <div className="mt-3 space-y-1">
              {p.balance != null && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Balance disponible</span>
                  <span className="font-mono text-green-600">${Number(p.balance).toLocaleString()}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full border-border text-xs"
              onClick={(e) => { e.stopPropagation(); handleTestConnection(p.name); }}
              disabled={testingId !== null}
            >
              {testingId === p.name ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span className="ml-1.5">Probar conexión</span>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proveedores;
