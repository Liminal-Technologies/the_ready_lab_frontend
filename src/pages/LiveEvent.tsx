import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MonitorUp, StopCircle, Clock } from 'lucide-react';
import { StreamViewer } from '@/components/streaming/StreamViewer';
import { StreamBroadcaster } from '@/components/streaming/StreamBroadcaster';
import { StreamChat } from '@/components/streaming/StreamChat';
import { QAPanel } from '@/components/streaming/QAPanel';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';

interface LiveEventData {
  id: string;
  title: string;
  description: string;
  educator_name: string;
  educator_avatar: string;
  start_time: string;
  end_time: string;
  duration: number;
  viewer_count: number;
  status: 'scheduled' | 'live' | 'completed';
  recording_enabled: boolean;
  educator_id: string;
}

export default function LiveEvent() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<LiveEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEducator, setIsEducator] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState('');

  useEffect(() => {
    loadEventData();
    const interval = setInterval(checkEventTiming, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [eventId]);

  const loadEventData = () => {
    // Mock event data - in production, fetch from API
    const mockEvent: LiveEventData = {
      id: eventId || '1',
      title: 'Advanced React Patterns Masterclass',
      description: 'Learn advanced React patterns including compound components, render props, and custom hooks.',
      educator_name: 'Dr. Sarah Chen',
      educator_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      start_time: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
      end_time: new Date(Date.now() + 95 * 60 * 1000).toISOString(), // 95 minutes from now
      duration: 90,
      viewer_count: 234,
      status: 'live',
      recording_enabled: true,
      educator_id: 'educator-1',
    };

    setEvent(mockEvent);
    setLoading(false);

    // Mock educator check - in production, check against actual user ID
    const mockUserId = localStorage.getItem('userRole') === 'educator' ? 'educator-1' : 'student-1';
    setIsEducator(mockUserId === mockEvent.educator_id);

    checkEventTiming(mockEvent);
  };

  const checkEventTiming = (eventData: LiveEventData = event!) => {
    if (!eventData) return;

    const now = new Date();
    const startTime = new Date(eventData.start_time);
    const endTime = new Date(eventData.end_time);
    const minutesUntilStart = Math.floor((startTime.getTime() - now.getTime()) / 60000);

    if (now > endTime) {
      setEvent({ ...eventData, status: 'completed' });
      setCanJoin(false);
    } else if (minutesUntilStart <= 15 && minutesUntilStart >= -eventData.duration) {
      setEvent({ ...eventData, status: 'live' });
      setCanJoin(true);
    } else {
      setEvent({ ...eventData, status: 'scheduled' });
      setCanJoin(false);
      
      if (minutesUntilStart > 0) {
        const hours = Math.floor(minutesUntilStart / 60);
        const mins = minutesUntilStart % 60;
        setTimeUntilStart(hours > 0 ? `${hours}h ${mins}m` : `${mins}m`);
      }
    }
  };

  const handleShareScreen = () => {
    toast({
      title: "Screen Sharing Started",
      description: "Your screen is now being shared with all participants",
    });
  };

  const handleEndStream = () => {
    toast({
      title: "Stream Ended",
      description: "The live stream has been ended successfully",
      variant: "destructive",
    });
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="w-full h-[600px]" />
        </main>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <Button onClick={() => navigate('/explore')}>Browse Events</Button>
          </Card>
        </main>
      </div>
    );
  }

  // Pre-event state
  if (event.status === 'scheduled' && !canJoin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
            <p className="text-xl text-muted-foreground mb-6">
              Event hasn't started yet
            </p>
            <div className="text-lg mb-8">
              Starts in <span className="font-bold text-primary">{timeUntilStart}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Come back within 15 minutes of the start time to join
            </p>
            <Button onClick={() => navigate('/explore')}>
              Back to Events
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Post-event state
  if (event.status === 'completed') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
            <p className="text-xl text-muted-foreground mb-6">
              This event has ended
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Check back for future events or view recorded sessions
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/explore')}>
                Browse Events
              </Button>
              <Button variant="outline" onClick={() => navigate('/courses')}>
                View Courses
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Live event interface
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {event.recording_enabled && (
        <div className="bg-destructive/10 border-b border-destructive/20 py-2 px-4">
          <p className="text-center text-sm text-destructive font-medium">
            🔴 This event is being recorded
          </p>
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Main Video Area */}
          <div className="space-y-4">
            <div className="relative">
              {isEducator ? (
                <StreamBroadcaster
                  eventId={event.id}
                  onStreamStart={() => {}}
                  onStreamEnd={handleEndStream}
                />
              ) : (
                <StreamViewer eventId={event.id} status={event.status} />
              )}
              
              {event.status === 'live' && !isEducator && (
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-destructive animate-pulse">
                    🔴 LIVE
                  </Badge>
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    <Users className="h-3 w-3 mr-1" />
                    {event.viewer_count} watching
                  </Badge>
                </div>
              )}
            </div>

            {/* Event Info */}
            <Card className="p-6">
              <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <img
                    src={event.educator_avatar}
                    alt={event.educator_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{event.educator_name}</span>
                </div>
                <span>•</span>
                <span>{event.duration} minutes</span>
              </div>
              <p className="text-muted-foreground">{event.description}</p>
            </Card>

            {/* Educator Controls */}
            {isEducator && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Stream Controls</h3>
                <div className="flex gap-3">
                  <Button onClick={handleShareScreen} variant="outline">
                    <MonitorUp className="h-4 w-4 mr-2" />
                    Share Screen
                  </Button>
                  <Button onClick={handleEndStream} variant="destructive">
                    <StopCircle className="h-4 w-4 mr-2" />
                    End Stream
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Participants ({event.viewer_count})</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-muted" />
                        <span>Participant {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Chat & Q&A */}
          <div className="space-y-4">
            <Tabs defaultValue="chat" className="h-[calc(100vh-200px)]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="h-[calc(100%-48px)] mt-4">
                <StreamChat eventId={event.id} isInstructor={isEducator} />
              </TabsContent>
              <TabsContent value="qa" className="h-[calc(100%-48px)] mt-4">
                <QAPanel eventId={event.id} isEducator={isEducator} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
