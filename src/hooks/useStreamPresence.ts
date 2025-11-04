import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface ViewerPresence {
  user_id: string;
  username: string;
  joined_at: string;
}

export const useStreamPresence = (eventId: string, username: string) => {
  const [viewerCount, setViewerCount] = useState(0);
  const [viewers, setViewers] = useState<ViewerPresence[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const streamChannel = supabase.channel(`stream:${eventId}`, {
      config: {
        presence: {
          key: eventId,
        },
      },
    });

    streamChannel
      .on("presence", { event: "sync" }, () => {
        const presenceState = streamChannel.presenceState();
        const allViewers: ViewerPresence[] = [];

        Object.values(presenceState).forEach((presences: any) => {
          presences.forEach((presence: ViewerPresence) => {
            allViewers.push(presence);
          });
        });

        setViewers(allViewers);
        setViewerCount(allViewers.length);

        // Update viewer count in database
        supabase
          .from("live_events")
          .update({ viewer_count: allViewers.length })
          .eq("id", eventId)
          .then();
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        console.log("Viewer joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        console.log("Viewer left:", leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await streamChannel.track({
            user_id:
              (await supabase.auth.getUser()).data.user?.id || "anonymous",
            username,
            joined_at: new Date().toISOString(),
          });
        }
      });

    setChannel(streamChannel);

    return () => {
      streamChannel.unsubscribe();
    };
  }, [eventId, username]);

  return { viewerCount, viewers, channel };
};
