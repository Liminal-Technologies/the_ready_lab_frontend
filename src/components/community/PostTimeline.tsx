import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Heart, ThumbsUp, Smile, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Post {
  id: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  likedBy?: string[]; // Track who liked it
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  created_at: string;
}

interface PostTimelineProps {
  communityId: string;
  isMember: boolean;
}

// Mock posts for demo
const INITIAL_POSTS: Post[] = [
  {
    id: 'post_1',
    content: 'Just completed my first funding round! 🎉 Looking for advice on scaling our operations. Anyone have experience with Series A?',
    author: 'Sarah Johnson',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 12,
    likedBy: [],
    comments: [
      {
        id: 'comment_1',
        content: 'Congratulations! I went through Series A last year. Happy to share my experience. DM me!',
        author: 'Michael Chen',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'comment_2',
        content: 'That\'s amazing news! Make sure to have your metrics dashboard ready before investor meetings.',
        author: 'Emma Davis',
        created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'post_2',
    content: 'Does anyone have templates for grant applications? Working on an NSF SBIR application and could use some guidance.',
    author: 'James Wilson',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 8,
    likedBy: [],
    comments: [],
  },
  {
    id: 'post_3',
    content: 'Great session at today\'s workshop! Key takeaway: Focus on your mission statement before diving into financials. The clarity helps in every pitch.',
    author: 'Olivia Martinez',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likes: 24,
    likedBy: [],
    comments: [
      {
        id: 'comment_3',
        content: 'This is so true! Our investors loved how clear our mission was.',
        author: 'Sarah Johnson',
        created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

export const PostTimeline = ({ communityId, isMember }: PostTimelineProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [communityId]);

  const fetchPosts = () => {
    // TODO: backend - GET /api/posts?communityId=${communityId}
    // const response = await fetch(`/api/posts?communityId=${communityId}`)
    
    setTimeout(() => {
      const postsKey = `communityPosts_${communityId}`;
      const storedPosts = localStorage.getItem(postsKey);
      
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        setPosts([...parsed, ...INITIAL_POSTS]);
      } else {
        setPosts(INITIAL_POSTS);
      }
      setLoading(false);
    }, 300);
  };

  const handleLike = (postId: string) => {
    // TODO: backend - POST /api/posts/:id/like
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const alreadyLiked = likedBy.includes('currentUser');
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked 
            ? likedBy.filter(u => u !== 'currentUser')
            : [...likedBy, 'currentUser']
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId: string, commentContent: string) => {
    // TODO: backend - POST /api/posts/:id/comments
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: `comment_${Date.now()}`,
          content: commentContent,
          author: 'Demo User',
          created_at: new Date().toISOString(),
        };
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
          <p className="text-muted-foreground">
            {isMember ? "Be the first to start a conversation!" : "Join the community to participate"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCardWithComments
          key={post.id}
          post={post}
          isMember={isMember}
          onLike={() => handleLike(post.id)}
          onAddComment={(content) => handleAddComment(post.id, content)}
        />
      ))}
    </div>
  );
};

// PostCardWithComments component
interface PostCardWithCommentsProps {
  post: Post;
  isMember: boolean;
  onLike: () => void;
  onAddComment: (content: string) => void;
}

const PostCardWithComments = ({ post, isMember, onLike, onAddComment }: PostCardWithCommentsProps) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [reactions, setReactions] = useState({
    thumbsUp: 0,
    heart: 0,
    smile: 0,
  });

  const isLiked = post.likedBy?.includes('currentUser') || false;

  const handleReaction = (type: 'thumbsUp' | 'heart' | 'smile') => {
    // TODO: backend - POST /api/posts/:id/reactions
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <Card data-testid={`post-${post.id}`}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{post.author}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Post content */}
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>

        {/* Likes and reactions */}
        <div className="flex items-center gap-4 pt-2 border-t">
          <Button
            variant={isLiked ? "default" : "ghost"}
            size="sm"
            onClick={onLike}
            className="gap-2"
            data-testid={`button-like-${post.id}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('thumbsUp')}
            className="gap-2"
            data-testid={`button-thumbsup-${post.id}`}
          >
            <ThumbsUp className="h-4 w-4" />
            {reactions.thumbsUp > 0 && <span>{reactions.thumbsUp}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('heart')}
            className="gap-2"
            data-testid={`button-heart-${post.id}`}
          >
            <Heart className="h-4 w-4" />
            {reactions.heart > 0 && <span>{reactions.heart}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleReaction('smile')}
            className="gap-2"
            data-testid={`button-smile-${post.id}`}
          >
            <Smile className="h-4 w-4" />
            {reactions.smile > 0 && <span>{reactions.smile}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2 ml-auto"
            data-testid={`button-toggle-comments-${post.id}`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{post.comments.length}</span>
            {showComments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t" data-testid={`comments-section-${post.id}`}>
            {/* Existing comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3" data-testid={`comment-${comment.id}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="font-semibold text-sm">{comment.author}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-3">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}

            {/* Add comment form */}
            {isMember && (
              <div className="flex gap-3 pt-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none"
                    data-testid={`input-comment-${post.id}`}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      data-testid={`button-submit-comment-${post.id}`}
                    >
                      <Send className="h-3 w-3 mr-2" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
