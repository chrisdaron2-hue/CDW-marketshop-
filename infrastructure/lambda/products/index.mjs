import { randomUUID } from "node:crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const dynamoClient = new DynamoDBClient({});

const documentClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

function createResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function parseRequestBody(event) {
  if (!event?.body) {
    return {};
  }

  if (typeof event.body === "object") {
    return event.body;
  }

  return JSON.parse(event.body);
}

function cleanText(value, maximumLength = 200) {
  return typeof value === "string"
    ? value.trim().slice(0, maximumLength)
    : "";
}

async function getProducts() {
  const result = await documentClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
      Limit: 100,
    })
  );

  const products = result.Items || [];

  products.sort((firstProduct, secondProduct) =>
    String(secondProduct.createdAt || "").localeCompare(
      String(firstProduct.createdAt || "")
    )
  );

  return createResponse(200, products);
}

async function createProduct(event) {
  let requestBody;

  try {
    requestBody = parseRequestBody(event);
  } catch {
    return createResponse(400, {
      message: "The request body must contain valid JSON.",
    });
  }

  const title = cleanText(requestBody.title);
  const seller = cleanText(requestBody.seller);
  const category = cleanText(requestBody.category);
  const condition = cleanText(requestBody.condition);
  const price = cleanText(String(requestBody.price ?? ""), 50);

  if (!title || !seller || !category || !condition || !price) {
    return createResponse(400, {
      message:
        "Title, price, seller, category, and condition are required.",
    });
  }

  const images = Array.isArray(requestBody.images)
    ? requestBody.images
        .filter((image) => typeof image === "string" && image.trim())
        .slice(0, 3)
    : [];

  const imageUri =
    cleanText(requestBody.imageUri, 1000) ||
    images[0] ||
    null;

  const now = new Date().toISOString();

  const product = {
    id: cleanText(requestBody.id, 100) || randomUUID(),
    title,
    price,
    seller,
    category,
    condition,
    description: cleanText(requestBody.description, 2000),
    imageUri,
    images,
    sold: Boolean(requestBody.sold),
    rating:
      typeof requestBody.rating === "number"
        ? requestBody.rating
        : 5,
    ownerEmail: cleanText(requestBody.ownerEmail, 320),
    createdAt: requestBody.createdAt || now,
    updatedAt: now,
  };

  try {
    await documentClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: product,
        ConditionExpression: "attribute_not_exists(id)",
      })
    );

    return createResponse(201, product);
  } catch (error) {
    if (error?.name === "ConditionalCheckFailedException") {
      return createResponse(409, {
        message: "A product with this ID already exists.",
      });
    }

    throw error;
  }
}

async function deleteProduct(event) {
  const productId = decodeURIComponent(
    event?.pathParameters?.id || ""
  ).trim();

  if (!productId) {
    return createResponse(400, {
      message: "A product ID is required.",
    });
  }

  const result = await documentClient.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: productId,
      },
      ReturnValues: "ALL_OLD",
    })
  );

  if (!result.Attributes) {
    return createResponse(404, {
      message: "Product not found.",
    });
  }

  return createResponse(200, {
    message: "Product deleted successfully.",
    id: productId,
  });
}

export const handler = async (event) => {
  try {
    if (!process.env.TABLE_NAME) {
      console.error("TABLE_NAME environment variable is missing.");

      return createResponse(500, {
        message: "The product service is not configured correctly.",
      });
    }

    const method =
      event?.requestContext?.http?.method ||
      event?.httpMethod ||
      "";

    const path = event?.rawPath || event?.path || "";

    if (method === "GET" && path.endsWith("/products")) {
      return await getProducts();
    }

    if (method === "POST" && path.endsWith("/products")) {
      return await createProduct(event);
    }

    if (
      method === "DELETE" &&
      path.includes("/products/")
    ) {
      return await deleteProduct(event);
    }

    return createResponse(404, {
      message: "Route not found.",
    });
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);

    return createResponse(500, {
      message: "The product request could not be completed.",
    });
  }
};
