import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Users } from "lucide-react";

interface LiveEventBannerProps {
  eventId?: string;
  title?: string;
  startsIn?: string;
  isLive?: boolean;
  participantCount?: number;
}

export const LiveEventBanner = ({ 
  eventId = "live-1",
  title = "Grant Writing Workshop",
  startsIn = "5 minutes",
  isLive = false,
  participantCount = 45
}: LiveEventBannerProps) => {
  const navigate = useNavigate();

  const handleJoinEvent = () => {
    navigate(`/live/${eventId}`);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-[#9333EA] bg-gradient-to-r from-[#9333EA] to-[#7C3AED] p-6 text-white shadow-lg">
      {/* Animated pulse effect for live events */}
      {isLive && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-sm font-bold uppercase tracking-wide">LIVE</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className={`flex-1 ${isLive ? 'md:ml-20' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-5 w-5" />
            <h3 className="text-xl font-bold">
              {isLive ? "🔴 LIVE NOW" : "Upcoming Event"}
            </h3>
          </div>
          <p className="text-lg font-semibold mb-1">{title}</p>
          <div className="flex items-center gap-4 text-sm">
            {!isLive && (
              <span className="flex items-center gap-1">
                Starts in <strong>{startsIn}</strong>
              </span>
            )}
            {isLive && (
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <strong>{participantCount}</strong> live viewers
              </span>
            )}
          </div>
        </div>

        <Button
          size="lg"
          onClick={handleJoinEvent}
          className="bg-white text-[#9333EA] hover:bg-neutral-100 font-bold shadow-lg"
          data-testid="button-join-live-event"
        >
          <Video className="mr-2 h-5 w-5" />
          Join Now
        </Button>
      </div>
    </div>
  );
};
