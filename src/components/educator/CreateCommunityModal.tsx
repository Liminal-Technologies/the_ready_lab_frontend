import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users } from 'lucide-react';

interface CreateCommunityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateCommunityModal = ({ open, onOpenChange, onSuccess }: CreateCommunityModalProps) => {
  const [loading, setLoading] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'open',
    rules: '',
  });
  const { toast } = useToast();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Cover photo must be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
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
    }
  };

  const handleRemoveCoverPhoto = () => {
    setCoverPhoto(null);
    setCoverPhotoPreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let coverPhotoUrl = '';

      // Upload cover photo if provided
      if (coverPhoto) {
        const fileExt = coverPhoto.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `community-covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, coverPhoto);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(filePath);

        coverPhotoUrl = publicUrl;
      }

      const { error } = await supabase.from('communities').insert({
        ...formData,
        created_by: user.id,
        cover_photo: coverPhotoUrl || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Community created successfully.",
      });
      
      onSuccess?.();
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        visibility: 'open',
        rules: '',
      });
      setCoverPhoto(null);
      setCoverPhotoPreview('');
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Community</DialogTitle>
          <DialogDescription>
            Build a community for your students and followers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover-photo">Cover Photo (Max 5MB)</Label>
            <Input
              id="cover-photo"
              type="file"
              accept="image/*"
              onChange={handleCoverPhotoChange}
            />
            {coverPhotoPreview && (
              <div className="mt-2 relative">
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
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Nonprofit Leaders Forum"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose of this community..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility *</Label>
            <Select
              value={formData.visibility}
              onValueChange={(value) => setFormData({ ...formData, visibility: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open - Anyone can join</SelectItem>
                <SelectItem value="private">Private - Approval required</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">Community Rules (optional)</Label>
            <Textarea
              id="rules"
              value={formData.rules}
              onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
              placeholder="List the guidelines for community members..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
                  <Users className="mr-2 h-4 w-4" />
                  Create Community
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
