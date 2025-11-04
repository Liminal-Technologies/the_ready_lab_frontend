import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
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
import { Loader2, X } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string | null;
  visibility: string;
  rules: string | null;
  cover_photo: string | null;
}

interface EditCommunityModalProps {
  community: Community;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const EditCommunityModal = ({
  community,
  open,
  onOpenChange,
  onSuccess,
}: EditCommunityModalProps) => {
  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description || "");
  const [visibility, setVisibility] = useState(community.visibility);
  const [rules, setRules] = useState(community.rules || "");
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(
    community.cover_photo,
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Cover photo must be under 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setCoverPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      let coverPhotoUrl = community.cover_photo;

      if (coverPhoto) {
        const fileExt = coverPhoto.name.split(".").pop();
        const fileName = `${community.id}-${Math.random()}.${fileExt}`;
        const filePath = `community-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("videos")
          .upload(filePath, coverPhoto, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("videos").getPublicUrl(filePath);

        coverPhotoUrl = publicUrl;
      } else if (coverPhotoPreview === null) {
        coverPhotoUrl = null;
      }

      const { error } = await supabase
        .from("communities")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          visibility,
          rules: rules.trim() || null,
          cover_photo: coverPhotoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", community.id);

      if (error) throw error;

      toast({
        title: "Community updated",
        description: "Your community has been updated successfully",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating community:", error);
      toast({
        title: "Error",
        description: "Failed to update community",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover-photo">Cover Photo (Max 5MB)</Label>
            {coverPhotoPreview && (
              <div className="relative">
                <img
                  src={coverPhotoPreview}
                  alt="Cover preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveCoverPhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Input
              id="cover-photo"
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility *</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open - Anyone can join</SelectItem>
                <SelectItem value="private">
                  Private - Approval required
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Rules / Guidelines</Label>
            <Textarea
              id="rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="Optional community guidelines..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Community
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
