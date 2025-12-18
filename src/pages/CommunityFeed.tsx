import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Plus, TrendingUp, MessageSquare, Heart, ThumbsUp, X, Send } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { LiveEventBanner } from "@/components/community/LiveEventBanner";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
}

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    title: "How do I find co-founders?",
    content: "I have a solid MVP for a fintech app but I'm struggling to find the right technical co-founder. Where do you all recommend looking? Any tips on vetting potential partners?",
    author: "Alex Martinez",
    authorInitials: "AM",
    timeAgo: "2 hours ago",
    likes: 15,
    comments: 8,
    likedBy: [],
    commentsList: [
      { id: "c1", author: "Sarah Chen", authorInitials: "SC", content: "Try Y Combinator's co-founder matching platform! I found my co-founder there.", timeAgo: "1 hour ago" },
      { id: "c2", author: "Marcus Johnson", authorInitials: "MJ", content: "LinkedIn groups for your industry can be great. Also consider attending startup weekends.", timeAgo: "30 min ago" },
    ],
  },
  {
    id: "post-2",
    title: "Just got funded $50K! 🎉",
    content: "Incredible news - we just closed our first angel round! $50K to build out our MVP and hire our first engineer. Huge thanks to this community for the pitch deck feedback. It made all the difference. Happy to share what worked!",
    author: "Sarah Chen",
    authorInitials: "SC",
    timeAgo: "5 hours ago",
    likes: 42,
    comments: 15,
    likedBy: [],
    commentsList: [
      { id: "c3", author: "Emma Davis", authorInitials: "ED", content: "Congrats Sarah! Would love to hear what resonated with investors.", timeAgo: "4 hours ago" },
      { id: "c4", author: "David Kim", authorInitials: "DK", content: "Amazing! Your pitch deck was really polished. Glad the feedback helped!", timeAgo: "3 hours ago" },
      { id: "c5", author: "Alex Martinez", authorInitials: "AM", content: "🎉 Huge congrats! What was the key thing that got them to say yes?", timeAgo: "2 hours ago" },
    ],
  },
  {
    id: "post-3",
    title: "Best tools for MVP development?",
    content: "What's your go-to tech stack for getting an MVP out the door quickly? I'm debating between no-code platforms vs. hiring a dev. Budget is tight but I want something scalable. Thoughts?",
    author: "Marcus Johnson",
    authorInitials: "MJ",
    timeAgo: "1 day ago",
    likes: 28,
    comments: 12,
    likedBy: [],
    commentsList: [
      { id: "c6", author: "Emma Davis", authorInitials: "ED", content: "For quick MVPs I love Bubble.io or Webflow. You can always rebuild later.", timeAgo: "20 hours ago" },
      { id: "c7", author: "Sarah Chen", authorInitials: "SC", content: "If you need more control, try Supabase + Next.js. Still fast but more scalable.", timeAgo: "18 hours ago" },
    ],
  },
  {
    id: "post-4",
    content: "Pro tip: Don't wait for perfection. We spent 6 months \"perfecting\" our product before launching. Wish we'd gotten user feedback way earlier. Ship fast, iterate faster! 🚀",
    author: "Emma Davis",
    authorInitials: "ED",
    timeAgo: "1 day ago",
    likes: 67,
    comments: 22,
    likedBy: [],
    commentsList: [
      { id: "c8", author: "David Kim", authorInitials: "DK", content: "100% this! We wasted so much time on features nobody wanted.", timeAgo: "23 hours ago" },
      { id: "c9", author: "Alex Martinez", authorInitials: "AM", content: "Needed to hear this today. I keep adding \"just one more feature\"...", timeAgo: "22 hours ago" },
    ],
  },
  {
    id: "post-5",
    title: "Struggling with investor conversations",
    content: "I've had 10+ investor calls and keep getting \"we like it but it's too early.\" How do you know when you're actually ready vs. when it's just a polite rejection? Any red flags to watch for?",
    author: "David Kim",
    authorInitials: "DK",
    timeAgo: "2 days ago",
    likes: 34,
    comments: 19,
    likedBy: [],
    commentsList: [
      { id: "c10", author: "Sarah Chen", authorInitials: "SC", content: "Look for specific feedback. If they say 'too early' without details, it's usually a pass.", timeAgo: "2 days ago" },
      { id: "c11", author: "Marcus Johnson", authorInitials: "MJ", content: "Track your metrics - when you have clear traction data, 'too early' becomes harder to say.", timeAgo: "1 day ago" },
    ],
  },
];

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    // Load posts from localStorage on mount
    const savedPosts = localStorage.getItem("communityFeedPosts");
    return savedPosts ? [...JSON.parse(savedPosts), ...INITIAL_POSTS] : INITIAL_POSTS;
  });
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  const handleCreatePost = (title: string, body: string) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: title,
      content: body,
      author: "Demo User",
      authorInitials: "DU",
      timeAgo: "just now",
      likes: 0,
      comments: 0,
      likedBy: [],
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    // Save to localStorage (only user-created posts)
    const userPosts = updatedPosts.filter(p => p.author === "Demo User");
    localStorage.setItem("communityFeedPosts", JSON.stringify(userPosts));

    toast.success("Post published!", {
      description: "Your post has been shared with the community",
      duration: 4000,
    });
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const alreadyLiked = likedBy.includes("currentUser");
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked
            ? likedBy.filter(u => u !== "currentUser")
            : [...likedBy, "currentUser"],
        };
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedPost(post);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Demo User",
      authorInitials: "DU",
      content: newComment,
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
  };

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
              {posts.map((post) => {
                const isLiked = post.likedBy?.includes("currentUser") || false;
                
                return (
                  <Card key={post.id} data-testid={`post-card-${post.id}`}>
                    <CardContent className="p-6">
                      {/* Post Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <Avatar>
                          <AvatarFallback>{post.authorInitials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{post.author}</p>
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
              })}
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
