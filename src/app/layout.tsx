import type { Metadata, Viewport } from "next";

import "./globals.css";

import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ITShop Equipment Leasing | IT Equipment Rental in Nigeria",
  description:
    "Rent laptops and IT equipment in Nigeria for training, exams, offices, events, and temporary teams.",
  path: "/"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#087443"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        <Providers>
          <SiteHeader />
          {children}
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
