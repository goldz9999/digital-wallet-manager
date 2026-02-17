import { useState, useMemo } from "react";
import {
  marketplaceProducts,
  suppliers,
  supplierProducts,
  catalogMappings as initialMappings,
  type CatalogMapping,
  type MarketplaceProduct,
  type SupplierProduct,
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, ChevronLeft, Package } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Producto marketplace" },
  { id: 2, title: "Proveedor" },
  { id: 3, title: "Producto proveedor" },
  { id: 4, title: "Precio venta" },
];

const Catalogo = () => {
  const [step, setStep] = useState(1);
  const [marketplaceProductId, setMarketplaceProductId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [supplierProductId, setSupplierProductId] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [mappings, setMappings] = useState<CatalogMapping[]>(initialMappings);

  const selectedMarketplace = marketplaceProducts.find((p) => p.id === marketplaceProductId);
  const selectedSupplier = suppliers.find((s) => s.id === supplierId);
  const filteredSupplierProducts = useMemo(
    () => supplierProducts.filter((sp) => sp.supplierId === supplierId),
    [supplierId],
  );
  const selectedSupplierProduct = filteredSupplierProducts.find((sp) => sp.id === supplierProductId);

  const cost = selectedSupplierProduct?.cost ?? 0;
  const priceNum = parseFloat(salePrice) || 0;
  const marginPct = cost > 0 && priceNum > 0 ? ((priceNum - cost) / priceNum) * 100 : 0;

  const handleToggleFulfillment = (id: string, checked: boolean) => {
    setMappings((prev) => prev.map((m) => (m.id === id ? { ...m, autoFulfillment: checked } : m)));
  };

  const handleFinishWizard = () => {
    if (!selectedMarketplace || !selectedSupplier || !selectedSupplierProduct || !salePrice) return;
    const newMapping: CatalogMapping = {
      id: `cm-${Date.now()}`,
      marketplaceProductId: selectedMarketplace.id,
      marketplaceProductName: selectedMarketplace.name,
      marketplacePlatform: selectedMarketplace.platform,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierSku: selectedSupplierProduct.sku,
      cost: selectedSupplierProduct.cost,
      salePrice: priceNum,
      marginPct,
      autoFulfillment: true,
    };
    setMappings((prev) => [...prev, newMapping]);
    setStep(1);
    setMarketplaceProductId("");
    setSupplierId("");
    setSupplierProductId("");
    setSalePrice("");
  };

  const canNextStep =
    (step === 1 && marketplaceProductId) ||
    (step === 2 && supplierId) ||
    (step === 3 && supplierProductId) ||
    (step === 4 && salePrice && priceNum > cost);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold">Catálogo</h2>

      {/* Wizard */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex gap-2 mb-6">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                step >= s.id ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center border",
                  step === s.id ? "border-primary bg-primary/10" : step > s.id ? "border-primary bg-primary/20" : "border-border",
                )}
              >
                {step > s.id ? "✓" : s.id}
              </span>
              <span>{s.title}</span>
              {s.id < 4 && <ChevronRight className="h-3 w-3 ml-1 opacity-50" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <Label>Selecciona producto del marketplace</Label>
            <select
              value={marketplaceProductId}
              onChange={(e) => setMarketplaceProductId(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-secondary/50 px-3 text-sm"
            >
              <option value="">— Elegir —</option>
              {marketplaceProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.platform})
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Label>Selecciona proveedor</Label>
            <select
              value={supplierId}
              onChange={(e) => {
                setSupplierId(e.target.value);
                setSupplierProductId("");
              }}
              className="w-full h-10 rounded-md border border-input bg-secondary/50 px-3 text-sm"
            >
              <option value="">— Elegir —</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.logo} {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <Label>Selecciona producto del proveedor</Label>
            <select
              value={supplierProductId}
              onChange={(e) => setSupplierProductId(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-secondary/50 px-3 text-sm"
            >
              <option value="">— Elegir —</option>
              {filteredSupplierProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — SKU: {p.sku} — ${p.cost}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Precio de venta ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="bg-secondary/50 border-border font-mono"
                placeholder="0.00"
              />
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">Costo:</span>
              <span className="font-mono">${cost.toFixed(2)}</span>
              <span className="text-muted-foreground">Margen:</span>
              <span className="font-mono text-success">{marginPct.toFixed(1)}%</span>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="border-border"
          >
            <ChevronLeft className="h-4 w-4" />
            Atrás
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNextStep}>
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinishWizard} disabled={!canNextStep}>
              Guardar mapeo
            </Button>
          )}
        </div>
      </div>

      {/* Tabla mapeos activos */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Mapeos activos</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
              <TableHead className="text-muted-foreground">Producto</TableHead>
              <TableHead className="text-muted-foreground">Proveedor</TableHead>
              <TableHead className="text-muted-foreground">SKU</TableHead>
              <TableHead className="text-right text-muted-foreground">Costo</TableHead>
              <TableHead className="text-right text-muted-foreground">Precio</TableHead>
              <TableHead className="text-right text-muted-foreground">Margen %</TableHead>
              <TableHead className="text-center text-muted-foreground">Auto fulfillment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings.map((m) => (
              <TableRow key={m.id} className="border-border/50">
                <TableCell className="font-medium">{m.marketplaceProductName}</TableCell>
                <TableCell className="text-muted-foreground">{m.supplierName}</TableCell>
                <TableCell className="font-mono text-xs">{m.supplierSku}</TableCell>
                <TableCell className="text-right font-mono">${m.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">${m.salePrice.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono text-success">{m.marginPct.toFixed(1)}%</TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={m.autoFulfillment}
                    onCheckedChange={(checked) => handleToggleFulfillment(m.id, checked)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Catalogo;
