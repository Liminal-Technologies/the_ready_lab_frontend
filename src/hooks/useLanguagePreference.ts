import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface LanguagePreference {
  preferred_language: string;
  show_content_in_language_first: boolean;
}

export const useLanguagePreference = () => {
  const { auth } = useAuth();
  const { toast } = useToast();
  const [preference, setPreference] = useState<LanguagePreference>({
    preferred_language: 'en',
    show_content_in_language_first: true
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.user) {
      fetchPreference();
    }
  }, [auth.user]);

  const fetchPreference = async () => {
    if (!auth.user) return;

    try {
      const profile = await api.profiles.get(auth.user.id);

      if (profile) {
        setPreference({
          preferred_language: profile.preferred_language || 'en',
          show_content_in_language_first: profile.show_content_in_language_first ?? true
        });
      }
    } catch (error) {
      console.error('Error fetching language preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (newPreference: Partial<LanguagePreference>) => {
    if (!auth.user) return;

    try {
      const updatedPreference = { ...preference, ...newPreference };

      await api.profiles.update(auth.user.id, {
        preferred_language: updatedPreference.preferred_language,
        show_content_in_language_first: updatedPreference.show_content_in_language_first
      });

      setPreference(updatedPreference);

      toast({
        title: "Language preference updated",
        description: "Your language settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language preference.",
        variant: "destructive",
      });
    }
  };

  return {
    preference,
    loading,
    updatePreference
  };
};