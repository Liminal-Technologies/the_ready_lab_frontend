import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, body: string) => void;
}

export const CreatePostModal = ({ open, onOpenChange, onSubmit }: CreatePostModalProps) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    onSubmit(title, body);
    // Reset form
    setTitle("");
    setBody("");
    setImagePreview(null);
    onOpenChange(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, questions, or success stories with the community
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              placeholder="Looking for feedback on my pitch deck"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-post-title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="post-body">Body</Label>
            <Textarea
              id="post-body"
              placeholder="I'm applying to accelerators and would love community feedback..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[120px] resize-none"
              data-testid="input-post-body"
            />
          </div>
          <div className="space-y-2">
            <Label>Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                  data-testid="button-remove-image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label 
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload image</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  data-testid="input-upload-image"
                />
              </label>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel-post"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
            className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
            data-testid="button-submit-post"
          >
            Post
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
