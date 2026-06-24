import { z } from "zod";

import { badRequest } from "@/lib/server/errors";
import {
  createDocumentRecord,
  updateDocumentReview
} from "@/lib/server/modules/documents/document.repository";
import { uploadPrivateObject } from "@/lib/server/modules/storage/r2.service";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
export const documentReviewStatuses = [
  "PENDING",
  "VALID",
  "INVALID",
  "NEEDS_RESUBMISSION",
  "SENT_BY_EMAIL"
] as const;

const uploadFieldsSchema = z.object({
  customerId: z.string().min(1),
  orderId: z.string().optional(),
  documentType: z.string().min(2)
});

export async function uploadCustomerDocument(formData: FormData) {
  const fields = uploadFieldsSchema.parse({
    customerId: formData.get("customerId"),
    orderId: formData.get("orderId") || undefined,
    documentType: formData.get("documentType")
  });
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw badRequest("Document file is required");
  }

  if (!allowedTypes.includes(file.type)) {
    throw badRequest("Only PDF, JPG, PNG, and WEBP files are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw badRequest("Maximum file size is 8MB");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `documents/${fields.customerId}/${Date.now()}-${safeName}`;
  await uploadPrivateObject({ key, body: buffer, contentType: file.type });

  return createDocumentRecord({
    ...fields,
    fileKey: key,
    fileName: safeName,
    mimeType: file.type,
    sizeBytes: file.size
  });
}

const documentReviewSchema = z.object({
  reviewStatus: z.enum(documentReviewStatuses),
  adminNote: z.string().optional()
});

export async function updateAdminDocumentReview(id: string, payload: unknown) {
  return updateDocumentReview(id, documentReviewSchema.parse(payload));
}
