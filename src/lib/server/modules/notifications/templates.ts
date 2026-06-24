import { formatNaira } from "@/lib/utils";

export function orderConfirmationText(params: { name: string; reference: string; total: number }) {
  return `Hello ${params.name},

Your ITShop rental request ${params.reference} has been received.

Estimated total: ${formatNaira(params.total)}

An admin will review payment, documents, inventory, delivery, and any security deposit requirement.`;
}
