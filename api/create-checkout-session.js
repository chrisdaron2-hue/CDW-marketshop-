const Stripe = require("stripe");
const { CognitoJwtVerifier } = require("aws-jwt-verify");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS_API_URL =
  "https://5u1qgteqj7.execute-api.eu-central-1.amazonaws.com/products";

const COGNITO_USER_POOL_ID = "us-east-1_vk65AJSaU";
const COGNITO_CLIENT_ID = "47289jp3e520qvch59jeuhf5ev";

const cognitoVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  tokenUse: "access",
  clientId: COGNITO_CLIENT_ID,
});

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const authorizationHeader =
      req.headers.authorization || "";

    if (!authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const accessToken = authorizationHeader
      .slice(7)
      .trim();

    if (!accessToken) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    let authPayload;

    try {
      authPayload = await cognitoVerifier.verify(
        accessToken
      );
    } catch (error) {
      console.error(
        "Cognito token verification failed:",
        error.message
      );

      return res.status(401).json({
        error: "Invalid or expired authentication token.",
      });
    }

    const buyerId = String(
      authPayload.sub || ""
    ).trim();

    if (!buyerId) {
      return res.status(401).json({
        error: "Authenticated user ID is missing.",
      });
    }

    const { productId } = req.body || {};

    const cleanProductId = String(
      productId || ""
    ).trim();

    if (!cleanProductId) {
      return res.status(400).json({
        error: "Product ID is required.",
      });
    }

    const productResponse = await fetch(
      `${PRODUCTS_API_URL}/${encodeURIComponent(
        cleanProductId
      )}`,
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
      const productError =
        await productResponse.text();

      console.error(
        "Product lookup failed:",
        productResponse.status,
        productError
      );

      return res.status(502).json({
        error: "Unable to verify product.",
      });
    }

    const product =
      await productResponse.json();

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

    const unitAmount =
      Math.round(numericPrice * 100);

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "eur",

              product_data: {
                name: String(
                  product.title
                ).slice(0, 127),

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
          sellerId: String(product.sellerId || ""),

          // Verified Cognito identity.
          buyerId,

          // Temporary backwards compatibility
          // with the existing webhook.
          buyer: buyerId,
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
    console.error(
      "Stripe checkout error:",
      error
    );

    return res.status(500).json({
      error:
        "Unable to create checkout session.",
    });
  }
};
