import { useProviderStatus } from "@/hooks/useApi";
import { Loader2, AlertCircle } from "lucide-react";

export function SupplierOverview() {
  const { data: providers, isLoading, isError } = useProviderStatus();

  const logoMap: Record<string, string> = { Bamboo: "🎮", CardOne: "🍄", EZ: "🎵" };

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-base font-semibold mb-4">Proveedores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-secondary/40 p-3 animate-pulse">
              <div className="h-8 w-8 bg-secondary rounded mb-2" />
              <div className="h-3 bg-secondary rounded w-3/4 mb-1" />
              <div className="h-2 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !providers) {
    return (
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-base font-semibold mb-4">Proveedores</h3>
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Error al cargar proveedores</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Proveedores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {providers.map((p) => (
          <div key={p.name} className="rounded-lg bg-secondary/40 p-3 hover:bg-secondary/60 transition-colors cursor-pointer group">
            <div className="text-2xl mb-1">{logoMap[p.name] ?? "🏪"}</div>
            <p className="font-medium text-sm group-hover:text-primary transition-colors">{p.name}</p>
            {p.balance !== undefined && (
              <p className="text-xs font-mono text-primary mt-0.5">${p.balance.toLocaleString()}</p>
            )}
            <p className={`text-xs mt-1 ${p.status === "connected" ? "text-success" : "text-destructive"}`}>
              {p.status === "connected" ? "Conectado" : "Error"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
