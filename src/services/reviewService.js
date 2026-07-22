import { REVIEWS_API_URL } from "../constants/api";

export async function fetchReviews() {
  try {
    const response = await fetch(REVIEWS_API_URL);
    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.log("LOAD REVIEWS ERROR:", error);
    return [];
  }
}

export async function createReview(review) {
  try {
    await fetch(REVIEWS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    });

    return true;
  } catch (error) {
    console.log("REVIEW ERROR:", error);
    return false;
  }
}