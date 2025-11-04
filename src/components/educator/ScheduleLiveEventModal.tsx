import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, Users, Video } from "lucide-react";

interface ScheduleLiveEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleLiveEventModal({ open, onOpenChange }: ScheduleLiveEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [maxAttendees, setMaxAttendees] = useState("100");
  const [associatedCourse, setAssociatedCourse] = useState("");
  const [enableChat, setEnableChat] = useState(true);
  const [enableQA, setEnableQA] = useState(true);
  const [enablePolls, setEnablePolls] = useState(false);
  const [recordSession, setRecordSession] = useState(true);

  // Get created courses from localStorage
  const createdCourses = JSON.parse(localStorage.getItem('createdCourses') || '[]');

  const handleCreate = () => {
    if (!title.trim() || !date || !time) {
      toast({
        title: "Missing information",
        description: "Please fill in title, date, and time.",
        variant: "destructive",
      });
      return;
    }

    const event = {
      id: Date.now().toString(),
      title,
      description,
      date,
      time,
      duration: parseInt(duration),
      maxAttendees: parseInt(maxAttendees),
      associatedCourse,
      features: {
        chat: enableChat,
        qa: enableQA,
        polls: enablePolls,
        recording: recordSession,
      },
      status: "scheduled",
      createdAt: new Date().toISOString(),
      attendees: 0,
    };

    // Save to localStorage
    const existingEvents = JSON.parse(localStorage.getItem('liveEvents') || '[]');
    existingEvents.push(event);
    localStorage.setItem('liveEvents', JSON.stringify(existingEvents));

    toast({
      title: "Event created! 📅",
      description: `Your live event "${title}" has been scheduled.`,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDate("");
    setTime("");
    setDuration("60");
    setMaxAttendees("100");
    setAssociatedCourse("");
    setEnableChat(true);
    setEnableQA(true);
    setEnablePolls(false);
    setRecordSession(true);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Schedule Live Event
          </DialogTitle>
          <DialogDescription>
            Create a live streaming event for your students
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="event-title">Event Title *</Label>
            <Input
              id="event-title"
              placeholder="e.g., Grant Writing Workshop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-event-title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="What will you cover in this live session?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="textarea-event-description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="event-date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </Label>
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-testid="input-event-date"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="event-time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time *
              </Label>
              <Input
                id="event-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                data-testid="input-event-time"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="event-duration">Duration (minutes)</Label>
              <Input
                id="event-duration"
                type="number"
                min="15"
                max="480"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                data-testid="input-event-duration"
              />
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <Label htmlFor="max-attendees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Max Attendees
              </Label>
              <Input
                id="max-attendees"
                type="number"
                min="1"
                max="1000"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                data-testid="input-max-attendees"
              />
            </div>
          </div>

          {/* Associated Course */}
          <div className="space-y-2">
            <Label htmlFor="associated-course">Associated Course (Optional)</Label>
            <Select value={associatedCourse} onValueChange={setAssociatedCourse}>
              <SelectTrigger data-testid="select-associated-course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None - standalone event</SelectItem>
                {createdCourses.map((course: any, index: number) => (
                  <SelectItem key={index} value={course.title}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <Label>Event Features</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-chat"
                  checked={enableChat}
                  onCheckedChange={(checked) => setEnableChat(checked as boolean)}
                  data-testid="checkbox-enable-chat"
                />
                <label
                  htmlFor="enable-chat"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Enable Chat
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-qa"
                  checked={enableQA}
                  onCheckedChange={(checked) => setEnableQA(checked as boolean)}
                  data-testid="checkbox-enable-qa"
                />
                <label
                  htmlFor="enable-qa"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Enable Q&A
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-polls"
                  checked={enablePolls}
                  onCheckedChange={(checked) => setEnablePolls(checked as boolean)}
                  data-testid="checkbox-enable-polls"
                />
                <label
                  htmlFor="enable-polls"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Enable Polls
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="record-session"
                  checked={recordSession}
                  onCheckedChange={(checked) => setRecordSession(checked as boolean)}
                  data-testid="checkbox-record-session"
                />
                <label
                  htmlFor="record-session"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Record Session
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              data-testid="button-create-event"
            >
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
