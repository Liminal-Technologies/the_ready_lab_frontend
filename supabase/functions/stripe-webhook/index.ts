import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const logEvent = (event: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${event}${detailsStr}`);
};

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logEvent("ERROR", { message: "STRIPE_WEBHOOK_SECRET not set" });
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logEvent("Event received", { type: event.type, id: event.id });

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logEvent("Checkout session completed", { sessionId: session.id, mode: session.mode });

        if (session.mode === "payment") {
          // Handle digital product purchase
          const purchaseId = session.metadata?.purchase_id;
          const productId = session.metadata?.product_id;
          const userId = session.metadata?.user_id;

          if (purchaseId && productId && userId) {
            logEvent("Processing digital product purchase", { purchaseId, productId, userId });

            // Get payment intent to retrieve the ID
            const paymentIntentId = session.payment_intent as string;
            
            // Update purchase status to completed
            const { error: updateError } = await supabase
              .from('purchases')
              .update({
                status: 'completed',
                stripe_payment_intent_id: paymentIntentId,
                stripe_session_id: session.id,
                purchased_at: new Date().toISOString(),
              })
              .eq('id', purchaseId);

            if (updateError) {
              logEvent("ERROR updating purchase", { error: updateError });
            } else {
              logEvent("Purchase completed", { purchaseId });

              // Increment downloads count
              await supabase
                .from('digital_products')
                .update({ downloads_count: supabase.raw('downloads_count + 1') })
                .eq('id', productId);

              // Get product and educator info for payout
              const { data: product } = await supabase
                .from('digital_products')
                .select('educator_id, price, platform_fee_percentage')
                .eq('id', productId)
                .single();

              if (product) {
                // Check if educator has Stripe Connect account
                const { data: connectAccount } = await supabase
                  .from('stripe_connect_accounts')
                  .select('stripe_account_id, charges_enabled, payouts_enabled')
                  .eq('user_id', product.educator_id)
                  .single();

                if (connectAccount?.charges_enabled && connectAccount?.payouts_enabled) {
                  // Calculate platform fee and educator payout
                  const totalAmount = parseFloat(product.price) * 100; // in cents
                  const platformFee = Math.round(totalAmount * (product.platform_fee_percentage / 100));
                  const educatorAmount = totalAmount - platformFee;

                  try {
                    // Create transfer to educator's Connect account
                    const transfer = await stripe.transfers.create({
                      amount: educatorAmount,
                      currency: 'usd',
                      destination: connectAccount.stripe_account_id,
                      description: `Sale of digital product ${productId}`,
                      metadata: {
                        product_id: productId,
                        purchase_id: purchaseId,
                        educator_id: product.educator_id,
                      },
                    });

                    logEvent("Transfer created for educator", { 
                      transferId: transfer.id, 
                      amount: educatorAmount, 
                      educatorId: product.educator_id 
                    });
                  } catch (transferError) {
                    logEvent("ERROR creating transfer", { error: transferError.message });
                  }
                } else {
                  logEvent("Educator Connect account not ready for payouts", { educatorId: product.educator_id });
                }
              }

              // Log audit event
              await supabase.rpc('log_admin_action', {
                _action: 'digital_product_purchased',
                _entity_type: 'purchase',
                _entity_id: userId,
                _metadata: { purchase_id: purchaseId, product_id: productId, session_id: session.id },
              });
            }
          }
        } else if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          const email = (customer as Stripe.Customer).email;

          // Get user by email
          const { data: users } = await supabase.auth.admin.listUsers();
          const user = users?.users.find(u => u.email === email);

          if (user) {
            // Upsert subscription
            await supabase.from('stripe_subscriptions').upsert({
              user_id: user.id,
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              stripe_product_id: subscription.items.data[0].price.product as string,
              stripe_price_id: subscription.items.data[0].price.id,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            }, { onConflict: 'stripe_subscription_id' });

            // Update profile subscription status
            await supabase.from('profiles').update({
              subscription_status: 'active',
            }).eq('id', user.id);

            // Log audit event
            await supabase.rpc('log_admin_action', {
              _action: 'subscription_created',
              _entity_type: 'subscription',
              _entity_id: user.id,
              _metadata: { subscription_id: subscription.id, product_id: subscription.items.data[0].price.product },
            });
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        logEvent("Invoice paid", { invoiceId: invoice.id });

        // Get user by customer
        const { data: users } = await supabase.auth.admin.listUsers();
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        const email = (customer as Stripe.Customer).email;
        const user = users?.users.find(u => u.email === email);

        if (user) {
          // Insert invoice record
          await supabase.from('stripe_invoices').insert({
            user_id: user.id,
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer as string,
            stripe_subscription_id: invoice.subscription as string || null,
            amount_due: invoice.amount_due,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            status: invoice.status || 'paid',
            invoice_pdf: invoice.invoice_pdf || null,
            hosted_invoice_url: invoice.hosted_invoice_url || null,
            period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
            period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
          });

          // Log audit event
          await supabase.rpc('log_admin_action', {
            _action: 'invoice_paid',
            _entity_type: 'invoice',
            _entity_id: user.id,
            _metadata: { invoice_id: invoice.id, amount: invoice.amount_paid },
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logEvent("Invoice payment failed", { invoiceId: invoice.id });

        const { data: users } = await supabase.auth.admin.listUsers();
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        const email = (customer as Stripe.Customer).email;
        const user = users?.users.find(u => u.email === email);

        if (user) {
          // Insert invoice record
          await supabase.from('stripe_invoices').insert({
            user_id: user.id,
            stripe_invoice_id: invoice.id,
            stripe_customer_id: invoice.customer as string,
            stripe_subscription_id: invoice.subscription as string || null,
            amount_due: invoice.amount_due,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            status: 'failed',
            invoice_pdf: invoice.invoice_pdf || null,
            hosted_invoice_url: invoice.hosted_invoice_url || null,
            period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
            period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
          });

          // Log audit event
          await supabase.rpc('log_admin_action', {
            _action: 'invoice_payment_failed',
            _entity_type: 'invoice',
            _entity_id: user.id,
            _metadata: { invoice_id: invoice.id, amount: invoice.amount_due },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logEvent("Subscription updated", { subscriptionId: subscription.id });

        // Update subscription record
        await supabase.from('stripe_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id);

        // Get user ID from subscription
        const { data: subRecord } = await supabase
          .from('stripe_subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (subRecord) {
          // Update profile if subscription canceled
          if (subscription.status === 'canceled') {
            await supabase.from('profiles').update({
              subscription_status: 'inactive',
            }).eq('id', subRecord.user_id);
          }

          // Log audit event
          await supabase.rpc('log_admin_action', {
            _action: 'subscription_updated',
            _entity_type: 'subscription',
            _entity_id: subRecord.user_id,
            _metadata: { subscription_id: subscription.id, status: subscription.status },
          });
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        logEvent("Connect account updated", { accountId: account.id });

        // Update Connect account record
        await supabase.from('stripe_connect_accounts')
          .update({
            account_status: account.charges_enabled && account.payouts_enabled ? 'active' : 'pending',
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted || false,
            onboarding_completed: account.details_submitted || false,
            requirements_due_by: account.requirements?.current_deadline 
              ? new Date(account.requirements.current_deadline * 1000).toISOString() 
              : null,
            requirements_fields: account.requirements?.currently_due || [],
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_account_id', account.id);

        // Get user ID
        const { data: connectRecord } = await supabase
          .from('stripe_connect_accounts')
          .select('user_id')
          .eq('stripe_account_id', account.id)
          .single();

        if (connectRecord) {
          // Log audit event
          await supabase.rpc('log_admin_action', {
            _action: 'connect_account_updated',
            _entity_type: 'stripe_connect',
            _entity_id: connectRecord.user_id,
            _metadata: { 
              account_id: account.id, 
              charges_enabled: account.charges_enabled,
              payouts_enabled: account.payouts_enabled 
            },
          });
        }
        break;
      }

      case "payout.paid":
      case "payout.failed": {
        const payout = event.data.object as Stripe.Payout;
        logEvent(`Payout ${payout.status}`, { payoutId: payout.id });

        // Get user from Connect account
        const { data: connectAccount } = await supabase
          .from('stripe_connect_accounts')
          .select('user_id')
          .eq('stripe_account_id', payout.destination as string)
          .single();

        if (connectAccount) {
          // Insert payout record
          await supabase.from('stripe_payouts').insert({
            user_id: connectAccount.user_id,
            stripe_payout_id: payout.id,
            stripe_account_id: payout.destination as string,
            amount: payout.amount,
            currency: payout.currency,
            status: payout.status,
            arrival_date: new Date(payout.arrival_date * 1000).toISOString(),
            description: payout.description || null,
            metadata: payout.metadata,
          });

          // Log audit event
          await supabase.rpc('log_admin_action', {
            _action: `payout_${payout.status}`,
            _entity_type: 'payout',
            _entity_id: connectAccount.user_id,
            _metadata: { payout_id: payout.id, amount: payout.amount, status: payout.status },
          });
        }
        break;
      }

      default:
        logEvent("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    logEvent("ERROR", { message: err.message });
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
