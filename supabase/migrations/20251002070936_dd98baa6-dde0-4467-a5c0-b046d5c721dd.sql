-- Create stripe_subscriptions table
CREATE TABLE public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stripe_invoices table
CREATE TABLE public.stripe_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  amount_due INTEGER NOT NULL,
  amount_paid INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE
);

-- Create stripe_connect_accounts table
CREATE TABLE public.stripe_connect_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_status TEXT NOT NULL DEFAULT 'pending',
  charges_enabled BOOLEAN NOT NULL DEFAULT false,
  payouts_enabled BOOLEAN NOT NULL DEFAULT false,
  details_submitted BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  requirements_due_by TIMESTAMP WITH TIME ZONE,
  requirements_fields JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stripe_payouts table
CREATE TABLE public.stripe_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payout_id TEXT NOT NULL UNIQUE,
  stripe_account_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  arrival_date TIMESTAMP WITH TIME ZONE,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_connect_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stripe_subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON public.stripe_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_invoices
CREATE POLICY "Users can view their own invoices"
  ON public.stripe_invoices FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_connect_accounts
CREATE POLICY "Users can view their own connect account"
  ON public.stripe_connect_accounts FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policies for stripe_payouts
CREATE POLICY "Users can view their own payouts"
  ON public.stripe_payouts FOR SELECT
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_stripe_subscriptions_user_id ON public.stripe_subscriptions(user_id);
CREATE INDEX idx_stripe_subscriptions_stripe_customer_id ON public.stripe_subscriptions(stripe_customer_id);
CREATE INDEX idx_stripe_subscriptions_status ON public.stripe_subscriptions(status);
CREATE INDEX idx_stripe_invoices_user_id ON public.stripe_invoices(user_id);
CREATE INDEX idx_stripe_invoices_stripe_customer_id ON public.stripe_invoices(stripe_customer_id);
CREATE INDEX idx_stripe_connect_accounts_user_id ON public.stripe_connect_accounts(user_id);
CREATE INDEX idx_stripe_payouts_user_id ON public.stripe_payouts(user_id);
CREATE INDEX idx_stripe_payouts_stripe_account_id ON public.stripe_payouts(stripe_account_id);

-- Add trigger for updated_at
CREATE TRIGGER update_stripe_subscriptions_updated_at
  BEFORE UPDATE ON public.stripe_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stripe_connect_accounts_updated_at
  BEFORE UPDATE ON public.stripe_connect_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();