import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page py-20">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you requested does not exist.</p>
      <Button asChild className="mt-6">
        <Link href="/">Go home</Link>
      </Button>
    </main>
  );
}
