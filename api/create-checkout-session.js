const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "CDW Marketplace Test Product",
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],

      success_url:
        "https://marketplace-app-six-ebon.vercel.app/?payment=success",

      cancel_url:
        "https://marketplace-app-six-ebon.vercel.app/?payment=cancelled",
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
