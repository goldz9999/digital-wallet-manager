import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronRight, ChevronLeft, Package, Plus, Search, DollarSign, Check, Sliders, ChevronDown, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ── Types ────────────────────────────────────────────────────────────────────
interface EnebaProduct { id: string; name: string; platform: string; category: string; }
interface ProviderInfo { id: string; name: string; logo: string; }
interface SupplierProduct { id: string; supplierId: string; name: string; sku: string; currency: string; priceType: "fixed" | "range"; fixedPrices?: number[]; minPrice?: number; maxPrice?: number; stock: number; }
interface CatalogMapping { id: string; marketplaceProductId: string; marketplaceProductName: string; marketplacePlatform: string; supplierId: string; supplierName: string; supplierSku: string; cost: number; salePrice: number; marginPct: number; autoFulfillment: boolean; }

// ── API helpers ───────────────────────────────────────────────────────────────
const get = (path: string) => fetch(`${BASE}${path}`).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); });

const STEP_LABELS = [
  { id: 1, label: "Producto de Eneba" },
  { id: 2, label: "Proveedor y producto" },
];

interface WizardState {
  step: 1 | 2;
  marketplaceProductId: string;
  supplierId: string;
  supplierProductId: string;
  selectedFixedPrice: number | null;
  customPrice: string;
}
const initialWizard: WizardState = { step: 1, marketplaceProductId: "", supplierId: "", supplierProductId: "", selectedFixedPrice: null, customPrice: "" };

