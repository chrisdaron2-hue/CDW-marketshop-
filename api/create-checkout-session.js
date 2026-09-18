const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const {
      productId,
      title,
      price,
      seller,
      buyer,
    } = req.body || {};

    const numericPrice = Number(price);

    if (
      !title ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return res.status(400).json({
        error: "Valid product title and price are required.",
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
              name: String(title).slice(0, 127),

              metadata: {
                productId: String(productId || ""),
              },
            },

            unit_amount: unitAmount,
          },

          quantity: 1,
        },
      ],

      metadata: {
        productId: String(productId || ""),
        seller: String(seller || ""),
        buyer: String(buyer || ""),
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
    console.error("Stripe error:", error);

    return res.status(500).json({
      error: "Unable to create checkout session",
    });
  }
};
