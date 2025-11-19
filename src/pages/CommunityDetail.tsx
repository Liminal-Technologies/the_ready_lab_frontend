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

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  cover_photo?: string;
  visibility?: string;
  rules?: string[];
  created_at?: string;
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

// Mock data for communities
const MOCK_COMMUNITIES: Record<string, Community> = {
  '1': { id: '1', name: 'Funding & Grants', description: 'Connect with experts in fundraising, grant writing, and securing capital for your ventures.', category: 'Funding', member_count: 2847, cover_photo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop', visibility: 'Public', created_at: '2024-01-15', rules: ['Be respectful', 'Stay on topic', 'No spam'] },
  '2': { id: '2', name: 'Legal & Compliance', description: 'Navigate legal challenges, contracts, and regulatory requirements with fellow entrepreneurs.', category: 'Legal', member_count: 1923, cover_photo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop', visibility: 'Public', created_at: '2024-02-20', rules: ['Be respectful', 'Stay on topic', 'No spam'] },
  '3': { id: '3', name: 'Marketing & Branding', description: 'Share strategies, campaigns, and creative ideas to grow your brand and reach your audience.', category: 'Branding', member_count: 3521, cover_photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop', visibility: 'Public', created_at: '2024-03-10', rules: ['Be respectful', 'Stay on topic', 'No spam'] },
  '4': { id: '4', name: 'Tech Infrastructure', description: 'Discuss technical architecture, cloud solutions, and infrastructure best practices.', category: 'Infrastructure', member_count: 2156, cover_photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop', visibility: 'Public', created_at: '2024-04-05', rules: ['Be respectful', 'Stay on topic', 'No spam'] },
  '5': { id: '5', name: 'Financial Planning', description: 'Master budgeting, forecasting, and financial management for sustainable growth.', category: 'Finance', member_count: 2034, cover_photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop', visibility: 'Public', created_at: '2024-05-12', rules: ['Be respectful', 'Stay on topic', 'No spam'] },
  '6': { id: '6', name: 'AI & Innovation', description: 'Explore artificial intelligence, machine learning, and cutting-edge technologies.', category: 'AI', member_count: 4102, cover_photo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop', visibility: 'Public', created_at: '2024-06-01', rules: ['Be respectful', 'Stay on topic', 'No spam'] },
};

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
  const [isMember, setIsMember] = useState(false);
  const [isModerator] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [postRefreshKey, setPostRefreshKey] = useState(0);

  useEffect(() => {
    if (communityId) {
      fetchCommunityDetails();
    }
  }, [communityId]);

  const fetchCommunityDetails = () => {
    // TODO: backend - GET /api/communities/:id
    // const response = await fetch(`/api/communities/${communityId}`)
    setTimeout(() => {
      const communityData = MOCK_COMMUNITIES[communityId || '1'];
      setCommunity(communityData || null);

      // Check if user is a member from localStorage
      const joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');
      setIsMember(joinedCommunities.includes(communityId));
      setLoading(false);
    }, 500);
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
    navigate('/community/join');
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
                <Button onClick={() => navigate('/community/join')}>
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
              {community.cover_photo && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={community.cover_photo} 
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
                        {community.member_count} members
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
                                {(member.profiles?.full_name || member.profiles?.email || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.profiles?.full_name || member.profiles?.email || 'Unknown User'}
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
                    {community.rules && (
                      <div>
                        <h4 className="font-semibold mb-2">Community Rules</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {community.rules}
                        </p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold mb-2">Created</h4>
                      <p className="text-muted-foreground">
                        {new Date(community.created_at).toLocaleDateString()}
                      </p>
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