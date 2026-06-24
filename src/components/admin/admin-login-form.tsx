"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm({ nextPath = "/admin/dashboard" }: { nextPath?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });

    setLoading(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error?.message ?? "Unable to login");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border bg-card p-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin login</h1>
        <p className="mt-2 text-sm text-muted-foreground">Use your ITShop admin credentials.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Sign in
      </Button>
    </form>
  );
}
