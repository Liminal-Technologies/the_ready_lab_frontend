import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { EmptyCommunity } from '@/components/empty-states/EmptyCommunity';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Post {
  id: string;
  community_id: string;
  user_id: string;
  post_type: string;
  title: string | null;
  content: string | null;
  media_url: string | null;
  link_url: string | null;
  link_title: string | null;
  link_description: string | null;
  link_image: string | null;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  media_duration_seconds: number | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface PostTimelineProps {
  communityId: string;
  isMember: boolean;
  isModerator: boolean;
  currentUserId: string | null;
}

export const PostTimeline = ({ communityId, isMember, isModerator, currentUserId }: PostTimelineProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: `community_id=eq.${communityId}`
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('community_id', communityId)
        .is('deleted_at', null)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error("Failed to load posts", {
        description: "Something went wrong. Please refresh the page",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostDeleted = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handlePostPinned = (postId: string, pinned: boolean) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, is_pinned: pinned } : p));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isMember && (
        <CreatePost communityId={communityId} onPostCreated={handlePostCreated} />
      )}

      {posts.length === 0 ? (
        <EmptyCommunity 
          message={isMember ? "No posts yet" : "No posts in this community yet"}
          description={isMember ? "Be the first to start a conversation in this community" : "This community doesn't have any posts yet"}
          showAction={isMember}
          onAction={isMember ? () => {} : undefined}
        />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            isModerator={isModerator}
            onPostDeleted={handlePostDeleted}
            onPostPinned={handlePostPinned}
          />
        ))
      )}
    </div>
  );
};
