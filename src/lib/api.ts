/**
 * API Service — conecta el frontend React con el backend FastAPI.
 * Configura VITE_API_URL en tu .env (ej: VITE_API_URL=http://localhost:8000)
 */

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${BASE_URL}${pathNorm}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types (espejo de los modelos FastAPI) ────────────────────────────────────

export interface DashboardStats {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  codes_sold: number;
  revenue_change_pct: number;
  expenses_change_pct: number;
  profit_change_pct: number;
  codes_sold_change_pct: number;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  request_id: string;
  status: "completed" | "pending" | "refunded" | "processing";
  provider: string;
  sold_on: string;
  cost_price: number;
  sale_price: number;
  created_at: string;
  items?: OrderItem[];
}

export interface Provider {
  id: string;
  name: string;
  status: "connected" | "error" | "unknown";
  balance?: number;
  invested?: number;
  codes_purchased?: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  currency?: string;
  stock?: number;
  provider?: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const fetchStats = (): Promise<DashboardStats> =>
  apiFetch<DashboardStats>("/api/stats");

// ─── Orders ──────────────────────────────────────────────────────────────────

export interface OrdersParams {
  page?: number;
  page_size?: number;
  status?: string;
  provider?: string;
  sold_on?: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  page_size: number;
}

export const fetchOrders = (params: OrdersParams = {}): Promise<OrdersResponse> => {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.page_size) qs.set("page_size", String(params.page_size));
  if (params.status && params.status !== "all") qs.set("status", params.status);
  if (params.provider && params.provider !== "all") qs.set("provider", params.provider);
  if (params.sold_on && params.sold_on !== "all") qs.set("sold_on", params.sold_on);
  return apiFetch<OrdersResponse>(`/api/orders?${qs.toString()}`);
};

export const fetchOrderDetail = (requestId: string): Promise<Order> =>
  apiFetch<Order>(`/api/orders/${requestId}`);

// ─── Providers ───────────────────────────────────────────────────────────────

export interface ProviderStatus {
  name: string;
  status: "connected" | "error";
  message?: string;
  balance?: number;
}

const providerToKey: Record<string, string> = { Bamboo: "bamboo", EZ: "ez", CardOne: "cardone" };

export const fetchProviderStatus = (provider?: string): Promise<ProviderStatus[]> => {
  // Verificamos que sea un string antes de usar toLowerCase para evitar errores con React Query Context
  const isString = typeof provider === "string";
  const qs = isString ? `?provider=${encodeURIComponent(providerToKey[provider] ?? provider.toLowerCase())}` : "";
  return apiFetch<ProviderStatus[]>(`/admin/test-providers${qs}`);
};

// ─── Catalogs ────────────────────────────────────────────────────────────────

export const fetchBambooCatalog = (): Promise<CatalogProduct[]> =>
  apiFetch<CatalogProduct[]>("/admin/catalogs/bamboo");

export const fetchEZCatalog = (): Promise<CatalogProduct[]> =>
  apiFetch<CatalogProduct[]>("/admin/catalogs/ez");

export const fetchCardOneCatalog = (): Promise<CatalogProduct[]> =>
  apiFetch<CatalogProduct[]>("/admin/catalogs/cardone");

// ─── Webhook (Eneba) ─────────────────────────────────────────────────────────

export interface EnebaWebhookPayload {
  [key: string]: unknown;
}

export const triggerEnebaWebhook = (payload: EnebaWebhookPayload): Promise<{ ok: boolean }> =>
  apiFetch<{ ok: boolean }>("/webhooks/eneba", {
    method: "POST",
    body: JSON.stringify(payload),
  });
