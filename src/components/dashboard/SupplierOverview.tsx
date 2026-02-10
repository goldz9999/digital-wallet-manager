import { suppliers } from "@/data/mockData";

export function SupplierOverview() {
  return (
    <div className="glass-card rounded-lg p-5">
      <h3 className="text-base font-semibold mb-4">Proveedores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="rounded-lg bg-secondary/40 p-3 hover:bg-secondary/60 transition-colors cursor-pointer group"
          >
            <div className="text-2xl mb-1">{s.logo}</div>
            <p className="font-medium text-sm group-hover:text-primary transition-colors">{s.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-mono">{s.totalCodes.toLocaleString()}</span> códigos
            </p>
            <p className="text-xs font-mono text-primary mt-0.5">
              ${s.totalSpent.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
