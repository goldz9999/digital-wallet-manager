import { suppliers } from "@/data/mockData";

const Proveedores = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Proveedores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="glass-card rounded-lg p-5 hover:border-primary/40 transition-colors cursor-pointer group"
          >
            <div className="text-3xl mb-2">{s.logo}</div>
            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{s.name}</p>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Códigos</span>
                <span className="font-mono">{s.totalCodes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Invertido</span>
                <span className="font-mono text-primary">${s.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Costo prom.</span>
                <span className="font-mono">${s.avgCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Proveedores;
