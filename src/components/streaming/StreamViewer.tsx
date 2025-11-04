import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStreamPresence } from "@/hooks/useStreamPresence";

interface StreamViewerProps {
  eventId: string;
  status: string;
}

export const StreamViewer = ({ eventId, status }: StreamViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("Viewer");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { viewerCount } = useStreamPresence(eventId, username);

  useEffect(() => {
    // Get username
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            setUsername(
              data?.full_name || user.email?.split("@")[0] || "Viewer",
            );
          });
      }
    });
  }, []);

  useEffect(() => {
    if (status === "live") {
      // Simulate loading for demo
      setTimeout(() => setIsLoading(false), 1000);

      // In production, this would connect to the broadcaster's WebRTC stream
      // For now, we'll just show a placeholder
    }
  }, [status]);

  if (status === "scheduled") {
    return (
      <Card className="aspect-video flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Stream Scheduled</h3>
          <p className="text-muted-foreground">
            This stream hasn't started yet. Check back at the scheduled time.
          </p>
        </div>
      </Card>
    );
  }

  if (status === "completed") {
    return (
      <Card className="aspect-video flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Stream Ended</h3>
          <p className="text-muted-foreground">
            This stream has ended. Check back for future streams!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-black">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              controls
              className="w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-red-500 animate-pulse">🔴 LIVE</Badge>
              <Badge variant="secondary" className="bg-black/50">
                <Users className="h-3 w-3 mr-1" />
                {viewerCount}
              </Badge>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
