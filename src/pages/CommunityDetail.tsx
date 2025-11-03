import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CourseCardSkeleton } from '@/components/skeletons/CourseCardSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Settings, ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PostTimeline } from '@/components/community/PostTimeline';

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  visibility: string;
  created_by: string;
  created_at: string;
  rules: string | null;
  cover_photo: string | null;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

const CommunityDetail = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (communityId) {
      fetchCommunityDetails();
    }
  }, [communityId]);

  const fetchCommunityDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch community details
      const { data: communityData, error: communityError } = await supabase
        .from('communities')
        .select('*')
        .eq('id', communityId)
        .single();

      if (communityError) throw communityError;
      setCommunity(communityData);

      if (user) {
        // Check if user is a member
        const { data: memberData } = await supabase
          .from('community_members')
          .select('role')
          .eq('community_id', communityId)
          .eq('user_id', user.id)
          .single();

        setIsMember(!!memberData);
        setIsModerator(memberData?.role === 'moderator' || memberData?.role === 'admin' || communityData.created_by === user.id);
      }

      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from('community_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('community_id', communityId)
        .order('joined_at', { ascending: false });

      if (membersError) throw membersError;
      setMembers(membersData || []);

    } catch (error) {
      console.error('Error fetching community:', error);
      toast({
        title: "Error",
        description: "Failed to load community details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', currentUserId);

      if (error) throw error;

      toast({
        title: "Left community",
        description: "You have left the community",
      });
      navigate('/community/join');
    } catch (error) {
      console.error('Error leaving community:', error);
      toast({
        title: "Error",
        description: "Failed to leave community",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="h-8 w-32 mb-4 bg-muted animate-pulse rounded" />
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </div>
            </div>
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
                <PostTimeline
                  communityId={communityId!}
                  isMember={isMember}
                  isModerator={isModerator}
                  currentUserId={currentUserId}
                />
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