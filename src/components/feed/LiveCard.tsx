import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

interface LiveCardProps {
  eventId: string;
  title: string;
  description: string;
  instructorName: string;
  scheduledAt: Date;
  status: "scheduled" | "live" | "completed";
  attendeeCount: number;
  maxAttendees?: number;
  thumbnailUrl?: string;
}

export const LiveCard = ({
  eventId,
  title,
  description,
  instructorName,
  scheduledAt,
  status,
  attendeeCount,
  maxAttendees,
  thumbnailUrl,
}: LiveCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500 animate-pulse">🔴 LIVE</Badge>;
      case "scheduled":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "completed":
        return <Badge variant="outline">Recorded</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="relative aspect-[9/16] md:aspect-video">
        <img
          src={
            thumbnailUrl ||
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800"
          }
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/95" />

        {/* Live indicator */}
        <div className="absolute top-4 right-4">{getStatusBadge()}</div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-3">
            <Video className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Live Streaming
            </span>
          </div>

          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(scheduledAt, "MMM d, h:mm a")}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                {attendeeCount}
                {maxAttendees ? `/${maxAttendees}` : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              with {instructorName}
            </span>
            <Button
              size="sm"
              variant={status === "live" ? "default" : "secondary"}
              onClick={() => (window.location.href = `/live/${eventId}`)}
            >
              {status === "live"
                ? "Join Now"
                : status === "scheduled"
                  ? "Register"
                  : "Watch"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
