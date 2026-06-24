import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://rent.itshop.ng";
}

export function daysBetween(startDate: string | Date, returnDate: string | Date) {
  const start = new Date(startDate);
  const end = new Date(returnDate);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
