import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Community {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  visibility: string;
  created_at: string;
  cover_photo: string | null;
}

const CommunityJoin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('visibility', 'open')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: "Failed to load communities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCommunity = async (communityId: string) => {
    try {
      setJoiningId(communityId);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to join a community",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: user.id,
          role: 'member',
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already a member",
            description: "You're already part of this community",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success",
          description: "You've joined the community!",
        });
        navigate(`/community/${communityId}`);
      }
    } catch (error) {
      console.error('Error joining community:', error);
      toast({
        title: "Error",
        description: "Failed to join community",
        variant: "destructive",
      });
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Join a Community</h1>
              <p className="text-lg text-muted-foreground">
                Connect with like-minded learners and professionals in your field
              </p>
            </div>

            {communities.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to create a community!
                  </p>
                  <Button onClick={() => navigate('/community/create')}>
                    Create Community
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {communities.map((community) => (
                  <Card key={community.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {community.cover_photo && (
                      <div className="w-full h-32 overflow-hidden">
                        <img 
                          src={community.cover_photo} 
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="secondary">Open</Badge>
                      </div>
                      <CardTitle className="text-xl">{community.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {community.member_count} members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {community.description || "No description available"}
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={() => handleJoinCommunity(community.id)}
                        disabled={joiningId === community.id}
                      >
                        {joiningId === community.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          'Join Community'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityJoin;
