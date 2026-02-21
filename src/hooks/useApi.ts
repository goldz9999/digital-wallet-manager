/**
 * React Query hooks — envuelven las llamadas a la API con caché y loading states.
 */

import { useQuery } from "@tanstack/react-query";
import {
  fetchStats,
  fetchOrders,
  fetchOrderDetail,
  fetchProviderStatus,
  fetchBambooCatalog,
  fetchEZCatalog,
  fetchCardOneCatalog,
  type OrdersParams,
} from "@/lib/api";

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
    staleTime: 30_000, // refresca cada 30 s
    retry: 2,
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useOrders(params: OrdersParams = {}) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => fetchOrders(params),
    staleTime: 15_000,
    retry: 2,
  });
}

export function useOrderDetail(requestId: string) {
  return useQuery({
    queryKey: ["order", requestId],
    queryFn: () => fetchOrderDetail(requestId),
    enabled: !!requestId,
    retry: 2,
  });
}

// ─── Providers ───────────────────────────────────────────────────────────────

export function useProviderStatus() {
  return useQuery({
    queryKey: ["provider-status"],
    queryFn: fetchProviderStatus,
    staleTime: 60_000,
    retry: 1,
  });
}

// ─── Catalogs ────────────────────────────────────────────────────────────────

export function useBambooCatalog(enabled = false) {
  return useQuery({
    queryKey: ["catalog-bamboo"],
    queryFn: fetchBambooCatalog,
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useEZCatalog(enabled = false) {
  return useQuery({
    queryKey: ["catalog-ez"],
    queryFn: fetchEZCatalog,
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useCardOneCatalog(enabled = false) {
  return useQuery({
    queryKey: ["catalog-cardone"],
    queryFn: fetchCardOneCatalog,
    enabled,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
