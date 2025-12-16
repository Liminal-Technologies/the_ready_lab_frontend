import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, Link as LinkIcon, Type, Loader2 } from 'lucide-react';

interface CreatePostProps {
  communityId: string;
  onPostCreated: () => void;
}

export const CreatePost = ({ communityId, onPostCreated }: CreatePostProps) => {
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'link'>('text');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
  const MAX_VIDEO_DURATION = 180; // 3 minutes in seconds

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (postType === 'video') {
      if (file.size > MAX_VIDEO_SIZE) {
        toast.error("File too large", {
          description: "Video must be under 100MB",
        });
        return;
      }

      // Check video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > MAX_VIDEO_DURATION) {
          toast.error("Video too long", {
            description: "Video must be 3 minutes or less",
          });
          return;
        }
        setMediaFile(file);
      };
      video.src = URL.createObjectURL(file);
    } else {
      setMediaFile(file);
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${communityId}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('videos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !title && !mediaFile && !linkUrl) {
      toast.error("Empty post", {
        description: "Please add some content to your post",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let mediaUrl = null;
      if (mediaFile) {
        mediaUrl = await uploadMedia(mediaFile);
      }

      await api.posts.create({
        community_id: communityId,
        title: title || undefined,
        content: content || '',
        media_urls: mediaUrl ? [mediaUrl] : undefined,
      });

      toast.success("Post created! 💬", {
        description: "Your post has been published successfully",
      });

      // Reset form
      setContent('');
      setTitle('');
      setMediaFile(null);
      setLinkUrl('');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post", {
        description: "Something went wrong. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={postType} onValueChange={(v) => setPostType(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image">
                <Image className="h-4 w-4 mr-2" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="h-4 w-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="link">
                <LinkIcon className="h-4 w-4 mr-2" />
                Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Add a caption..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleMediaChange}
              />
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Add a description..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
              />
              <Input
                type="file"
                accept="video/*"
                onChange={handleMediaChange}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 3 minutes, 100MB
              </p>
            </TabsContent>

            <TabsContent value="link" className="space-y-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                type="url"
                placeholder="Paste link here..."
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
              <Textarea
                placeholder="Add context or description..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
