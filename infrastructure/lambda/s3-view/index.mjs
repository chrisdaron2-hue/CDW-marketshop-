import {
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({});

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
    const objectKey = event?.queryStringParameters?.key || "";

    const decodedKey = decodeURIComponent(objectKey);

    if (!decodedKey || !decodedKey.startsWith("products/")) {
      return createResponse(400, {
        message: "A valid product image key is required.",
      });
    }

    if (!process.env.BUCKET_NAME) {
      console.error("BUCKET_NAME environment variable is missing.");

      return createResponse(500, {
        message: "The image service is not configured correctly.",
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: decodedKey,
    });

    const expiresIn = 3600;

    const imageUrl = await getSignedUrl(s3Client, command, {
      expiresIn,
    });

    return createResponse(200, {
      imageUrl,
      objectKey: decodedKey,
      expiresIn,
    });
  } catch (error) {
    console.error("CREATE IMAGE URL ERROR:", error);

    return createResponse(500, {
      message: "Unable to create the image URL.",
    });
  }
};