import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

function getR2Client() {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? ""
      }
    });
  }

  return client;
}

export function hasR2Config() {
  return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
}

export async function uploadPrivateObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  if (!hasR2Config()) {
    return {
      key: params.key,
      bucket: process.env.R2_PRIVATE_BUCKET ?? "itshop-private",
      mock: true
    };
  }

  const bucket = process.env.R2_PRIVATE_BUCKET ?? "itshop-private";
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType
    })
  );

  return { key: params.key, bucket };
}

export async function getPrivateSignedUrl(key: string, expiresIn = 300) {
  if (!hasR2Config()) {
    return `https://example.invalid/mock-private/${encodeURIComponent(key)}`;
  }

  return getSignedUrl(
    getR2Client(),
    new GetObjectCommand({
      Bucket: process.env.R2_PRIVATE_BUCKET ?? "itshop-private",
      Key: key
    }),
    { expiresIn }
  );
}
