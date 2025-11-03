import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface SubscriptionCardProps {
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
  role: 'student' | 'educator';
}

export const SubscriptionCard = ({
  name,
  price,
  priceId,
  description,
  features,
  popular,
  role,
}: SubscriptionCardProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { auth } = useAuth();

  const handleSubscribe = async () => {
    if (!auth.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, role },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col ${popular ? 'border-primary shadow-elegant' : ''}`}>
      <CardHeader>
        {popular && (
          <Badge className="w-fit mb-2">Most Popular</Badge>
        )}
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1 mb-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
        <Button 
          onClick={handleSubscribe} 
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Get Started'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
