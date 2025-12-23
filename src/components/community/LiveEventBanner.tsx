import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface LiveEventBannerProps {
  eventId?: string;
  title?: string;
  startsIn?: string;
  isLive?: boolean;
  participantCount?: number;
  scheduledAt?: Date;
}

export const LiveEventBanner = ({
  eventId = "live-1",
  title = "Grant Writing Workshop",
  startsIn = "5 minutes",
  isLive = false,
  participantCount = 45,
  scheduledAt
}: LiveEventBannerProps) => {
  const navigate = useNavigate();

  const handleJoinEvent = () => {
    navigate(`/live/${eventId}`);
  };

  // Generate calendar event data
  const handleAddToCalendar = () => {
    // Default to 5 minutes from now if no scheduled time provided
    const eventStart = scheduledAt || new Date(Date.now() + 5 * 60 * 1000);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // 1 hour duration

    // Format dates for Google Calendar
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '');
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(eventStart)}/${formatDate(eventEnd)}&details=${encodeURIComponent(`Join the live event at: ${window.location.origin}/live/${eventId}`)}&location=${encodeURIComponent(window.location.origin)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
    toast.success("Opening calendar...", {
      description: "Add this event to your calendar",
    });
  };

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-[#9333EA] bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 p-6 shadow-lg">
      {/* Animated pulse effect for live events */}
      {isLive && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-sm font-bold uppercase tracking-wide text-red-600 dark:text-red-400">LIVE</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className={`flex-1 ${isLive ? 'md:ml-20' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-5 w-5 text-[#9333EA]" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {isLive ? "LIVE NOW" : "Upcoming Event"}
            </h3>
          </div>
          <p className="text-lg font-semibold mb-1 text-neutral-800 dark:text-neutral-200">{title}</p>
          <div className="flex items-center gap-4 text-sm text-neutral-700 dark:text-neutral-300">
            {!isLive && (
              <span className="flex items-center gap-1">
                Starts in <strong className="text-neutral-900 dark:text-neutral-100">{startsIn}</strong>
              </span>
            )}
            {isLive && (
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <strong className="text-neutral-900 dark:text-neutral-100">{participantCount}</strong> live viewers
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!isLive && (
            <Button
              size="lg"
              variant="outline"
              onClick={handleAddToCalendar}
              className="border-[#9333EA] text-[#9333EA] hover:bg-purple-50 dark:hover:bg-purple-950"
              data-testid="button-add-to-calendar"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Add to Calendar
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleJoinEvent}
            className="bg-[#9333EA] hover:bg-[#7C3AED] text-white font-bold shadow-lg"
            data-testid="button-join-live-event"
          >
            <Video className="mr-2 h-5 w-5" />
            {isLive ? "Join Now" : "Set Reminder"}
          </Button>
        </div>
      </div>
    </div>
  );
};
