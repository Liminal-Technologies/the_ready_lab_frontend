import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  cover_photo?: string;
}

// Mock communities data
const MOCK_COMMUNITIES: Community[] = [
  {
    id: '1',
    name: 'Funding & Grants',
    description: 'Connect with experts in fundraising, grant writing, and securing capital for your ventures.',
    category: 'Funding',
    member_count: 2847,
    cover_photo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Legal & Compliance',
    description: 'Navigate legal challenges, contracts, and regulatory requirements with fellow entrepreneurs.',
    category: 'Legal',
    member_count: 1923,
    cover_photo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=200&fit=crop'
  },
  {
    id: '3',
    name: 'Marketing & Branding',
    description: 'Share strategies, campaigns, and creative ideas to grow your brand and reach your audience.',
    category: 'Branding',
    member_count: 3521,
    cover_photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
  },
  {
    id: '4',
    name: 'Tech Infrastructure',
    description: 'Discuss technical architecture, cloud solutions, and infrastructure best practices.',
    category: 'Infrastructure',
    member_count: 2156,
    cover_photo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop'
  },
  {
    id: '5',
    name: 'Financial Planning',
    description: 'Master budgeting, forecasting, and financial management for sustainable growth.',
    category: 'Finance',
    member_count: 2034,
    cover_photo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop'
  },
  {
    id: '6',
    name: 'AI & Innovation',
    description: 'Explore artificial intelligence, machine learning, and cutting-edge technologies.',
    category: 'AI',
    member_count: 4102,
    cover_photo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop'
  },
];

const CommunityJoin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [communities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load joined communities from localStorage
    const stored = localStorage.getItem('joinedCommunities');
    if (stored) {
      setJoinedCommunities(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const isJoined = (communityId: string) => {
    return joinedCommunities.includes(communityId);
  };

  const handleToggleCommunity = (communityId: string, communityName: string) => {
    // TODO: backend - POST/DELETE /api/community-members
    // await fetch(`/api/community-members`, { method: 'POST', body: JSON.stringify({ communityId }) })
    
    const joined = isJoined(communityId);
    
    let updatedCommunities: string[];
    if (joined) {
      // Leave community
      updatedCommunities = joinedCommunities.filter(id => id !== communityId);
      toast({
        title: "Left community",
        description: `You've left ${communityName}`,
      });
    } else {
      // Join community
      updatedCommunities = [...joinedCommunities, communityId];
      toast({
        title: "Joined community! 🎉",
        description: `Welcome to ${communityName}`,
      });
    }
    
    setJoinedCommunities(updatedCommunities);
    localStorage.setItem('joinedCommunities', JSON.stringify(updatedCommunities));
  };

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

            <div className="grid md:grid-cols-2 gap-6">
              {communities.map((community) => {
                const joined = isJoined(community.id);
                return (
                  <Card 
                    key={community.id} 
                    className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => joined && navigate(`/community/${community.id}`)}
                    data-testid={`community-card-${community.id}`}
                  >
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
                        <Badge variant={joined ? "default" : "secondary"}>
                          {joined ? "Joined" : "Open"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{community.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        {community.member_count.toLocaleString()} members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {community.description}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1" 
                          variant={joined ? "outline" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCommunity(community.id, community.name);
                          }}
                          data-testid={`button-toggle-${community.id}`}
                        >
                          {joined ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Leave Community
                            </>
                          ) : (
                            'Join Community'
                          )}
                        </Button>
                        {joined && (
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/community/${community.id}`);
                            }}
                            data-testid={`button-view-${community.id}`}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityJoin;
