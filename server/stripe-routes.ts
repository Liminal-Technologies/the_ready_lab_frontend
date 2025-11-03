import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "./storage";

const router = Router();

let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
  });
} else {
  console.warn("[STRIPE] STRIPE_SECRET_KEY not set - Stripe routes will return errors");
}

router.post("/api/stripe/webhook", async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  const signature = req.headers["stripe-signature"];
  
  if (!signature) {
    return res.status(400).send("No signature");
  }

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[STRIPE-WEBHOOK] STRIPE_WEBHOOK_SECRET not set");
      return res.status(500).send("Webhook secret not configured");
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );

    console.log(`[STRIPE-WEBHOOK] Event received: ${event.type} - ${event.id}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[STRIPE-WEBHOOK] Checkout session completed: ${session.id}`);
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[STRIPE-WEBHOOK] Subscription updated: ${subscription.id}`);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[STRIPE-WEBHOOK] Invoice paid: ${invoice.id}`);
        break;
      }

      default:
        console.log(`[STRIPE-WEBHOOK] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(`[STRIPE-WEBHOOK] Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

router.post("/api/stripe/create-checkout", async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  try {
    const { trackTitle, userId, userEmail } = req.body;

    if (!trackTitle || !userId || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: trackTitle,
            },
            unit_amount: 9900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/payment-success?track=${encodeURIComponent(trackTitle)}`,
      cancel_url: `${req.headers.origin}/courses`,
      metadata: {
        track_title: trackTitle,
        user_id: userId,
      },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/stripe/create-connect-account", async (req: Request, res: Response) => {
  if (!stripe) {
    return res.status(503).json({ error: "Stripe not configured" });
  }

  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    res.json({ accountId: account.id });
  } catch (error: any) {
    console.error("Error creating Connect account:", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as stripeRouter };
