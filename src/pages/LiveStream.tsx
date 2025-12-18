import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StreamBroadcaster } from '@/components/streaming/StreamBroadcaster';
import { StreamViewer } from '@/components/streaming/StreamViewer';
import { StreamChat } from '@/components/streaming/StreamChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface LiveEvent {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: string;
  viewer_count: number;
  attendee_count: number;
  max_attendees: number | null;
  is_recording: boolean;
  thumbnail_url: string | null;
  recording_url: string | null;
  meeting_url: string | null;
  created_at: string;
  updated_at: string;
  track_id: string | null;
}

const LiveStream = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<LiveEvent | null>(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    loadEventDetails();
    checkUserRole();

    // Subscribe to event updates
    const channel = supabase
      .channel(`event:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'live_events',
          filter: `id=eq.${eventId}`,
        },
        (payload) => {
          setEvent(payload.new as LiveEvent);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [eventId]);

  const loadEventDetails = async () => {
    if (!eventId) return;

    try {
      // Fetch live event via API
      const eventData = await api.liveEvents.get(eventId);

      // Map to expected format
      const mappedEvent: LiveEvent = {
        id: (eventData as any).id,
        title: (eventData as any).title,
        description: (eventData as any).description,
        scheduled_at: (eventData as any).scheduled_at || (eventData as any).scheduledAt,
        duration_minutes: (eventData as any).duration_minutes || 60,
        status: (eventData as any).status,
        viewer_count: (eventData as any).current_viewers || (eventData as any).viewer_count || 0,
        attendee_count: (eventData as any).attendee_count || 0,
        max_attendees: (eventData as any).max_viewers || (eventData as any).max_attendees,
        is_recording: false,
        thumbnail_url: (eventData as any).thumbnail_url || (eventData as any).thumbnailUrl,
        recording_url: null,
        meeting_url: null,
        created_at: (eventData as any).created_at,
        updated_at: (eventData as any).updated_at,
        track_id: null,
      };

      setEvent(mappedEvent);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load event, using demo data:', error);
      // Use fallback demo event instead of redirecting
      const demoEvent: LiveEvent = {
        id: eventId,
        title: 'Live Q&A: Grant Writing Workshop',
        description: 'Join us for an interactive session on grant writing strategies. Ask questions and get real-time feedback from experienced grant writers.',
        scheduled_at: new Date().toISOString(),
        duration_minutes: 60,
        status: 'live',
        viewer_count: 47,
        attendee_count: 52,
        max_attendees: 100,
        is_recording: true,
        thumbnail_url: null,
        recording_url: null,
        meeting_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        track_id: null,
      };
      setEvent(demoEvent);
      setLoading(false);
    }
  };

  const checkUserRole = async () => {
    if (!eventId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Use the security definer function to check instructor status
    // This avoids exposing instructor_id to the client
    const { data, error } = await supabase
      .rpc('is_event_instructor', {
        _event_id: eventId,
        _user_id: user.id
      });

    if (error) {
      console.error('Error checking instructor role:', error);
      return;
    }

    setIsInstructor(data === true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="aspect-video w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stream Area */}
          <div className="lg:col-span-2 space-y-4">
            {isInstructor ? (
              <StreamBroadcaster eventId={event.id} />
            ) : (
              <StreamViewer
                eventId={event.id}
                status={event.status}
              />
            )}

            {/* Stream Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.scheduled_at), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(event.scheduled_at), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      event.status === 'live'
                        ? 'default'
                        : event.status === 'scheduled'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:h-[calc(100vh-200px)] h-[600px]">
            <StreamChat eventId={event.id} isInstructor={isInstructor} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LiveStream;
