import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Video,
  MessageSquare,
  HelpCircle,
  VideoIcon,
  Download,
  ArrowRight,
  User
} from "lucide-react";

// Mock event data
const mockEvent = {
  id: "1",
  title: "Grant Writing Workshop: Win Your First $50K",
  description: "Join us for an intensive workshop where you'll learn the exact strategies and frameworks used to secure over $2M in grants. We'll cover everything from finding the right opportunities to crafting compelling narratives that funders can't resist.",
  educator: {
    name: "Dr. Sarah Johnson",
    title: "Funding Strategy Expert",
    initials: "SJ"
  },
  startDate: new Date(Date.now() + 2 * 60 * 60 * 1000 + 34 * 60 * 1000), // 2 hours 34 mins from now
  duration: 90,
  attendeesRegistered: 47,
  maxAttendees: 100,
  relatedCourse: {
    id: "1",
    name: "Funding Readiness 101"
  },
  whatYouLearn: [
    "How to identify high-probability grant opportunities for your organization",
    "The 5-part framework for writing compelling grant proposals",
    "Common mistakes that get applications rejected (and how to avoid them)",
    "How to build relationships with funders before you apply",
    "Real examples of winning proposals and why they worked"
  ],
  features: {
    chat: true,
    qa: true,
    recording: true
  }
};

const upcomingEvents = [
  {
    id: "2",
    title: "Building Your Nonprofit Board",
    educator: "Maria Rodriguez",
    date: "Tomorrow at 2:00 PM",
    attendees: 32
  },
  {
    id: "3",
    title: "Social Media for Social Impact",
    educator: "James Chen",
    date: "Friday at 10:00 AM",
    attendees: 28
  },
  {
    id: "4",
    title: "Financial Planning Workshop",
    educator: "Lisa Anderson",
    date: "Next Monday at 3:00 PM",
    attendees: 41
  }
];

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [timeUntilStart, setTimeUntilStart] = useState("");

  // Check registration status
  useEffect(() => {
    const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]");
    setIsRegistered(registeredEvents.includes(eventId));
  }, [eventId]);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const eventTime = mockEvent.startDate.getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeUntilStart("Event has started");
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeUntilStart(`Starts in ${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRegister = () => {
    const registeredEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]");
    registeredEvents.push(eventId);
    localStorage.setItem("registeredEvents", JSON.stringify(registeredEvents));
    
    setIsRegistered(true);
    setShowSuccessModal(true);
    
    toast({
      title: "📧 Registration Confirmed! 🎉",
      description: "We've sent you a confirmation email with event details and calendar invite. A reminder will be sent 15 minutes before the event.",
    });
  };

  const handleAddToCalendar = () => {
    // Mock .ics file download
    toast({
      title: "Calendar event added",
      description: "Event has been added to your calendar.",
    });
    setShowSuccessModal(false);
  };

  const formatEventDate = () => {
    return mockEvent.startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatEventTime = () => {
    return mockEvent.startDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Event Header */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="mb-6">
              <Badge className="mb-4 bg-primary/10 text-primary">Live Event</Badge>
              <h1 className="text-4xl font-bold mb-4">{mockEvent.title}</h1>
              
              {/* Educator Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {mockEvent.educator.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{mockEvent.educator.name}</p>
                  <p className="text-sm text-muted-foreground">{mockEvent.educator.title}</p>
                </div>
              </div>

              {/* Event Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatEventDate()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatEventTime()}</span>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {mockEvent.duration} minutes
                </Badge>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{mockEvent.attendeesRegistered} registered</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 px-4 py-2 rounded-full font-medium">
                <Clock className="h-4 w-4" />
                {timeUntilStart}
              </div>
            </div>

            {/* Register Button */}
            <div className="mb-8">
              {!isRegistered ? (
                <Button
                  size="lg"
                  onClick={handleRegister}
                  className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  Register for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  disabled
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-600 text-white font-semibold"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  You're Registered ✓
                </Button>
              )}
            </div>

            {/* Event Details */}
            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {mockEvent.description}
              </p>

              <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
              <ul className="space-y-3">
                {mockEvent.whatYouLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Related Course */}
            {mockEvent.relatedCourse && (
              <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Related Course</p>
                    <h3 className="text-lg font-semibold">{mockEvent.relatedCourse.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Take the full course to dive deeper into this topic
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/courses/${mockEvent.relatedCourse.id}`)}
                  >
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            )}

            {/* Features */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Event Features</h3>
              <div className="flex flex-wrap gap-3">
                {mockEvent.features.chat && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Live Chat
                  </Badge>
                )}
                {mockEvent.features.qa && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Q&A Session
                  </Badge>
                )}
                {mockEvent.features.recording && (
                  <Badge variant="outline" className="flex items-center gap-2">
                    <VideoIcon className="h-4 w-4" />
                    Recording Available
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Upcoming Events Section */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Other Upcoming Events</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div className="aspect-video bg-primary rounded-lg mb-4 flex items-center justify-center">
                    <Video className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <User className="h-4 w-4" />
                    <span>{event.educator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} registered</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              You're all set! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-base pt-2">
              We'll send you a reminder 15 minutes before the event starts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-4">
            <Card className="p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">{mockEvent.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatEventDate()} at {formatEventTime()}
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleAddToCalendar}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Add to Calendar
              </Button>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1"
              >
                Got it!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
