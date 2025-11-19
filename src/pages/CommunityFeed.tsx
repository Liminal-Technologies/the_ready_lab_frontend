import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight, Plus, TrendingUp, MessageSquare, Heart, ThumbsUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CreatePostModal } from "@/components/community/CreatePostModal";
import { LiveEventBanner } from "@/components/community/LiveEventBanner";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

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
  },
];

const CommunityFeed = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    // Load posts from localStorage on mount
    const savedPosts = localStorage.getItem("communityFeedPosts");
    return savedPosts ? [...JSON.parse(savedPosts), ...INITIAL_POSTS] : INITIAL_POSTS;
  });
  const [createPostOpen, setCreatePostOpen] = useState(false);

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
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    ));
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

                      {/* Post Content */}
                      <div className="mb-4">
                        {post.title && (
                          <h3 className="text-lg font-bold mb-2">{post.title}</h3>
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
    </>
  );
};

export default CommunityFeed;
