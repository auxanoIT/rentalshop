import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const secret = request.headers.get("x-sanity-secret") ?? new URL(request.url).searchParams.get("secret");
  if (!process.env.SANITY_REVALIDATE_SECRET || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { _type?: string };
  if (body?._type) {
    revalidateTag(body._type, "max");
  }
  revalidateTag("sanity-pages", "max");

  return Response.json({ revalidated: true, now: Date.now() });
}
