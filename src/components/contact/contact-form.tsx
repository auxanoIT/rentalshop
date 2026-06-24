"use client";

import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setState("error");
      setError(data?.error?.message ?? "Unable to send message");
      return;
    }

    event.currentTarget.reset();
    setState("success");
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border bg-card p-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required />
      </div>
      {state === "success" ? <p className="text-sm text-primary">Message received.</p> : null}
      {state === "error" ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? <Loader2 className="animate-spin" aria-hidden /> : null}
        Send message
      </Button>
    </form>
  );
}
