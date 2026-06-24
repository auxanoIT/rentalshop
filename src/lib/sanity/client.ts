import { createClient, type SanityClient } from "@sanity/client";

let client: SanityClient | null = null;

export function hasSanityConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.NEXT_PUBLIC_SANITY_DATASET);
}

export function getSanityClient() {
  if (!hasSanityConfig()) return null;

  if (!client) {
    client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      apiVersion: "2026-03-01",
      useCdn: true,
      token: process.env.SANITY_API_READ_TOKEN
    });
  }

  return client;
}
