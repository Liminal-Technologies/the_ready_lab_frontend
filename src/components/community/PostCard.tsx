import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Pin,
  Trash2,
  Flag,
} from "lucide-react";
import { PostComments } from "./PostComments";
import { PostReactions } from "./PostReactions";

interface PostCardProps {
  post: any;
  currentUserId: string | null;
  isModerator: boolean;
  onPostDeleted: (postId: string) => void;
  onPostPinned: (postId: string, pinned: boolean) => void;
}

export const PostCard = ({
  post,
  currentUserId,
  isModerator,
  onPostDeleted,
  onPostPinned,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasReacted, setHasReacted] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      toast.success("Post deleted", {
        description: "The post has been removed",
      });
      onPostDeleted(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post", {
        description: "Something went wrong. Please try again",
      });
    }
  };

  const handlePin = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ is_pinned: !post.is_pinned })
        .eq("id", post.id);

      if (error) throw error;

      toast.success(post.is_pinned ? "Post unpinned" : "Post pinned", {
        description: post.is_pinned
          ? "Post removed from top"
          : "Post pinned to top of community",
      });
      onPostPinned(post.id, !post.is_pinned);
    } catch (error) {
      console.error("Error pinning post:", error);
      toast.error("Failed to update post", {
        description: "Something went wrong. Please try again",
      });
    }
  };

  const handleBookmark = async () => {
    if (!currentUserId) return;

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("post_bookmarks")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", currentUserId);

        if (error) throw error;
        setIsBookmarked(false);
      } else {
        const { error } = await supabase.from("post_bookmarks").insert({
          post_id: post.id,
          user_id: currentUserId,
        });

        if (error) throw error;
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error bookmarking post:", error);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/community/${post.community_id}?post=${post.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied! 📋", {
      description: "Post link copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {(post.profiles?.full_name || post.profiles?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {post.profiles?.full_name ||
                  post.profiles?.email ||
                  "Unknown User"}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.is_pinned && (
              <Badge variant="secondary">
                <Pin className="h-3 w-3 mr-1" />
                Pinned
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isModerator && (
                  <DropdownMenuItem onClick={handlePin}>
                    <Pin className="h-4 w-4 mr-2" />
                    {post.is_pinned ? "Unpin" : "Pin"} Post
                  </DropdownMenuItem>
                )}
                {(isModerator || post.user_id === currentUserId) && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {post.title && <h3 className="text-lg font-semibold">{post.title}</h3>}
        {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}

        {post.media_url && post.post_type === "image" && (
          <img
            src={post.media_url}
            alt={post.title || "Post image"}
            className="w-full rounded-lg"
          />
        )}

        {post.media_url && post.post_type === "video" && (
          <video src={post.media_url} controls className="w-full rounded-lg" />
        )}

        {post.link_url && (
          <a
            href={post.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            {post.link_image && (
              <img
                src={post.link_image}
                alt={post.link_title || "Link"}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <p className="font-semibold">{post.link_title || post.link_url}</p>
            {post.link_description && (
              <p className="text-sm text-muted-foreground">
                {post.link_description}
              </p>
            )}
          </a>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <PostReactions
              postId={post.id}
              currentUserId={currentUserId}
              initialCount={post.likes_count}
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {post.comments_count}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={isBookmarked ? "text-primary" : ""}
            >
              <Bookmark
                className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
              />
              {post.saves_count}
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <PostComments
            postId={post.id}
            currentUserId={currentUserId}
            isModerator={isModerator}
          />
        )}
      </CardContent>
    </Card>
  );
};
