import { randomUUID } from "node:crypto";
import {
  S3Client,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  try {
    let requestBody;

    try {
      requestBody =
        typeof event.body === "string"
          ? JSON.parse(event.body)
          : event.body || {};
    } catch {
      return createResponse(400, {
        message: "The request body must contain valid JSON.",
      });
    }

    const contentType = String(
      requestBody.contentType || ""
    ).toLowerCase();

    if (!ALLOWED_IMAGE_TYPES[contentType]) {
      return createResponse(400, {
        message:
          "Unsupported image type. Use JPEG, PNG, or WebP.",
      });
    }

    if (!process.env.BUCKET_NAME) {
      console.error("BUCKET_NAME environment variable is missing.");

      return createResponse(500, {
        message: "The upload service is not configured correctly.",
      });
    }

    const extension = ALLOWED_IMAGE_TYPES[contentType];
    const objectKey = `products/${randomUUID()}.${extension}`;
    const expiresIn = 300;

    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(
      s3Client,
      command,
      { expiresIn }
    );

    return createResponse(200, {
      uploadUrl,
      objectKey,
      expiresIn,
    });
  } catch (error) {
    console.error("CREATE UPLOAD URL ERROR:", error);

    return createResponse(500, {
      message: "Unable to create the upload URL.",
    });
  }
};