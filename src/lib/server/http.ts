import { NextResponse } from "next/server";

import { toErrorResponse } from "@/lib/server/errors";

export async function withApiError<T>(handler: () => Promise<T | NextResponse>) {
  try {
    const result = await handler();
    if (result instanceof NextResponse) {
      return result;
    }
    return NextResponse.json(result);
  } catch (error) {
    return toErrorResponse(error);
  }
}

export function created<T>(payload: T) {
  return NextResponse.json(payload, { status: 201 });
}
