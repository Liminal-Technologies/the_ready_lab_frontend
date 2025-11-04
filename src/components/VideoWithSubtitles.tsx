import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Languages, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Subtitle {
  start: number;
  end: number;
  text: string;
  translatedText?: string;
}

interface VideoWithSubtitlesProps {
  videoUrl: string;
  subtitles: Subtitle[];
  title: string;
  educator: string;
}

export const VideoWithSubtitles = ({ 
  videoUrl, 
  subtitles, 
  title, 
  educator 
}: VideoWithSubtitlesProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null);
  const [translatedSubtitles, setTranslatedSubtitles] = useState<Map<number, string>>(new Map());
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);

  // Update current subtitle based on video time
  useEffect(() => {
    const subtitle = subtitles.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end
    );
    setCurrentSubtitle(subtitle || null);
  }, [currentTime, subtitles]);

  // Translate subtitles when language changes to Spanish
  useEffect(() => {
    if (language === 'es' && translatedSubtitles.size === 0) {
      translateAllSubtitles();
    }
  }, [language]);

  const translateAllSubtitles = async () => {
    if (isTranslating) return;
    
    setIsTranslating(true);
    const translated = new Map<number, string>();

    try {
      // Translate subtitles in batches to avoid overwhelming the API
      const batchSize = 5;
      for (let i = 0; i < subtitles.length; i += batchSize) {
        const batch = subtitles.slice(i, i + batchSize);
        const batchPromises = batch.map(async (subtitle, index) => {
          try {
            const { data, error } = await supabase.functions.invoke('translate-subtitles', {
              body: {
                text: subtitle.text,
                targetLanguage: 'es'
              }
            });

            if (error) {
              console.error('Translation error:', error);
              return { index: i + index, text: subtitle.text }; // Fallback to original
            }

            return { index: i + index, text: data.translatedText };
          } catch (error) {
            console.error('Translation request failed:', error);
            return { index: i + index, text: subtitle.text }; // Fallback to original
          }
        });

        const batchResults = await Promise.all(batchPromises);
        batchResults.forEach(({ index, text }) => {
          translated.set(index, text);
        });

        // Small delay between batches to be respectful to the API
        if (i + batchSize < subtitles.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      setTranslatedSubtitles(translated);
      toast({
        title: "Subtitles translated",
        description: "All subtitles have been translated to Spanish.",
      });
    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: "Translation failed",
        description: "Unable to translate subtitles. Showing original text.",
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentSubtitleText = () => {
    if (!currentSubtitle) return '';
    
    if (language === 'es') {
      const subtitleIndex = subtitles.indexOf(currentSubtitle);
      return translatedSubtitles.get(subtitleIndex) || currentSubtitle.text;
    }
    
    return currentSubtitle.text;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-0">
        <div className="relative">
          {/* Video Player */}
          <video
            ref={videoRef}
            className="w-full aspect-video bg-black"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Subtitle Overlay */}
          {showSubtitles && currentSubtitle && (
            <div className="absolute bottom-20 left-0 right-0 text-center px-4">
              <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg max-w-4xl">
                <p className="text-lg font-medium leading-relaxed">
                  {getCurrentSubtitleText()}
                </p>
                {language === 'es' && isTranslating && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Translating...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Translation Status Badge */}
          {language === 'es' && (
            <div className="absolute top-4 right-4">
              {isTranslating ? (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating...
                </Badge>
              ) : translatedSubtitles.size > 0 ? (
                <Badge variant="default" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Spanish Subtitles
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  English Subtitles
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="p-4 border-t bg-card">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={togglePlay}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button
              onClick={toggleMute}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Button
              onClick={() => setShowSubtitles(!showSubtitles)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              {showSubtitles ? 'Hide' : 'Show'} Subtitles
            </Button>

            {language === 'es' && translatedSubtitles.size === 0 && !isTranslating && (
              <Button
                onClick={translateAllSubtitles}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Languages className="h-4 w-4" />
                Translate to Spanish
              </Button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground min-w-12">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-muted-foreground min-w-12">
              {formatTime(duration)}
            </span>
          </div>

          {/* Video Info */}
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-semibold text-lg mb-1">{title}</h3>
            <p className="text-muted-foreground">By {educator}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};