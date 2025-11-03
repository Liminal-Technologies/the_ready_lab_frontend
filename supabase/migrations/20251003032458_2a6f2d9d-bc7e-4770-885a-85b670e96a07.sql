-- Create purchases table to track digital product sales
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.digital_products(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_product_id ON public.purchases(product_id);
CREATE INDEX idx_purchases_stripe_session_id ON public.purchases(stripe_session_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON public.purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Educators can view purchases of their products
CREATE POLICY "Educators can view purchases of their products"
  ON public.purchases
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.digital_products
      WHERE digital_products.id = purchases.product_id
        AND digital_products.educator_id = auth.uid()
    )
  );

-- Admins can view all purchases
CREATE POLICY "Admins can view all purchases"
  ON public.purchases
  FOR SELECT
  USING (
    has_admin_role(auth.uid(), 'super_admin'::admin_role) OR
    has_admin_role(auth.uid(), 'content_admin'::admin_role)
  );

-- Add updated_at trigger
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add platform_fee column to digital_products (percentage taken by platform)
ALTER TABLE public.digital_products
ADD COLUMN IF NOT EXISTS platform_fee_percentage NUMERIC DEFAULT 10.0 CHECK (platform_fee_percentage >= 0 AND platform_fee_percentage <= 100);

COMMENT ON TABLE public.purchases IS 'Tracks all digital product purchases and their payment status';
COMMENT ON COLUMN public.purchases.status IS 'Payment status: pending, completed, refunded, failed';
COMMENT ON COLUMN public.digital_products.platform_fee_percentage IS 'Percentage of sale price taken as platform fee (0-100)';