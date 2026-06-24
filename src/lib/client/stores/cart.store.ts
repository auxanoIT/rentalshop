"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  variantSlug?: string;
  variantName?: string;
  name: string;
  dailyRate: number;
  image: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

export function getCartItemKey(item: CartItem) {
  return item.variantSlug ?? item.slug;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const itemKey = getCartItemKey(item);
          const existing = state.items.find((cartItem) => getCartItemKey(cartItem) === itemKey);
          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                getCartItemKey(cartItem) === itemKey
                  ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                  : cartItem
              )
            };
          }
          return { items: [...state.items, item] };
        }),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            getCartItemKey(item) === slug ? { ...item, quantity: Math.max(1, quantity) } : item
          )
        })),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => getCartItemKey(item) !== slug)
        })),
      clear: () => set({ items: [] })
    }),
    {
      name: "itshop-rental-cart"
    }
  )
);

export function getCartSubtotal(items: CartItem[], rentalDays: number) {
  return items.reduce((sum, item) => sum + item.dailyRate * item.quantity * rentalDays, 0);
}
