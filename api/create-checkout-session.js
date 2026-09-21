const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS_API_URL =
  "https://5u1qgteqj7.execute-api.eu-central-1.amazonaws.com/products";

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { productId } = req.body || {};

    const cleanProductId = String(productId || "").trim();

    if (!cleanProductId) {
      return res.status(400).json({
        error: "Product ID is required.",
      });
    }

    const productResponse = await fetch(
      `${PRODUCTS_API_URL}/${encodeURIComponent(cleanProductId)}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (productResponse.status === 404) {
      return res.status(404).json({
        error: "Product not found.",
      });
    }

    if (!productResponse.ok) {
      const productError = await productResponse.text();

      console.error(
        "Product lookup failed:",
        productResponse.status,
        productError
      );

      return res.status(502).json({
        error: "Unable to verify product.",
      });
    }

    const product = await productResponse.json();

    if (product.sold === true) {
      return res.status(409).json({
        error: "This product has already been sold.",
      });
    }

    const numericPrice = Number(product.price);

    if (
      !product.title ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      console.error(
        "Invalid product data:",
        product.id
      );

      return res.status(500).json({
        error: "The stored product data is invalid.",
      });
    }

    const unitAmount = Math.round(numericPrice * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",

            product_data: {
              name: String(product.title).slice(0, 127),

              metadata: {
                productId: String(product.id),
              },
            },

            unit_amount: unitAmount,
          },

          quantity: 1,
        },
      ],

      metadata: {
        productId: String(product.id),
        seller: String(product.seller || ""),
      },

      success_url:
        "https://cdw-marketshop.vercel.app/?payment=success&session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "https://cdw-marketshop.vercel.app/?payment=cancelled",
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return res.status(500).json({
      error: "Unable to create checkout session.",
    });
  }
};
