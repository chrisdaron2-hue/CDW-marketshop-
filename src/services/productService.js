import {
  IMAGE_VIEW_API_URL,
  PRODUCTS_API_URL,
} from "../constants/api";

function isHttpUrl(value) {
  return (
    typeof value === "string" &&
    (value.startsWith("http://") || value.startsWith("https://"))
  );
}

export async function getImageViewUrl(imageValue) {
  if (!imageValue) {
    return null;
  }

  // Keep older products that already contain a normal image URL.
  if (isHttpUrl(imageValue)) {
    return imageValue;
  }

  try {
    const endpoint =
      `${IMAGE_VIEW_API_URL}?key=${encodeURIComponent(imageValue)}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("IMAGE VIEW API ERROR:", errorText);
      return null;
    }

    const data = await response.json();

    return data.imageUrl || null;
  } catch (error) {
    console.log("LOAD IMAGE URL ERROR:", error);
    return null;
  }
}

export async function hydrateProductImages(product) {
  const storedImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product.imageUri
        ? [product.imageUri]
        : [];

  const temporaryImageUrls = await Promise.all(
    storedImages.map((image) => getImageViewUrl(image))
  );

  const validImageUrls = temporaryImageUrls.filter(Boolean);

  return {
    ...product,

    // Preserve the private S3 keys for future use.
    imageObjectKey: storedImages[0] || null,
    imageObjectKeys: storedImages,

    // Temporary URLs used by React Native Image components.
    imageUri: validImageUrls[0] || null,
    images: validImageUrls,
  };
}

export async function loadProducts() {
  try {
    const response = await fetch(PRODUCTS_API_URL);

    if (!response.ok) {
      throw new Error(
        `Products request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    const productsWithImages = await Promise.all(
      data.map((product) => hydrateProductImages(product))
    );

    return productsWithImages;
  } catch (error) {
    console.log("LOAD PRODUCTS ERROR:", error);
    return [];
  }
}

export async function saveProduct(product) {
  try {
    const response = await fetch(PRODUCTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("SAVE PRODUCT API ERROR:", errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.log("SAVE PRODUCT ERROR:", error);
    return false;
  }
}