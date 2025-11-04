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
import { Loader2, Upload, Languages } from "lucide-react";
import { MultilingualMetadataEditor } from "./MultilingualMetadataEditor";

interface UploadCourseModalProps {
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

const categories = [
  "Business",
  "Technology",
  "Design",
  "Marketing",
  "Leadership",
  "Nonprofit",
  "Finance",
  "Other",
];

export const UploadCourseModal = ({
  open,
  onOpenChange,
  onSuccess,
}: UploadCourseModalProps) => {
  const [loading, setLoading] = useState(false);
  const [translationsModalOpen, setTranslationsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    roadmap_tags: [] as string[],
    estimated_hours: 1,
    price: 0,
    thumbnail_url: "",
    translations: {} as Record<string, { title: string; description: string }>,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("tracks").insert({
        ...formData,
        created_by: user.id,
        is_active: false, // Draft by default
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created as draft. You can publish it later.",
      });

      onSuccess?.();
      onOpenChange(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        level: "beginner",
        roadmap_tags: [],
        estimated_hours: 1,
        price: 0,
        thumbnail_url: "",
        translations: {},
      });
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new course. It will be saved as a
            draft.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Fundraising Fundamentals"
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
              placeholder="Describe what students will learn..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Level *</Label>
              <Select
                value={formData.level}
                onValueChange={(value) =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours">Estimated Hours *</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_hours: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail_url}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTranslationsModalOpen(true)}
              className="w-full"
            >
              <Languages className="h-4 w-4 mr-2" />
              Add Translations ({Object.keys(formData.translations).length}{" "}
              languages)
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </form>

        <MultilingualMetadataEditor
          open={translationsModalOpen}
          onOpenChange={setTranslationsModalOpen}
          baseTitle={formData.title}
          baseDescription={formData.description}
          translations={formData.translations}
          onSave={(translations) => setFormData({ ...formData, translations })}
        />
      </DialogContent>
    </Dialog>
  );
};
