"use client";

import { create } from "zustand";

type UiStore = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen })
}));
