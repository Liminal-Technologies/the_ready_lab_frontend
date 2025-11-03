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

    // Use the public view to avoid exposing instructor_id
    const { data, error } = await supabase
      .from('public_live_events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load stream details',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    setEvent(data);
    setLoading(false);
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
