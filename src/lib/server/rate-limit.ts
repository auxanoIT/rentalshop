import type { NextRequest } from "next/server";

import { rateLimited } from "@/lib/server/errors";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function assertRateLimit(
  request: NextRequest,
  scope: string,
  options: { limit: number; windowMs: number } = { limit: 12, windowMs: 60_000 }
) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const key = `${scope}:${ip}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }

  current.count += 1;
  if (current.count > options.limit) {
    throw rateLimited();
  }
}
