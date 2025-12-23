import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Plus, TrendingUp, MessageSquare, Heart, ThumbsUp, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { LiveEventBanner } from "@/components/community/LiveEventBanner";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

interface Comment {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timeAgo: string;
}

interface Post {
  id: string;
  title?: string;
  content: string;
  author: string;
  authorInitials: string;
  timeAgo: string;
  likes: number;
  comments: number;
  likedBy?: string[];
  commentsList?: Comment[];
  communityName?: string;
  communityId?: string;
}

// Helper to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const defaultUserId = "11111111-1111-1111-1111-111111111111";
        const response = await api.posts.list({ include: ['author', 'community'] });

        // Fetch user reactions for all posts in parallel
        const postsWithReactions = await Promise.all(
          response.data.map(async (post: any) => {
            let userLiked = false;
            try {
              const reactionRes = await fetch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${post.id}/reactions/user/${defaultUserId}`
              );
              if (reactionRes.ok) {
                const reactionData = await reactionRes.json();
                userLiked = reactionData?.hasReacted === true;
              }
            } catch {
              // Ignore reaction fetch errors
            }
            return { ...post, userLiked };
          })
        );

        const transformedPosts: Post[] = postsWithReactions.map((post: any) => ({
          id: post.id,
          title: post.title || undefined,
          content: post.content,
          author: post.author?.full_name || "Anonymous",
          authorInitials: getInitials(post.author?.full_name || "AN"),
          timeAgo: formatDistanceToNow(new Date(post.createdAt || post.created_at), { addSuffix: true }),
          likes: post.likesCount ?? post.likes_count ?? 0,
          comments: post.commentsCount ?? post.comments_count ?? 0,
          likedBy: post.userLiked ? ["currentUser"] : [],
          commentsList: [],
          communityName: post.community?.name,
          communityId: post.community?.id,
        }));

        setPosts(transformedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        // Keep empty state on error
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (title: string, body: string) => {
    try {
      // Use the first community as default (Psychology Students)
      const defaultCommunityId = "eeee1111-1111-1111-1111-111111111111";
      const defaultUserId = "11111111-1111-1111-1111-111111111111";

      // Create post via API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          community_id: defaultCommunityId,
          user_id: defaultUserId,
          title: title || null,
          content: body,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const createdPost = await response.json();

      // Add to local state with transformed data
      const newPost: Post = {
        id: createdPost.id,
        title: createdPost.title || undefined,
        content: createdPost.content,
        author: "Test Student",
        authorInitials: "TS",
        timeAgo: "just now",
        likes: 0,
        comments: 0,
        likedBy: [],
        communityName: "Psychology Students",
        communityId: defaultCommunityId,
      };

      setPosts(prev => [newPost, ...prev]);

      toast.success("Post published!", {
        description: "Your post has been shared with the community",
        duration: 4000,
      });
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to publish post", {
        description: "Please try again later",
      });
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const defaultUserId = "11111111-1111-1111-1111-111111111111";
    const likedBy = post.likedBy || [];
    const alreadyLiked = likedBy.includes("currentUser");

    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: alreadyLiked ? p.likes - 1 : p.likes + 1,
          likedBy: alreadyLiked
            ? likedBy.filter(u => u !== "currentUser")
            : [...likedBy, "currentUser"],
        };
      }
      return p;
    }));

    try {
      if (alreadyLiked) {
        // Remove reaction
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${postId}/reactions/${defaultUserId}`, {
          method: 'DELETE',
        });
      } else {
        // Add reaction
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${postId}/reactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: defaultUserId,
            reaction_type: 'like',
          }),
        });
      }
    } catch (error) {
      console.error("Failed to update like:", error);
      // Revert optimistic update on error
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes: alreadyLiked ? p.likes + 1 : p.likes - 1,
            likedBy: alreadyLiked
              ? [...likedBy, "currentUser"]
              : likedBy.filter(u => u !== "currentUser"),
          };
        }
        return p;
      }));
    }
  };

  const handleComment = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);

      // Fetch existing comments from API
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${postId}/comments`);
        if (response.ok) {
          const data = await response.json();
          const comments: Comment[] = (data.data || []).map((c: any) => ({
            id: c.id,
            author: c.author_name || "Anonymous",
            authorInitials: getInitials(c.author_name || "AN"),
            content: c.content,
            timeAgo: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }),
          }));

          // Update selected post with fetched comments
          setSelectedPost(prev => prev ? { ...prev, commentsList: comments } : null);

          // Also update in posts array
          setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, commentsList: comments } : p
          ));
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPost) return;

    try {
      const defaultUserId = "11111111-1111-1111-1111-111111111111";

      // Create comment via API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/posts/${selectedPost.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: defaultUserId,
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const createdComment = await response.json();

      const comment: Comment = {
        id: createdComment.id,
        author: "Test Student",
        authorInitials: "TS",
        content: createdComment.content,
        timeAgo: "just now",
      };

      setPosts(prev => prev.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), comment],
          };
        }
        return post;
      }));

      // Update selected post with new comment
      setSelectedPost(prev => prev ? {
        ...prev,
        comments: prev.comments + 1,
        commentsList: [...(prev.commentsList || []), comment],
      } : null);

      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast.error("Failed to add comment", {
        description: "Please try again later",
      });
    }
  };

  // Loading skeleton
  const PostSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pt-20">
        {/* Header Section */}
        <div className="bg-white dark:bg-neutral-800 shadow-lg">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl pt-8 pb-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground" data-testid="link-home">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Community</span>
            </div>

            {/* Title and Action */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black mb-2">Community Feed</h1>
                <p className="text-muted-foreground">
                  Connect with peers, share insights, and grow together
                </p>
              </div>
              <Button
                onClick={() => setCreatePostOpen(true)}
                className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
                data-testid="button-create-post"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            {/* Quick Links */}
            <div className="flex gap-3 flex-wrap">
              <Link to="/community/browse">
                <Button variant="outline" size="sm" data-testid="button-browse-communities">
                  Browse Communities
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="sm" data-testid="button-browse-courses">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl py-8">
          <div className="space-y-6">
            {/* Live Event Banner */}
            <LiveEventBanner
              eventId="live-grant-workshop"
              title="Grant Writing Workshop"
              startsIn="5 minutes"
              isLive={false}
            />

            {/* Trending Topics */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-[#9333EA]" />
                  <h2 className="text-lg font-bold">Trending Topics</h2>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["Funding", "MVP Development", "Co-founders", "Investor Relations", "Product Launch"].map(
                    (topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 text-sm bg-purple-50 dark:bg-purple-950 text-[#9333EA] rounded-full cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                        data-testid={`topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        #{topic.replace(/\s+/g, "")}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-4">
              {loading ? (
                <>
                  <PostSkeleton />
                  <PostSkeleton />
                  <PostSkeleton />
                </>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => {
                  const isLiked = post.likedBy?.includes("currentUser") || false;

                  return (
                    <Card key={post.id} data-testid={`post-card-${post.id}`}>
                      <CardContent className="p-6">
                        {/* Post Header with Community Label */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar>
                            <AvatarFallback>{post.authorInitials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{post.author}</p>
                              {post.communityName && (
                                <Link to={`/community/${post.communityId}`}>
                                  <Badge variant="secondary" className="text-xs hover:bg-purple-100 dark:hover:bg-purple-900 cursor-pointer">
                                    {post.communityName}
                                  </Badge>
                                </Link>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
                          </div>
                        </div>

                        {/* Post Content - Clickable to open thread */}
                        <div
                          className="mb-4 cursor-pointer hover:bg-muted/30 -mx-2 px-2 py-1 rounded transition-colors"
                          onClick={() => setSelectedPost(post)}
                        >
                          {post.title && (
                            <h3 className="text-lg font-bold mb-2 hover:text-primary">{post.title}</h3>
                          )}
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {post.content}
                          </p>
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4 pt-4 border-t">
                          <Button
                            variant={isLiked ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handleLike(post.id)}
                            className="gap-2"
                            data-testid={`button-like-${post.id}`}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                            <span>{post.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleComment(post.id)}
                            className="gap-2"
                            data-testid={`button-comment-${post.id}`}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2"
                            data-testid={`button-thumbsup-${post.id}`}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Create Post Modal */}
      <CreatePostModal
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        onSubmit={handleCreatePost}
      />

      {/* Thread Detail Modal */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedPost?.title || "Thread"}</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Original Post */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback>{selectedPost.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedPost.author}</p>
                    <p className="text-xs text-muted-foreground">{selectedPost.timeAgo}</p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{selectedPost.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                  <Button
                    variant={(selectedPost.likedBy || []).includes("currentUser") ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      handleLike(selectedPost.id);
                      // Update selected post like state
                      setSelectedPost(prev => {
                        if (!prev) return null;
                        const likedBy = prev.likedBy || [];
                        const alreadyLiked = likedBy.includes("currentUser");
                        return {
                          ...prev,
                          likes: alreadyLiked ? prev.likes - 1 : prev.likes + 1,
                          likedBy: alreadyLiked
                            ? likedBy.filter(u => u !== "currentUser")
                            : [...likedBy, "currentUser"],
                        };
                      });
                    }}
                    className="gap-2"
                  >
                    <Heart className={`h-4 w-4 ${(selectedPost.likedBy || []).includes("currentUser") ? "fill-current" : ""}`} />
                    <span>{selectedPost.likes}</span>
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    {selectedPost.comments} comments
                  </span>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Comments ({selectedPost.commentsList?.length || 0})</h4>
                {(selectedPost.commentsList || []).map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">{comment.authorInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Comment Input */}
          <div className="flex gap-2 pt-4 border-t mt-auto">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunityFeed;
