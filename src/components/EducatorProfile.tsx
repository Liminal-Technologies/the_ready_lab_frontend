import { VideoWithSubtitles } from './VideoWithSubtitles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, BookOpen, Users, Award } from 'lucide-react';

interface EducatorProfileProps {
  educator: {
    id: string;
    name: string;
    title: string;
    bio: string;
    avatar: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
    specialties: string[];
    featuredVideo?: {
      url: string;
      title: string;
      subtitles: Array<{
        start: number;
        end: number;
        text: string;
      }>;
    };
  };
}

export const EducatorProfile = ({ educator }: EducatorProfileProps) => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Educator Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={educator.avatar} alt={educator.name} />
              <AvatarFallback>{educator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{educator.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">{educator.title}</p>
                <p className="text-foreground leading-relaxed">{educator.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{educator.rating}</span>
                  <span className="text-muted-foreground">rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">{educator.studentsCount.toLocaleString()}</span>
                  <span className="text-muted-foreground">students</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">{educator.coursesCount}</span>
                  <span className="text-muted-foreground">courses</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {educator.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Video with AI Translation */}
      {educator.featuredVideo && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Featured Course Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Watch this course preview with AI-powered subtitle translation. 
                Switch to Spanish using the language selector to see translated subtitles.
              </p>
              <VideoWithSubtitles
                videoUrl={educator.featuredVideo.url}
                subtitles={educator.featuredVideo.subtitles}
                title={educator.featuredVideo.title}
                educator={educator.name}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Additional educator content can go here */}
    </div>
  );
};