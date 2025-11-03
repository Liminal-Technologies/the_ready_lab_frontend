import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SubscriptionStatus {
  subscribed: boolean;
  product_id: string | null;
  subscription_end: string | null;
  subscription_status: string;
  loading: boolean;
  error: string | null;
}

export const useSubscription = () => {
  const { auth } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    product_id: null,
    subscription_end: null,
    subscription_status: 'trial',
    loading: true,
    error: null,
  });

  const checkSubscription = async () => {
    if (!auth.user) {
      setSubscription({
        subscribed: false,
        product_id: null,
        subscription_end: null,
        subscription_status: 'trial',
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setSubscription(prev => ({ ...prev, loading: true, error: null }));
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscription({
        subscribed: data.subscribed || false,
        product_id: data.product_id || null,
        subscription_end: data.subscription_end || null,
        subscription_status: data.subscription_status || 'trial',
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscription(prev => ({ 
        ...prev, 
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to check subscription',
      }));
    }
  };

  useEffect(() => {
    checkSubscription();
    
    // Check every minute
    const interval = setInterval(checkSubscription, 60000);
    
    return () => clearInterval(interval);
  }, [auth.user]);

  return { subscription, checkSubscription };
};
