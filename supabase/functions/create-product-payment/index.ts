import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get product ID from request
    const { productId } = await req.json();
    if (!productId) throw new Error("No productId provided");

    // Get the product from database
    const { data: product, error: productError } = await supabaseClient
      .from('digital_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) throw new Error("Product not found");

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create pending purchase record
    const { data: purchase, error: purchaseError } = await supabaseClient
      .from('purchases')
      .insert({
        user_id: user.id,
        product_id: productId,
        amount: parseFloat(product.price),
        currency: 'usd',
        status: 'pending',
      })
      .select()
      .single();

    if (purchaseError) throw purchaseError;
    console.log('Created pending purchase:', purchase.id);

    // Create one-time payment session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: Math.round(parseFloat(product.price) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      automatic_tax: {
        enabled: true,
      },
      payment_intent_data: {
        metadata: {
          product_id: productId,
          user_id: user.id,
          purchase_id: purchase.id,
        },
      },
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/products`,
      metadata: {
        product_id: productId,
        user_id: user.id,
        purchase_id: purchase.id,
      },
    });

    console.log('Created Stripe checkout session:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
