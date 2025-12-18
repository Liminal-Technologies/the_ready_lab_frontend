import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useStreamPresence } from '@/hooks/useStreamPresence';

interface StreamViewerProps {
  eventId: string;
  status: string;
}

export const StreamViewer = ({ eventId, status }: StreamViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('Viewer');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { viewerCount } = useStreamPresence(eventId, username);

  useEffect(() => {
    // Get username
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            setUsername(data?.full_name || user.email?.split('@')[0] || 'Viewer');
          });
      }
    });
  }, []);

  useEffect(() => {
    if (status === 'live') {
      // Simulate loading for demo
      setTimeout(() => setIsLoading(false), 1000);
      
      // In production, this would connect to the broadcaster's WebRTC stream
      // For now, we'll just show a placeholder
    }
  }, [status]);

  if (status === 'scheduled') {
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

  if (status === 'completed') {
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
      <div className="relative aspect-video bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            {/* Placeholder live stream area */}
            <div className="w-full h-full flex flex-col items-center justify-center text-white">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.3),transparent_50%)]"></div>
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              {/* Central content */}
              <div className="relative z-10 text-center px-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-2xl">
                  <Eye className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Live Stream Active</h3>
                <p className="text-neutral-400 max-w-md">
                  The presenter is live. Video feed will appear here when connected.
                </p>

                {/* Simulated audio visualizer */}
                <div className="flex items-end justify-center gap-1 mt-6 h-8">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-purple-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Live badge and viewer count */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className="bg-red-500 animate-pulse">
                🔴 LIVE
              </Badge>
              <Badge variant="secondary" className="bg-black/50 backdrop-blur">
                <Users className="h-3 w-3 mr-1" />
                {viewerCount || 47}
              </Badge>
            </div>

            {/* Recording indicator */}
            <div className="absolute top-4 right-4">
              <Badge variant="outline" className="bg-black/50 backdrop-blur border-red-500/50 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                Recording
              </Badge>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
      </div>
    </Card>
  );
};
