import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Settings, ArrowLeft, Shield, Send, Video, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PostTimeline } from '@/components/community/PostTimeline';
import { api } from '@/services/api';

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  coverPhoto?: string;
  visibility?: string;
  rules?: string[];
  createdAt?: string;
  isPrivate?: boolean;
  postsToday?: number;
}

interface Member {
  id: string;
  name: string;
  role: string;
  joined_at: string;
  profiles?: {
    full_name?: string;
  };
}

interface LiveEvent {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
}

const MOCK_MEMBERS: Member[] = [
  { id: '1', name: 'Sarah Johnson', role: 'admin', joined_at: '2024-01-15' },
  { id: '2', name: 'Michael Chen', role: 'moderator', joined_at: '2024-02-20' },
  { id: '3', name: 'Emma Davis', role: 'member', joined_at: '2024-03-10' },
  { id: '4', name: 'James Wilson', role: 'member', joined_at: '2024-04-05' },
  { id: '5', name: 'Olivia Martinez', role: 'member', joined_at: '2024-05-12' },
];

const MOCK_LIVE_EVENTS: LiveEvent[] = [
  { id: '1', title: 'Grant Writing Workshop', host: 'Sarah Johnson', date: '2025-11-10', time: '2:00 PM EST' },
  { id: '2', title: 'Investor Pitch Practice', host: 'Michael Chen', date: '2025-11-15', time: '4:00 PM EST' },
  { id: '3', title: 'Q&A with VC Partner', host: 'Emma Davis', date: '2025-11-20', time: '6:00 PM EST' },
];

const CommunityDetail = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [communityId]);
  const [isMember, setIsMember] = useState(false);
  const [isModerator] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postRefreshKey, setPostRefreshKey] = useState(0);

  useEffect(() => {
    if (communityId) {
      fetchCommunityDetails();
    }
  }, [communityId]);

  const fetchCommunityDetails = async () => {
    try {
      setLoading(true);
      const response = await api.communities.get(communityId!);

      // Transform API response to match component interface
      const communityData: Community = {
        id: response.id,
        name: response.name,
        description: response.description || '',
        category: (response as any).category || 'General',
        memberCount: (response as any).memberCount || response.member_count || 0,
        coverPhoto: (response as any).coverPhoto || (response as any).cover_photo,
        visibility: (response as any).visibility || ((response as any).isPrivate ? 'Private' : 'Public'),
        rules: (response as any).rules || [],
        createdAt: response.created_at,
        isPrivate: (response as any).isPrivate,
        postsToday: (response as any).postsToday || 0,
      };

      setCommunity(communityData);

      // Check if user is a member from localStorage
      const joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');
      setIsMember(joinedCommunities.includes(communityId));
    } catch (error) {
      console.error('Failed to fetch community:', error);
      setCommunity(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCommunity = () => {
    // TODO: backend - DELETE /api/community-members
    const joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');
    const updated = joinedCommunities.filter((id: string) => id !== communityId);
    localStorage.setItem('joinedCommunities', JSON.stringify(updated));
    
    toast({
      title: "Left community",
      description: `You've left ${community?.name}`,
    });
    navigate('/community/browse');
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    // TODO: backend - POST /api/posts
    // await fetch('/api/posts', { method: 'POST', body: JSON.stringify({ communityId, content: newPostContent }) })
    
    const postsKey = `communityPosts_${communityId}`;
    const existingPosts = JSON.parse(localStorage.getItem(postsKey) || '[]');
    
    const newPost = {
      id: `post_${Date.now()}`,
      content: newPostContent,
      author: 'Demo User',
      created_at: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    
    const updatedPosts = [newPost, ...existingPosts];
    localStorage.setItem(postsKey, JSON.stringify(updatedPosts));
    
    setNewPostContent('');
    setPostRefreshKey(prev => prev + 1); // Trigger PostTimeline refresh
    
    toast({
      title: "Post created! 🎉",
      description: "Your post has been shared with the community",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Loading community...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="py-12 text-center">
                <h3 className="text-lg font-semibold mb-2">Community not found</h3>
                <Button onClick={() => navigate('/community/browse')}>
                  Browse Communities
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Community Header */}
            <Card className="mb-6 overflow-hidden">
              {community.coverPhoto && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={community.coverPhoto}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-3xl">{community.name}</CardTitle>
                      {isModerator && (
                        <Badge variant="default">
                          <Shield className="h-3 w-3 mr-1" />
                          Moderator
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{community.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {community.memberCount?.toLocaleString()} members
                      </div>
                      <Badge variant="secondary">{community.visibility}</Badge>
                    </div>
                  </div>
                  {isMember && (
                    <div className="flex gap-2">
                      {isModerator && (
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={handleLeaveCommunity}>
                        Leave Community
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Main content - Posts */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Create Post Card */}
                    {isMember && (
                      <Card data-testid="create-post-card">
                        <CardHeader>
                          <CardTitle className="text-lg">Share with the community</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea
                            placeholder="What's on your mind? Share updates, ask questions, or start a discussion..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="min-h-[100px] resize-none"
                            data-testid="input-create-post"
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={handleCreatePost}
                              disabled={!newPostContent.trim()}
                              data-testid="button-submit-post"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Post
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Post Timeline */}
                    <PostTimeline
                      key={postRefreshKey}
                      communityId={communityId!}
                      isMember={isMember}
                    />
                  </div>

                  {/* Sidebar - Live Q&A Events */}
                  <div className="space-y-4">
                    <Card data-testid="live-qa-panel">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Video className="h-5 w-5 text-primary" />
                          Upcoming Live Q&A
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {MOCK_LIVE_EVENTS.map((event) => (
                          <div
                            key={event.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow space-y-2"
                            data-testid={`live-event-${event.id}`}
                          >
                            <div className="flex items-start gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                              <div className="flex-1 space-y-1">
                                <h4 className="font-semibold text-sm">{event.title}</h4>
                                <p className="text-xs text-muted-foreground">
                                  Host: {event.host}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(event.date).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })} at {event.time}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="w-full"
                              variant="outline"
                              data-testid={`button-join-event-${event.id}`}
                              onClick={() => {
                                toast({
                                  title: "Event reminder set! 📅",
                                  description: `You'll be notified before "${event.title}" starts`,
                                });
                              }}
                            >
                              Set Reminder
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Community Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Joined {new Date(member.joined_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={member.role === 'admin' || member.role === 'moderator' ? 'default' : 'secondary'}>
                            {member.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Community</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-muted-foreground">
                        {community.description || 'No description available'}
                      </p>
                    </div>
                    {community.rules && community.rules.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Community Rules</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {community.rules.map((rule, index) => (
                            <li key={index} className="text-muted-foreground">{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Created</h4>
                      <p className="text-muted-foreground">
                        {community.createdAt ? new Date(community.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Category</h4>
                      <Badge variant="secondary">{community.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityDetail;