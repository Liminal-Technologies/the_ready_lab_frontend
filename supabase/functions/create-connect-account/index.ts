import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CONNECT-ACCOUNT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if account already exists
    const { data: existingAccount } = await supabaseClient
      .from('stripe_connect_accounts')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    let accountId;

    if (existingAccount) {
      accountId = existingAccount.stripe_account_id;
      logStep("Existing account found", { accountId });
    } else {
      // Create new Connect account
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          user_id: user.id,
        },
      });
      accountId = account.id;
      logStep("New Connect account created", { accountId });

      // Save to database
      await supabaseClient
        .from('stripe_connect_accounts')
        .insert({
          user_id: user.id,
          stripe_account_id: accountId,
          account_status: 'pending',
          charges_enabled: false,
          payouts_enabled: false,
          details_submitted: false,
          onboarding_completed: false,
        });

      // Log audit event
      await supabaseClient.rpc('log_admin_action', {
        _action: 'create_connect_account',
        _entity_type: 'stripe_connect',
        _entity_id: user.id,
        _metadata: { account_id: accountId },
      });
    }

    // Create account link for onboarding
    const origin = req.headers.get("origin") || "http://localhost:3000";
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/settings?refresh=true`,
      return_url: `${origin}/settings?success=true`,
      type: 'account_onboarding',
    });

    logStep("Account link created", { url: accountLink.url });

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-connect-account", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
