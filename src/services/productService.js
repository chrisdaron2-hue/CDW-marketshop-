import { PRODUCTS_API_URL } from "../constants/api";

export async function loadProducts() {
  try {
    const response = await fetch(PRODUCTS_API_URL);
    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log("LOAD PRODUCTS ERROR:", error);
    return [];
  }
}

export async function saveProduct(product) {
  try {
    await fetch(PRODUCTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    return true;
  } catch (error) {
    console.log("SAVE PRODUCT ERROR:", error);
    return false;
  }
}