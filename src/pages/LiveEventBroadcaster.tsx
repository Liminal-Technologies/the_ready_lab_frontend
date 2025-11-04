import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import {
  Video,
  Users,
  Calendar,
  Clock,
  StopCircle,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  BarChart3,
  Send,
  ThumbsUp,
} from 'lucide-react';

// Mock chat messages
const INITIAL_CHAT = [
  { id: 1, user: "Sarah J.", message: "Excited for this session!", time: "2:00 PM" },
  { id: 2, user: "Michael C.", message: "Thanks for hosting this!", time: "2:01 PM" },
];

const INITIAL_QA = [
  { id: 1, user: "David M.", question: "Will the slides be available after?", time: "2:02 PM", upvotes: 3 },
  { id: 2, user: "Emma D.", question: "Can you explain the difference between grants and loans?", time: "2:03 PM", upvotes: 7 },
];

export default function LiveEventBroadcaster() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT);
  const [qaQuestions, setQaQuestions] = useState(INITIAL_QA);
  const [newMessage, setNewMessage] = useState("");
  const [attendees, setAttendees] = useState(0);

  // Load event data from localStorage
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    const events = JSON.parse(localStorage.getItem('liveEvents') || '[]');
    const foundEvent = events.find((e: any) => e.id === eventId);
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      // Mock event if not found
      setEvent({
        id: eventId,
        title: "Grant Writing Workshop",
        description: "Learn the fundamentals of writing compelling grant proposals",
        date: "2025-11-10",
        time: "14:00",
        duration: 90,
        maxAttendees: 100,
        features: {
          chat: true,
          qa: true,
          polls: false,
          recording: true,
        },
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (isLive) {
      // Simulate attendees joining
      const interval = setInterval(() => {
        setAttendees((prev) => Math.min(prev + Math.floor(Math.random() * 5), event?.maxAttendees || 100));
      }, 3000);

      // Simulate new chat messages
      const chatInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          const messages = [
            "This is really helpful!",
            "Great explanation!",
            "Could you repeat that?",
            "Thanks for sharing this!",
            "Very informative session",
          ];
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              user: `User ${Math.floor(Math.random() * 100)}`,
              message: messages[Math.floor(Math.random() * messages.length)],
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        }
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(chatInterval);
      };
    }
  }, [isLive]);

  const handleGoLive = () => {
    setIsLive(true);
    setAttendees(12); // Initial attendees
    toast({
      title: "You're live! 🎥",
      description: "Your event is now streaming to attendees.",
    });
  };

  const handleEndStream = () => {
    setIsLive(false);
    setHasEnded(true);
    
    toast({
      title: "Stream ended successfully",
      description: "Processing recording...",
    });

    // Show recording message, then replay option after 3 seconds
    setTimeout(() => {
      setShowReplay(true);
      toast({
        title: "Recording available! 📹",
        description: "Your session has been saved and is ready to watch.",
      });
    }, 3000);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: Date.now(),
          user: "You (Host)",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setNewMessage("");
    }
  };

  if (!event) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (hasEnded) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20 pb-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto mt-20">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Stream Ended Successfully</h2>
                <p className="text-muted-foreground mb-6">
                  Your live event "{event.title}" has concluded.
                </p>
                
                {!showReplay ? (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Recording available soon...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Badge variant="secondary" className="text-sm px-4 py-2">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Recording Ready
                    </Badge>
                    <div className="flex gap-3 justify-center mt-6">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/educator/dashboard')}
                        data-testid="button-back-dashboard"
                      >
                        Back to Dashboard
                      </Button>
                      <Button
                        onClick={() => toast({ title: "Opening replay..." })}
                        data-testid="button-watch-replay"
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Watch Replay
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-4">Event Statistics</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">{attendees}</div>
                      <div className="text-sm text-muted-foreground">Peak Attendees</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{chatMessages.length}</div>
                      <div className="text-sm text-muted-foreground">Messages</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{qaQuestions.length}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Event Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <p className="text-muted-foreground mb-4">{event.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {event.time} ({event.duration} min)
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {attendees} / {event.maxAttendees} attendees
                  </div>
                  {isLive && (
                    <Badge variant="destructive" className="animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      LIVE
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                {!isLive ? (
                  <Button
                    size="lg"
                    onClick={handleGoLive}
                    data-testid="button-go-live"
                  >
                    <Video className="mr-2 h-5 w-5" />
                    Go Live
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={handleEndStream}
                    data-testid="button-end-stream"
                  >
                    <StopCircle className="mr-2 h-5 w-5" />
                    End Stream
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video Area */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black flex items-center justify-center text-white">
                  {isLive ? (
                    <div className="text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Your Camera Feed</p>
                      <p className="text-sm opacity-75">Broadcasting to {attendees} viewers</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg opacity-75">Click "Go Live" to start streaming</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] flex flex-col">
                <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="qa">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Q&A
                    </TabsTrigger>
                    <TabsTrigger value="polls">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Polls
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium text-sm">{msg.user}</span>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    {isLive && (
                      <div className="p-4 border-t">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Send a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            data-testid="input-chat-message"
                          />
                          <Button size="icon" onClick={handleSendMessage} data-testid="button-send-message">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="qa" className="flex-1 overflow-y-auto p-4 space-y-3 mt-0">
                    {qaQuestions.map((q) => (
                      <Card key={q.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{q.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="font-medium text-sm mb-1">{q.user}</div>
                              <p className="text-sm mb-2">{q.question}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{q.time}</span>
                                <button className="flex items-center gap-1 hover:text-foreground">
                                  <ThumbsUp className="h-3 w-3" />
                                  {q.upvotes}
                                </button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="polls" className="flex-1 p-4 mt-0">
                    <div className="text-center text-muted-foreground py-8">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Polls feature coming soon</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
