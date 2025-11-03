import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { EducatorAgreementModal } from "./EducatorAgreementModal";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly?: number;
  features: string[];
  role: string;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  stripe_product_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SubscriptionPlansProps {
  showEducatorOnly?: boolean;
}

export function SubscriptionPlans({ showEducatorOnly = false }: SubscriptionPlansProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const { auth } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_monthly', { ascending: true });

      if (error) throw error;

      let filteredPlans = (data || []).map(plan => ({
        ...plan,
        description: plan.description || '',
        price_yearly: plan.price_yearly || undefined,
        stripe_price_id_monthly: plan.stripe_price_id_monthly || undefined,
        stripe_price_id_yearly: plan.stripe_price_id_yearly || undefined,
        stripe_product_id: plan.stripe_product_id || undefined,
        features: Array.isArray(plan.features) ? plan.features.map(f => String(f)) : []
      }));
      
      if (showEducatorOnly) {
        filteredPlans = filteredPlans.filter(plan => plan.role === 'educator');
      }

      setPlans(filteredPlans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!auth.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a plan",
        variant: "destructive",
      });
      return;
    }

    if (plan.role === 'educator') {
      // Check if user has already accepted educator agreement
      const { data: existingAgreement } = await supabase
        .from('educator_agreements')
        .select('id')
        .eq('user_id', auth.user.id)
        .single();

      if (!existingAgreement) {
        setSelectedPlan(plan);
        setShowAgreement(true);
        return;
      }
    }

    await processSubscription(plan);
  };

  const processSubscription = async (plan: SubscriptionPlan) => {
    setProcessingPlan(plan.id);
    
    try {
      // This would integrate with Stripe checkout
      // For now, we'll show a placeholder message
      toast({
        title: "Subscription Processing",
        description: `Redirecting to checkout for ${plan.name}...`,
      });

      // In a real implementation, you would:
      // 1. Create Stripe checkout session
      // 2. Redirect to Stripe
      // 3. Handle success/cancel webhooks
      // 4. Automatically upgrade user role on successful payment
      
    } catch (error) {
      console.error('Error processing subscription:', error);
      toast({
        title: "Error",
        description: "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleAgreementAccepted = () => {
    if (selectedPlan) {
      processSubscription(selectedPlan);
      setSelectedPlan(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isPopular = (plan: SubscriptionPlan) => {
    return plan.name.toLowerCase().includes('professional');
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded mb-4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${isPopular(plan) ? 'border-primary shadow-lg' : ''}`}
          >
            {isPopular(plan) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.role === 'educator' && (
                  <Badge variant="outline" className="text-xs">
                    Educator
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold">
                {formatPrice(plan.price_monthly)}
                <span className="text-lg font-normal text-muted-foreground">/month</span>
              </div>
              {plan.price_yearly && (
                <div className="text-sm text-muted-foreground">
                  or {formatPrice(plan.price_yearly)}/year (save 2 months)
                </div>
              )}
            </CardHeader>
            
            <CardContent>
              <Button 
                className="w-full mb-6" 
                disabled={processingPlan === plan.id}
                onClick={() => handleSubscribe(plan)}
                variant={isPopular(plan) ? "default" : "outline"}
              >
                {processingPlan === plan.id ? "Processing..." : "Get Started"}
              </Button>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <EducatorAgreementModal
        open={showAgreement}
        onOpenChange={setShowAgreement}
        onAgreementAccepted={handleAgreementAccepted}
      />
    </>
  );
}