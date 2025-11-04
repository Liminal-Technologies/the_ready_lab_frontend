import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface VerifiedEducatorBadgeProps {
  userId?: string;
  className?: string;
}

interface BadgeData {
  status: "pending" | "approved" | "rejected" | "revoked";
  approved_at?: string;
}

export function VerifiedEducatorBadge({
  userId,
  className,
}: VerifiedEducatorBadgeProps) {
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);
  const [featureEnabled, setFeatureEnabled] = useState(false);
  const { auth } = useAuth();

  const targetUserId = userId || auth.user?.id;

  useEffect(() => {
    checkFeatureFlag();
    if (targetUserId) {
      fetchBadgeData();
    }
  }, [targetUserId]);

  const checkFeatureFlag = async () => {
    try {
      const { data } = await supabase
        .from("feature_flags")
        .select("is_enabled")
        .eq("flag_name", "verified_educator_badges")
        .single();

      setFeatureEnabled(data?.is_enabled || false);
    } catch (error) {
      console.error("Error checking feature flag:", error);
    }
  };

  const fetchBadgeData = async () => {
    if (!targetUserId) return;

    try {
      const { data } = await supabase
        .from("verified_educator_badges")
        .select("status, approved_at")
        .eq("user_id", targetUserId)
        .eq("badge_type", "verified")
        .single();

      setBadgeData(data as BadgeData);
    } catch (error) {
      // No badge found is expected for most users
      setBadgeData(null);
    }
  };

  if (!featureEnabled || !badgeData) {
    return null;
  }

  const getBadgeContent = () => {
    switch (badgeData.status) {
      case "approved":
        return {
          icon: ShieldCheck,
          text: "Verified Educator",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Verification Pending",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "rejected":
        return {
          icon: X,
          text: "Verification Denied",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      case "revoked":
        return {
          icon: X,
          text: "Verification Revoked",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
      default:
        return null;
    }
  };

  const badgeContent = getBadgeContent();
  if (!badgeContent) return null;

  const Icon = badgeContent.icon;

  return (
    <Badge
      variant="outline"
      className={`${badgeContent.className} ${className}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {badgeContent.text}
    </Badge>
  );
}
