import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface LanguagePreference {
  preferred_language: string;
  show_content_in_language_first: boolean;
}

export const useLanguagePreference = () => {
  const { auth } = useAuth();
  const { toast } = useToast();
  const [preference, setPreference] = useState<LanguagePreference>({
    preferred_language: "en",
    show_content_in_language_first: true,
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
      const { data, error } = await supabase
        .from("profiles")
        .select("preferred_language, show_content_in_language_first")
        .eq("id", auth.user.id)
        .single();

      if (error) throw error;

      if (data) {
        setPreference({
          preferred_language: data.preferred_language || "en",
          show_content_in_language_first:
            data.show_content_in_language_first ?? true,
        });
      }
    } catch (error) {
      console.error("Error fetching language preference:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (
    newPreference: Partial<LanguagePreference>,
  ) => {
    if (!auth.user) return;

    try {
      const updatedPreference = { ...preference, ...newPreference };

      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_language: updatedPreference.preferred_language,
          show_content_in_language_first:
            updatedPreference.show_content_in_language_first,
        })
        .eq("id", auth.user.id);

      if (error) throw error;

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
    updatePreference,
  };
};
