"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchJson } from "@/lib/client/api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => fetchJson<Record<string, number>>("/api/admin/dashboard")
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => fetchJson<{ orders: unknown[] }>("/api/orders")
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => fetchJson<{ products: unknown[] }>("/api/products")
  });
}