const Catalogo = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [wizard, setWizard] = useState<WizardState>(initialWizard);
  const [enebaSearch, setEnebaSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [supplierSearchCommitted, setSupplierSearchCommitted] = useState("");
  const [supplierPopoverOpen, setSupplierPopoverOpen] = useState(false);

  // Fetch data
  const { data: enebaProducts = [], isLoading: enebaLoading } = useQuery<EnebaProduct[]>({
    queryKey: ["eneba-products"],
    queryFn: () => get("/api/catalog/eneba-products"),
    staleTime: 300_000,
  });
  const { data: providers = [], isLoading: providersLoading } = useQuery<ProviderInfo[]>({
    queryKey: ["providers-list"],
    queryFn: () => get("/api/catalog/providers"),
    staleTime: 300_000,
  });
  const { data: mappings = [], isLoading: mappingsLoading, isError: mappingsError } = useQuery<CatalogMapping[]>({
    queryKey: ["catalog-mappings"],
    queryFn: () => get("/api/catalog/mappings"),
    staleTime: 60_000,
  });
  const { data: supplierResults = [], isLoading: searchLoading } = useQuery<SupplierProduct[]>({
    queryKey: ["supplier-products", wizard.supplierId, supplierSearchCommitted],
    queryFn: () => get(`/api/catalog/supplier-products?supplier_id=${wizard.supplierId}&q=${encodeURIComponent(supplierSearchCommitted)}`),
    enabled: !!wizard.supplierId && !!supplierSearchCommitted,
    staleTime: 60_000,
  });

  const saveMutation = useMutation({
    mutationFn: (body: object) => fetch(`${BASE}/api/catalog/mappings`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["catalog-mappings"] }); setOpen(false); },
  });
  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => fetch(`${BASE}/api/catalog/mappings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ autoFulfillment: enabled }) }).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["catalog-mappings"] }),
  });

  const mappedIds = useMemo(() => new Set(mappings.map(m => m.marketplaceProductId)), [mappings]);
  const availableEnebaProducts = useMemo(() => enebaProducts.filter(p => {
    if (mappedIds.has(p.id)) return false;
    if (!enebaSearch.trim()) return true;
    return p.name.toLowerCase().includes(enebaSearch.toLowerCase()) || p.platform.toLowerCase().includes(enebaSearch.toLowerCase());
  }), [enebaProducts, mappedIds, enebaSearch]);

  const selectedMarketplace = enebaProducts.find(p => p.id === wizard.marketplaceProductId);
  const selectedSupplier = providers.find(s => s.id === wizard.supplierId);
  const selectedSupplierProduct = supplierResults.find(sp => sp.id === wizard.supplierProductId);

  const effectiveCost = useMemo(() => {
    if (!selectedSupplierProduct) return 0;
    if (selectedSupplierProduct.priceType === "fixed" && wizard.selectedFixedPrice !== null) return wizard.selectedFixedPrice;
    if (selectedSupplierProduct.priceType === "range") return parseFloat(wizard.customPrice) || 0;
    return 0;
  }, [selectedSupplierProduct, wizard]);

  const canAdvance = useMemo(() => {
    if (wizard.step === 1) return !!wizard.marketplaceProductId;
    if (!wizard.supplierId || !wizard.supplierProductId || !selectedSupplierProduct) return false;
    if (selectedSupplierProduct.priceType === "fixed") return wizard.selectedFixedPrice !== null;
    const v = parseFloat(wizard.customPrice);
    return !isNaN(v) && v >= (selectedSupplierProduct.minPrice ?? 0) && v <= (selectedSupplierProduct.maxPrice ?? Infinity);
  }, [wizard, selectedSupplierProduct]);

  const openModal = () => { setWizard(initialWizard); setEnebaSearch(""); setSupplierSearch(""); setSupplierSearchCommitted(""); setOpen(true); };

  const handleSave = () => {
    if (!selectedMarketplace || !selectedSupplier || !selectedSupplierProduct) return;
    saveMutation.mutate({
      marketplaceProductId: selectedMarketplace.id,
      marketplaceProductName: selectedMarketplace.name,
      marketplacePlatform: selectedMarketplace.platform,
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      supplierSku: selectedSupplierProduct.sku,
      cost: effectiveCost,
      autoFulfillment: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Catálogo</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Mapea tus productos de Eneba con los proveedores mayoristas</p>
        </div>
        <Button onClick={openModal} className="gap-2"><Plus className="h-4 w-4" />Nuevo mapeo</Button>
      </div>

      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Mapeos activos</h3>
          {mappingsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin ml-1 text-muted-foreground" />}
          <Badge variant="outline" className="ml-auto text-xs">{mappings.length} mapeos</Badge>
        </div>
        {mappingsError ? (
          <div className="p-6 flex items-center gap-2 text-destructive text-sm"><AlertCircle className="h-4 w-4" />Error al cargar mapeos</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/30 hover:bg-secondary/30">
                <TableHead className="text-muted-foreground text-xs">Producto Eneba</TableHead>
                <TableHead className="text-muted-foreground text-xs">Proveedor</TableHead>
                <TableHead className="text-muted-foreground text-xs">SKU</TableHead>
                <TableHead className="text-right text-muted-foreground text-xs">Costo proveedor</TableHead>
                <TableHead className="text-center text-muted-foreground text-xs">Auto fulfillment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-sm">No hay mapeos. Crea el primero con "Nuevo mapeo".</TableCell></TableRow>
              ) : mappings.map((m) => (
                <TableRow key={m.id} className="border-border/50">
                  <TableCell className="font-medium text-sm">{m.marketplaceProductName}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{m.supplierName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{m.supplierSku}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{m.cost > 0 ? `$${m.cost.toFixed(2)}` : <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                  <TableCell className="text-center">
                    <Switch checked={m.autoFulfillment} onCheckedChange={(checked) => toggleMutation.mutate({ id: m.id, enabled: checked })} disabled={toggleMutation.isPending} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] w-full bg-card border-border p-0 overflow-hidden">
          <DialogHeader className="px-8 pt-6 pb-0 text-center">
            <DialogTitle className="text-xl font-bold">Nuevo mapeo de producto</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-1">Conecta un producto de Eneba con tu proveedor para el fulfillment automático.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-8 px-8 pt-4 pb-0">
            {STEP_LABELS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all", wizard.step > s.id ? "bg-primary border-primary text-primary-foreground" : wizard.step === s.id ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground")}>
                    {wizard.step > s.id ? <Check className="h-4 w-4" /> : s.id}
                  </div>
                  <span className={cn("text-xs font-medium whitespace-nowrap", wizard.step >= s.id ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
                </div>
                {i < STEP_LABELS.length - 1 && <div className={cn("w-12 h-0.5 mb-6 rounded transition-all shrink-0", wizard.step > s.id ? "bg-primary" : "bg-border")} />}
              </div>
            ))}
          </div>
          <div className="border-t border-border mx-8 mt-3" />

          <div className="px-8 py-4 min-h-[400px] flex flex-col items-center">
            <div className="w-full max-w-lg mx-auto">
              {/* STEP 1 */}
              {wizard.step === 1 && (
                <div className="space-y-5 text-center">
                  <div>
                    <Label className="text-sm font-semibold block mb-1">Selecciona el producto de Eneba</Label>
                    <p className="text-xs text-muted-foreground mb-4">Solo aparecen los productos sin proveedor asignado.</p>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Buscar por nombre o plataforma..." value={enebaSearch} onChange={(e) => setEnebaSearch(e.target.value)} className="pl-10 bg-secondary/50 border-border h-11 text-sm" autoFocus />
                    </div>
                    {enebaLoading ? (
                      <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                    ) : availableEnebaProducts.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm">
                        {enebaSearch ? `No hay productos que coincidan con "${enebaSearch}".` : "Todos los productos ya tienen un proveedor asignado."}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[260px] overflow-y-auto [scrollbar-width:none]">
                        {availableEnebaProducts.map((p) => (
                          <button key={p.id} onClick={() => setWizard(w => ({ ...w, marketplaceProductId: p.id }))} className={cn("w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all", wizard.marketplaceProductId === p.id ? "border-primary bg-primary/10" : "border-border bg-secondary/20 hover:bg-secondary/40")}>
                            <div className={cn("w-3.5 h-3.5 rounded-full shrink-0 border-2 transition-all", wizard.marketplaceProductId === p.id ? "bg-primary border-primary" : "border-muted-foreground/50")} />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">{p.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{p.platform} · {p.category}</p>
                            </div>
                            {wizard.marketplaceProductId === p.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {wizard.step === 2 && (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">Producto Eneba</p>
                      <p className="text-sm font-semibold">{selectedMarketplace?.name}</p>
                    </div>
                  </div>

                  <div className="text-left">
                    <Label className="text-sm font-semibold block mb-2">Proveedor</Label>
                    <Popover open={supplierPopoverOpen} onOpenChange={setSupplierPopoverOpen}>
                      <PopoverTrigger asChild>
                        <button type="button" className="w-full flex items-center justify-between gap-2 h-11 px-3 rounded-lg border bg-secondary/50 text-sm transition-colors border-border hover:bg-secondary/70">
                          <span className="flex items-center gap-2 truncate">
                            {wizard.supplierId ? (
                              <>{providers.find(s => s.id === wizard.supplierId)?.logo} {providers.find(s => s.id === wizard.supplierId)?.name}</>
                            ) : (
                              <span className="text-muted-foreground">Seleccionar proveedor...</span>
                            )}
                          </span>
                          {providersLoading ? <Loader2 className="h-4 w-4 animate-spin opacity-50" /> : <ChevronDown className="h-4 w-4 opacity-50" />}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-border bg-popover" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar proveedor..." className="h-10" />
                          <CommandList>
                            <CommandEmpty>No hay proveedores.</CommandEmpty>
                            <CommandGroup>
                              {providers.map((s) => (
                                <CommandItem key={s.id} value={s.name} onSelect={() => { setWizard(w => ({ ...w, supplierId: s.id, supplierProductId: "", selectedFixedPrice: null, customPrice: "" })); setSupplierSearch(""); setSupplierSearchCommitted(""); setSupplierPopoverOpen(false); }} className="gap-2">
                                  <span>{s.logo}</span><span>{s.name}</span>
                                  {wizard.supplierId === s.id && <Check className="h-4 w-4 ml-auto text-primary" />}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {wizard.supplierId && (
                    <div>
                      <Label className="text-sm font-semibold block mb-2">Buscar producto del proveedor <span className="text-muted-foreground font-normal text-xs">(USD)</span></Label>
                      <div className="flex gap-2 mb-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Ej: Steam, PS Plus..." value={supplierSearch} onChange={(e) => setSupplierSearch(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && supplierSearch.trim()) { setSupplierSearchCommitted(supplierSearch.trim()); setWizard(w => ({ ...w, supplierProductId: "", selectedFixedPrice: null, customPrice: "" })); } }} className="pl-10 bg-secondary/50 border-border h-11 text-sm" />
                        </div>
                        <Button onClick={() => { setSupplierSearchCommitted(supplierSearch.trim()); setWizard(w => ({ ...w, supplierProductId: "", selectedFixedPrice: null, customPrice: "" })); }} disabled={!supplierSearch.trim()} className="shrink-0 gap-2 h-11 px-6">
                          {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          Buscar
                        </Button>
                      </div>

                      {!supplierSearchCommitted ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Escribe el nombre del producto y haz clic en <strong>Buscar</strong>.</p>
                      ) : searchLoading ? (
                        <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                      ) : supplierResults.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">No se encontró "{supplierSearchCommitted}" en {selectedSupplier?.name}.</p>
                      ) : (
                        <div className="space-y-2 max-h-[280px] overflow-y-auto [scrollbar-width:none]">
                          {supplierResults.map((sp) => (
                            <button key={sp.id} onClick={() => setWizard(w => ({ ...w, supplierProductId: sp.id, selectedFixedPrice: null, customPrice: "" }))} className={cn("w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all", wizard.supplierProductId === sp.id ? "border-primary bg-primary/10" : "border-border bg-secondary/20 hover:bg-secondary/40")}>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm">{sp.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{sp.sku} · {sp.currency} · Stock: {sp.stock}</p>
                              </div>
                              <Badge variant="outline" className={cn("text-[11px] shrink-0", sp.priceType === "range" ? "border-accent/50 text-accent" : "border-primary/50 text-primary")}>{sp.priceType === "range" ? "Valor libre" : "Valor fijo"}</Badge>
                              {wizard.supplierProductId === sp.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {selectedSupplierProduct && (
                        <div className="mt-4 pt-4 border-t border-border">
                          {selectedSupplierProduct.priceType === "fixed" ? (
                            <div>
                              <Label className="text-sm font-semibold mb-3 flex items-center gap-2 block"><DollarSign className="h-4 w-4 text-primary" />Valor a comprar</Label>
                              <div className="flex flex-wrap gap-3">
                                {selectedSupplierProduct.fixedPrices?.map((price) => (
                                  <button key={price} onClick={() => setWizard(w => ({ ...w, selectedFixedPrice: price }))} className={cn("px-6 py-3 rounded-xl border text-sm font-mono font-semibold transition-all", wizard.selectedFixedPrice === price ? "border-primary bg-primary/15 text-primary" : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground")}>${price.toFixed(2)}</button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <Label className="text-sm font-semibold mb-2 flex items-center gap-2 block"><Sliders className="h-4 w-4 text-accent" />Valor a comprar <span className="text-muted-foreground font-normal text-xs">(${selectedSupplierProduct.minPrice}–${selectedSupplierProduct.maxPrice} USD)</span></Label>
                              <div className="relative max-w-[240px]">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">$</span>
                                <Input type="number" step="0.01" min={selectedSupplierProduct.minPrice} max={selectedSupplierProduct.maxPrice} value={wizard.customPrice} onChange={(e) => setWizard(w => ({ ...w, customPrice: e.target.value }))} className="pl-7 bg-secondary/50 border-border font-mono h-11 text-sm" placeholder={`${selectedSupplierProduct.minPrice}.00`} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between px-8 py-5 border-t border-border bg-secondary/20">
            <Button variant="ghost" onClick={wizard.step === 1 ? () => setOpen(false) : () => setWizard(w => ({ ...w, step: 1 }))} className="text-muted-foreground gap-1">
              <ChevronLeft className="h-4 w-4" />{wizard.step === 1 ? "Cancelar" : "Atrás"}
            </Button>
            {wizard.step < 2 ? (
              <Button onClick={() => setWizard(w => ({ ...w, step: 2 }))} disabled={!canAdvance} className="gap-1 px-6">Siguiente<ChevronRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={handleSave} disabled={!canAdvance || saveMutation.isPending} className="gap-2 px-6">
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Guardar mapeo
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Catalogo;
