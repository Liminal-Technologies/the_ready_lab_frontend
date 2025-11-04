import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lessonId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  duration: number;
  trackTitle: string;
  progress?: number;
  completed?: boolean;
}

export const LessonCard = ({
  lessonId,
  title,
  description,
  thumbnailUrl,
  duration,
  trackTitle,
  progress = 0,
  completed = false,
}: LessonCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="relative overflow-hidden cursor-pointer group hover:shadow-elegant transition-all"
      onClick={() => navigate(`/lesson/${lessonId}`)}
    >
      <div className="relative aspect-[9/16] md:aspect-video">
        <img
          src={
            thumbnailUrl ||
            "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800"
          }
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/90" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play
              className="h-8 w-8 text-primary-foreground ml-1"
              fill="currentColor"
            />
          </div>
        </div>

        {/* Progress bar */}
        {progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              {trackTitle}
            </Badge>
            {completed && <Badge className="text-xs">Completed</Badge>}
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/80 line-clamp-2 mb-2">
            {description}
          </p>
          <div className="flex items-center text-xs text-white/70">
            <Clock className="h-3 w-3 mr-1" />
            {duration} min
          </div>
        </div>
      </div>
    </Card>
  );
};
