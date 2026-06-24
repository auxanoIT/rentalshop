import { Resend } from "resend";

import OrderConfirmationEmail from "@/emails/order-confirmation";
import { formatNaira } from "@/lib/utils";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendOrderConfirmation(params: {
  to: string;
  name: string;
  reference: string;
  total: number;
}) {
  const client = getResend();
  if (!client) return { skipped: true };

  return client.emails.send(
    {
      from: process.env.RESEND_FROM_EMAIL ?? "ITShop Rentals <onboarding@resend.dev>",
      to: params.to,
      subject: `Rental request received: ${params.reference}`,
      react: OrderConfirmationEmail(params)
    },
    {
      headers: {
        "Idempotency-Key": `order-confirmation-${params.reference}`
      }
    }
  );
}

export async function sendAdminOrderAlert(params: {
  reference: string;
  customerName: string;
  total: number;
}) {
  const client = getResend();
  const adminEmail = process.env.ADMIN_ALERT_EMAIL;
  if (!client || !adminEmail) return { skipped: true };

  return client.emails.send(
    {
      from: process.env.RESEND_FROM_EMAIL ?? "ITShop Rentals <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New rental order ${params.reference}`,
      html: `<p>${params.customerName} submitted rental order <strong>${params.reference}</strong>.</p><p>Total: ${formatNaira(params.total)}</p>`
    },
    {
      headers: {
        "Idempotency-Key": `admin-order-alert-${params.reference}`
      }
    }
  );
}
