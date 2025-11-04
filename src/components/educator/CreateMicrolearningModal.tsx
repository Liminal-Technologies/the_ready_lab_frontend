import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, Languages } from "lucide-react";
import { VideoUploadRecorder } from "./VideoUploadRecorder";
import { CaptionManager } from "./CaptionManager";
import {
  generateVideoThumbnail,
  uploadThumbnail,
} from "@/utils/thumbnailGenerator";

interface CreateMicrolearningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const roadmapTags = [
  "Nonprofit Management",
  "Fundraising",
  "Grant Writing",
  "Program Development",
  "Marketing & Branding",
  "Finance & Accounting",
  "Leadership",
  "Volunteer Management",
];

export const CreateMicrolearningModal = ({
  open,
  onOpenChange,
  onSuccess,
}: CreateMicrolearningModalProps) => {
  const [loading, setLoading] = useState(false);
  const [captionModalOpen, setCaptionModalOpen] = useState(false);
  const [createdLessonId, setCreatedLessonId] = useState<string | null>(null);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roadmap_tags: [] as string[],
    content_url: "",
    video_duration_seconds: 0,
    thumbnail_url: "",
  });
  const { toast } = useToast();

  const handleVideoUploaded = async (
    videoUrl: string,
    duration: number,
    blob?: Blob,
  ) => {
    setFormData({
      ...formData,
      content_url: videoUrl,
      video_duration_seconds: duration,
    });
    if (blob) {
      setVideoBlob(blob);
      // Auto-generate thumbnail
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const thumbnailBlob = await generateVideoThumbnail(blob);
        const thumbnailUrl = await uploadThumbnail(
          thumbnailBlob,
          user.id,
          Date.now().toString(),
          supabase,
        );
        setFormData((prev) => ({ ...prev, thumbnail_url: thumbnailUrl }));

        toast({
          title: "Thumbnail generated",
          description: "Video thumbnail created successfully!",
        });
      } catch (error) {
        console.error("Thumbnail generation failed:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content_url) {
      toast({
        title: "Video required",
        description: "Please upload or record a video.",
        variant: "destructive",
      });
      return;
    }

    if (formData.video_duration_seconds > 480) {
      toast({
        title: "Video too long",
        description: "Microlearning videos should be 2-8 minutes.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("lessons").insert({
        title: formData.title,
        description: formData.description,
        content_type: "video",
        content_url: formData.content_url,
        duration_minutes: Math.ceil(formData.video_duration_seconds / 60),
        video_duration_seconds: formData.video_duration_seconds,
        lesson_type: "microlearning",
        is_standalone: true,
        module_id: null,
        order_index: 0,
        thumbnail_url: formData.thumbnail_url,
        content_data: {
          roadmap_tags: formData.roadmap_tags,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Microlearning lesson created! You can now add captions.",
      });

      // Note: In production, you'd want to get the created lesson ID to open caption manager
      // For now, we'll just close the modal
      onSuccess?.();
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        roadmap_tags: [],
        content_url: "",
        video_duration_seconds: 0,
        thumbnail_url: "",
      });
    } catch (error) {
      console.error("Error creating microlearning:", error);
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Create Microlearning Lesson
          </DialogTitle>
          <DialogDescription>
            Create a short-form video lesson (2-8 minutes) for quick learning.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <VideoUploadRecorder
            onVideoUploaded={handleVideoUploaded}
            educatorId={formData.title || "temp"}
          />

          {formData.content_url && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Video uploaded successfully!
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: {Math.floor(formData.video_duration_seconds / 60)}:
                  {(formData.video_duration_seconds % 60)
                    .toString()
                    .padStart(2, "0")}
                </p>
              </div>

              {formData.thumbnail_url && (
                <div className="space-y-2">
                  <Label>Auto-generated Thumbnail</Label>
                  <img
                    src={formData.thumbnail_url}
                    alt="Video thumbnail"
                    className="w-full rounded-lg max-h-48 object-cover"
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Quick Guide to Grant Proposals"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of what students will learn..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Roadmap Tags (select multiple)</Label>
            <div className="grid grid-cols-2 gap-2">
              {roadmapTags.map((tag) => (
                <label
                  key={tag}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.roadmap_tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          roadmap_tags: [...formData.roadmap_tags, tag],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          roadmap_tags: formData.roadmap_tags.filter(
                            (t) => t !== tag,
                          ),
                        });
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.content_url}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Lesson"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
