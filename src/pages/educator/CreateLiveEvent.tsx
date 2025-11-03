import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  MessageSquare,
  HelpCircle,
  VideoIcon,
  ArrowLeft,
  Save,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockCourses = [
  { id: "1", name: "Funding Readiness 101" },
  { id: "2", name: "Business Infrastructure Mastery" },
  { id: "3", name: "Branding for Growth & Fundability" },
  { id: "4", name: "AI for Entrepreneurs" },
  { id: "5", name: "Grant Writing Mastery" },
];

const durationOptions = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
];

export default function CreateLiveEvent() {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [duration, setDuration] = useState("60");
  const [maxAttendees, setMaxAttendees] = useState("100");
  const [relatedCourse, setRelatedCourse] = useState("");
  const [enableChat, setEnableChat] = useState(true);
  const [enableQA, setEnableQA] = useState(true);
  const [enableRecording, setEnableRecording] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your event has been saved as a draft.",
    });
  };

  const handlePublish = async () => {
    // Validation
    if (!title.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter an event title.",
        variant: "destructive",
      });
      return;
    }

    if (!description.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter an event description.",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Missing information",
        description: "Please select a date for the event.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Event scheduled! 🎉",
      description: "Students can now register for your live event.",
    });

    // Redirect to events list
    navigate("/educator/events");
  };

  const getPreviewDateTime = () => {
    if (!date) return "Date not set";
    return `${format(date, "EEEE, MMMM d, yyyy")} at ${time}`;
  };

  const getPreviewDuration = () => {
    const mins = parseInt(duration);
    if (mins < 60) return `${mins} minutes`;
    const hours = mins / 60;
    return hours === 1 ? "1 hour" : `${hours} hours`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/educator/events")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>

          <h1 className="text-3xl font-bold mb-8">Schedule a Live Event</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Event Details</h2>

                {/* Event Title */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="title">
                    Event Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Grant Writing Workshop"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="What will attendees learn in this event?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {description.length}/300 characters
                  </p>
                </div>

                {/* Date & Time */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">
                      Time <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="duration">Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Attendees */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="maxAttendees">Max Attendees</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="maxAttendees"
                      type="number"
                      min="1"
                      value={maxAttendees}
                      onChange={(e) => setMaxAttendees(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Related Course */}
                <div className="space-y-2 mb-4">
                  <Label htmlFor="relatedCourse">Related Course (Optional)</Label>
                  <Select value={relatedCourse} onValueChange={setRelatedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCourses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <Label>Features</Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableChat"
                        checked={enableChat}
                        onCheckedChange={(checked) => setEnableChat(checked as boolean)}
                      />
                      <label
                        htmlFor="enableChat"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Enable Chat
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableQA"
                        checked={enableQA}
                        onCheckedChange={(checked) => setEnableQA(checked as boolean)}
                      />
                      <label
                        htmlFor="enableQA"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Enable Q&A
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enableRecording"
                        checked={enableRecording}
                        onCheckedChange={(checked) => setEnableRecording(checked as boolean)}
                      />
                      <label
                        htmlFor="enableRecording"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <VideoIcon className="h-4 w-4" />
                        Enable Recording
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    {isPublishing ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Publish Event
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Preview</h2>
                <Card className="p-6">
                  <div className="aspect-video bg-gradient-primary rounded-lg mb-4 flex items-center justify-center">
                    <Video className="h-16 w-16 text-white" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">
                      {title || "Your Event Title"}
                    </h3>

                    <p className="text-muted-foreground text-sm">
                      {description || "Your event description will appear here..."}
                    </p>

                    <div className="pt-3 space-y-2 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{getPreviewDateTime()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{getPreviewDuration()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>Max {maxAttendees} attendees</span>
                      </div>
                    </div>

                    {(enableChat || enableQA || enableRecording) && (
                      <div className="pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          Features included:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {enableChat && (
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              <MessageSquare className="h-3 w-3" />
                              Live Chat
                            </span>
                          )}
                          {enableQA && (
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              <HelpCircle className="h-3 w-3" />
                              Q&A
                            </span>
                          )}
                          {enableRecording && (
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                              <VideoIcon className="h-3 w-3" />
                              Recording
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button className="w-full mt-4" disabled>
                      Register for Event
                    </Button>
                  </div>
                </Card>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  This is how your event will appear to students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
