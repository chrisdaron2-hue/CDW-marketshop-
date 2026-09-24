import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ORDERS_API_URL =
  "https://pnux75snm55hv4nea3tnellfxu0nknwn.lambda-url.us-east-1.on.aws/";

const PRODUCTS_API_URL =
  "https://5u1qgteqj7.execute-api.eu-central-1.amazonaws.com/products";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get("stripe-signature");

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is missing.");

      return new Response(
        JSON.stringify({
          error: "Webhook secret not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!signature) {
      return new Response(
        JSON.stringify({
          error: "Missing Stripe signature",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const rawBody = await request.text();

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (error) {
      console.error(
        "Webhook signature error:",
        error.message
      );

      return new Response(
        JSON.stringify({
          error: "Invalid webhook signature",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Stripe checkout completed:", {
        sessionId: session.id,
        paymentStatus: session.payment_status,
        productId: session.metadata?.productId,
        buyer: session.metadata?.buyer,
        seller: session.metadata?.seller,
        amountTotal: session.amount_total,
      });

      /*
       * Do not fulfill an order unless Stripe says
       * the payment has actually been paid.
       */
      if (session.payment_status !== "paid") {
        console.log(
          "Checkout completed but payment is not paid:",
          session.id
        );

        return new Response(
          JSON.stringify({
            received: true,
            fulfilled: false,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const productId = session.metadata?.productId;
      const seller = session.metadata?.seller || "";
      const sellerId = session.metadata?.sellerId || "";

      // Verified Cognito identity from checkout metadata.
      // Fall back to the old "buyer" field for older sessions.
      const buyerId =
        session.metadata?.buyerId ||
        session.metadata?.buyer ||
        "";

      // Temporary backwards compatibility.
      const buyer = buyerId;

      if (!productId) {
        console.error(
          "Stripe session is missing productId metadata:",
          session.id
        );

        return new Response(
          JSON.stringify({
            received: true,
            fulfilled: false,
            error: "Missing product ID",
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      try {
        /*
         * Get the product title from the Stripe
         * Checkout line item.
         */
        const lineItems =
          await stripe.checkout.sessions.listLineItems(
            session.id,
            {
              limit: 1,
            }
          );

        const title =
          lineItems.data[0]?.description ||
          "Purchased product";

        /*
         * Check whether this Stripe session has
         * already been recorded.
         *
         * Stripe can retry webhook events, so this
         * prevents duplicate orders.
         */
        const ordersResponse = await fetch(
          ORDERS_API_URL
        );

        if (!ordersResponse.ok) {
          throw new Error(
            `Could not load orders: ${ordersResponse.status}`
          );
        }

        const orders = await ordersResponse.json();

        const existingOrder =
          Array.isArray(orders) &&
          orders.some(
            (order) =>
              order.id === session.id ||
              order.stripeSessionId === session.id
          );

        if (!existingOrder) {
          const order = {
            id: session.id,
            stripeSessionId: session.id,
            productId,
            title,
            price:
              Number(session.amount_total || 0) / 100,
            seller,
            sellerId,
            buyerId,
            buyer,
            purchasedAt: new Date().toISOString(),
            paymentStatus: session.payment_status,
          };

          const orderResponse = await fetch(
            ORDERS_API_URL,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(order),
            }
          );

          if (
            !orderResponse.ok &&
            orderResponse.status !== 409
          ) {
            const orderError =
              await orderResponse.text();

            throw new Error(
              `Order creation failed: ${orderResponse.status} ${orderError}`
            );
          }

          console.log(
            "Order recorded:",
            session.id
          );
        } else {
          console.log(
            "Order already recorded:",
            session.id
          );
        }

        /*
         * Mark the purchased product as sold.
         */
        const productResponse = await fetch(
          `${PRODUCTS_API_URL}/${encodeURIComponent(
            productId
          )}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sold: true,
            }),
          }
        );

        if (!productResponse.ok) {
          const productError =
            await productResponse.text();

          throw new Error(
            `Product update failed: ${productResponse.status} ${productError}`
          );
        }

        console.log(
          "Product marked sold:",
          productId
        );
      } catch (error) {
        console.error(
          "Stripe fulfillment error:",
          error
        );

        /*
         * Return 500 so Stripe can retry the webhook
         * if an AWS API temporarily fails.
         */
        return new Response(
          JSON.stringify({
            error: "Order fulfillment failed",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({
        received: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  },
};
