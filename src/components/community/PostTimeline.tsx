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

// Community-specific posts
const FUNDING_GRANTS_POSTS: Post[] = [
  {
    id: 'funding_post_1',
    content: '📌 PINNED: Funding Resources Megathread\n\n🎯 Grant Databases:\n• grants.gov - Federal grants\n• Foundation Directory Online - Private foundations\n• SBIR.gov - Small Business Innovation Research\n\n💰 Pitch Deck Templates:\n• Y Combinator standard deck\n• Sequoia Capital pitch template\n\n📚 Recommended Reading:\n• "Venture Deals" by Brad Feld\n• "The Art of Startup Fundraising" by Alejandro Cremades\n\nFeel free to add your favorite resources in the comments!',
    author: 'Sarah Johnson (Moderator)',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_1',
        content: 'Adding: pitch.com has great free templates and pitch-deck.com for inspiration!',
        author: 'Michael Chen',
        created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'funding_comment_2',
        content: 'Don\'t forget about AngelList and Crunchbase for researching VCs and their portfolios!',
        author: 'Emma Davis',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'funding_post_2',
    content: 'Just closed $500K seed round! 🎉\n\nQuick stats:\n• 37 investor conversations\n• 14 pitch decks sent\n• 8 term sheets received\n• 3 months from first pitch to close\n\nBiggest lesson: Investors invest in people first, ideas second. Our traction helped, but the rapport we built during coffee chats sealed the deals.\n\nHappy to answer questions!',
    author: 'Alex Rodriguez',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_3',
        content: 'Congrats! What was your valuation if you don\'t mind sharing? Trying to gauge what\'s reasonable for pre-revenue SaaS.',
        author: 'James Wilson',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'funding_comment_4',
        content: 'Amazing achievement! Did you use a lead investor or syndicate? How did you structure it?',
        author: 'Priya Patel',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'funding_post_3',
    content: 'NSF SBIR Phase I - Application Tips 🚀\n\nJust submitted ours (fingers crossed). Here\'s what worked:\n\n1. Start with the "Broader Impacts" section - reviewers care about societal benefit\n2. Get a technical advisor with NSF grant experience\n3. Budget EVERYTHING down to the penny\n4. Letters of support from potential customers = gold\n5. Don\'t underestimate the commercialization plan\n\nDeadlines are quarterly, so plan ahead. The $275K non-dilutive funding is worth the effort!',
    author: 'Dr. Lisa Chang',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likes: 67,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_5',
        content: 'This is super helpful! Did you hire a grant writer or do it yourself? We\'re debating...',
        author: 'Marcus Thompson',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'funding_post_4',
    content: 'Red flags from my investor meetings - learn from my mistakes:\n\n🚩 VC asked for 40% equity at seed stage (RUN)\n🚩 "We don\'t do term sheets, just send us your docs" (sketchy)\n🚩 Investor ghosted for 3 weeks then came back demanding answer in 48hrs\n🚩 No clear fund thesis - investing in "everything"\n🚩 Wanted board control before even checking references\n\nTrust your gut. Good investors respect your time and bring more than just money.',
    author: 'Kenji Tanaka',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 142,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_6',
        content: '40% at seed is WILD. Standard is 10-20%. Thanks for the heads up!',
        author: 'Sarah Johnson',
        created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'funding_comment_7',
        content: 'Adding: if they ask for NDA before seeing your deck, also a red flag. Ideas aren\'t worth protecting that early.',
        author: 'Emma Davis',
        created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'funding_post_5',
    content: 'Question: Bootstrapping vs. raising capital?\n\nWe\'ve been profitable for 6 months ($15K MRR) but growing slowly. VCs are interested but I\'m worried about:\n• Losing control\n• Pressure to scale too fast\n• Misaligned incentives\n\nOn the other hand, our competitors just raised $2M and are hiring aggressively. Feeling FOMO.\n\nAnyone been in this position? What helped you decide?',
    author: 'Maria Gonzalez',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 54,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_8',
        content: 'I was in the exact same spot. We took the money and grew 10x in 18 months. Best decision ever, but it\'s not for everyone.',
        author: 'Alex Rodriguez',
        created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'funding_comment_9',
        content: 'Unpopular opinion: if you\'re profitable and growing, keep bootstrapping until you NEED the cash for something specific (hiring, inventory, etc). Don\'t raise just because you can.',
        author: 'James Wilson',
        created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'funding_post_6',
    content: 'Foundation grants for social enterprises - my experience 💚\n\nJust received $50K from a family foundation! Here\'s what worked:\n\n✅ Clear social impact metrics (we track lives improved, not just revenue)\n✅ Video testimonials from beneficiaries\n✅ Partnership with established nonprofit\n✅ Transparent budget breakdown\n✅ Sustainability plan (how we\'ll continue after grant ends)\n\nFamily foundations are more relationship-driven than federal grants. Get warm intros if possible!',
    author: 'Aisha Mohammed',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 78,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_10',
        content: 'Congrats! How long was the application process? We\'re considering applying to several.',
        author: 'Olivia Martinez',
        created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'funding_post_7',
    content: 'Pitch deck feedback request 🙏\n\nHeading into investor meetings next week. Would love eyes on my deck:\n• 12 slides total\n• Pre-revenue but have 500 beta signups\n• Asking for $750K seed\n\nSpecific questions:\n1. Is my market size slide credible? (TAM $5B)\n2. Should I include competitor comparison or focus on differentiation?\n3. Financial projections - conservative or ambitious?\n\nDM if you\'re willing to review. Happy to return the favor!',
    author: 'David Kim',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 31,
    likedBy: [],
    comments: [
      {
        id: 'funding_comment_11',
        content: 'DM\'d you! I review decks for our accelerator cohort, happy to help.',
        author: 'Michael Chen',
        created_at: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

// Default posts for other communities
const DEFAULT_POSTS: Post[] = [
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

// Select posts based on community
const getCommunityPosts = (communityId: string): Post[] => {
  if (communityId === '1') {
    return FUNDING_GRANTS_POSTS;
  }
  return DEFAULT_POSTS;
};

const INITIAL_POSTS: Post[] = [];

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
      const communityPosts = getCommunityPosts(communityId);
      
      if (storedPosts) {
        const parsed = JSON.parse(storedPosts);
        setPosts([...parsed, ...communityPosts]);
      } else {
        setPosts(communityPosts);
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
