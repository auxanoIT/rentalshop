import { getPrisma, hasDatabaseUrl } from "@/lib/server/db/prisma";

export async function createDocumentRecord(data: {
  customerId: string;
  orderId?: string;
  documentType: string;
  fileKey: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  if (!hasDatabaseUrl()) {
    return {
      id: `local_doc_${Date.now()}`,
      reviewStatus: "PENDING",
      ...data
    };
  }

  return getPrisma().customerDocument.create({
    data
  });
}

export async function listDocuments() {
  if (!hasDatabaseUrl()) return [];

  return getPrisma().customerDocument.findMany({
    include: { customer: true, order: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function updateDocumentReview(
  id: string,
  data: {
    reviewStatus: "PENDING" | "VALID" | "INVALID" | "NEEDS_RESUBMISSION" | "SENT_BY_EMAIL";
    adminNote?: string;
  }
) {
  return getPrisma().customerDocument.update({
    where: { id },
    data,
    include: { customer: true, order: true }
  });
}
