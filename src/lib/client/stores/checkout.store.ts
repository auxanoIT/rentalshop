"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CheckoutStore = {
  startDate: string;
  returnDate: string;
  purpose: string;
  setDates: (startDate: string, returnDate: string) => void;
  setPurpose: (purpose: string) => void;
};

function isoDateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      startDate: isoDateAfter(1),
      returnDate: isoDateAfter(8),
      purpose: "Training",
      setDates: (startDate, returnDate) => set({ startDate, returnDate }),
      setPurpose: (purpose) => set({ purpose })
    }),
    {
      name: "itshop-rental-checkout"
    }
  )
);
