import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

const CommunityCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    visibility: "open"
  });

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
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create a community",
          variant: "destructive",
        });
        return;
      }

      let coverPhotoUrl = '';

      // Upload cover photo if provided
      // TODO: Move storage uploads to API for centralized control, validation, and security
      // Currently using Supabase Storage directly for efficiency, but at scale we should:
      // 1. Add POST /api/storage/upload endpoint to trl-api
      // 2. Validate file types/sizes server-side
      // 3. Add virus scanning before storage
      // 4. Generate signed URLs with expiration for private files
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

      // Create community via API
      await api.communities.create({
        name: formData.name,
        description: formData.description,
        type: formData.visibility === 'private' ? 'private' : 'public',
        thumbnail_url: coverPhotoUrl || undefined,
        created_by: user.id,
      });
      
      toast({
        title: "Community Created",
        description: "Your community has been successfully created!",
      });
      
      navigate("/community/browse");
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
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Create a Community</h1>
              <p className="text-lg text-muted-foreground">
                Build a space for learning and collaboration
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Community Details</CardTitle>
                <CardDescription>
                  Provide information about your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="w-full h-48 object-cover rounded-lg"
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
                    <Label htmlFor="name">Community Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Nonprofit Leaders Circle"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the purpose and goals of your community"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open - Anyone can join</SelectItem>
                        <SelectItem value="private">Private - Invitation only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Community'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/community/browse")}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityCreate;
