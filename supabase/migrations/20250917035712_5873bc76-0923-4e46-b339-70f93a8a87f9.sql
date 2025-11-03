-- Create educator agreement tracking table
CREATE TABLE public.educator_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agreement_text TEXT NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on educator agreements
ALTER TABLE public.educator_agreements ENABLE ROW LEVEL SECURITY;

-- Create policies for educator agreements
CREATE POLICY "Users can view their own agreements" 
ON public.educator_agreements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agreements" 
ON public.educator_agreements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create verified educator badges table
CREATE TABLE public.verified_educator_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL DEFAULT 'verified',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revoked')),
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_type)
);

-- Enable RLS on verified educator badges
ALTER TABLE public.verified_educator_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for verified educator badges
CREATE POLICY "Users can view their own badges" 
ON public.verified_educator_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all badges" 
ON public.verified_educator_badges 
FOR ALL 
USING (has_admin_role(auth.uid(), 'super_admin'::admin_role) OR has_admin_role(auth.uid(), 'content_admin'::admin_role));

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  stripe_product_id TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'educator', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on subscription plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for subscription plans
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Add feature flag for verified educator badges
INSERT INTO public.feature_flags (flag_name, description, is_enabled) 
VALUES ('verified_educator_badges', 'Enable verified educator badge workflow', false);

-- Insert default educator subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, role, features) VALUES
('Educator Starter', 'Perfect for new educators getting started', 49.00, 490.00, 'educator', '["Create unlimited courses", "Basic analytics", "Email support", "Community access"]'),
('Educator Professional', 'For established educators scaling their business', 129.00, 1290.00, 'educator', '["Everything in Starter", "Advanced analytics", "Priority support", "White-label options", "Custom branding"]'),
('Educator Enterprise', 'For educational institutions and large-scale operations', 349.00, 3490.00, 'educator', '["Everything in Professional", "Institution management", "Bulk enrollment", "API access", "Dedicated support", "Custom integrations"]');

-- Add trigger for updated_at on verified_educator_badges
CREATE TRIGGER update_verified_educator_badges_updated_at
BEFORE UPDATE ON public.verified_educator_badges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on subscription_plans
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();