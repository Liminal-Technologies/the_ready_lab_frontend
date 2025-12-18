import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronRight,
  SlidersHorizontal,
  Users,
  MessageCircle,
  TrendingUp,
  Lock,
  Unlock,
  Search,
  X,
  Calendar,
  Crown,
  Plus,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { api } from "@/services/api";

const COMMUNITY_TOPICS = [
  'Funding', 'Legal', 'Marketing', 'Infrastructure',
  'Branding', 'Finance', 'AI', 'Operations'
];

// Icon mapping based on category
const CATEGORY_ICONS: Record<string, string> = {
  'Funding': '💰',
  'Legal': '🏛️',
  'Marketing': '📈',
  'Infrastructure': '⚙️',
  'Branding': '🎨',
  'Finance': '💵',
  'AI': '💻',
  'Operations': '⚙️',
  'General': '🌐',
};

// Image mapping based on category
const CATEGORY_IMAGES: Record<string, string> = {
  'Funding': '/attached_assets/stock_images/partnership_handshak_d5c0b270.jpg',
  'Legal': '/attached_assets/stock_images/diverse_business_tea_d87c6b57.jpg',
  'Marketing': '/attached_assets/stock_images/business_operations__a3e6e538.jpg',
  'Infrastructure': '/attached_assets/stock_images/business_operations__a3e6e538.jpg',
  'Branding': '/attached_assets/stock_images/branding_marketing_s_50e607b2.jpg',
  'Finance': '/attached_assets/stock_images/financial_planning_a_96357d65.jpg',
  'AI': '/attached_assets/stock_images/artificial_intellige_80651e44.jpg',
  'Operations': '/attached_assets/stock_images/business_operations__a3e6e538.jpg',
  'General': '/attached_assets/stock_images/diverse_community_pe_a18abfb1.jpg',
};

interface CommunityData {
  id: string;
  name: string;
  topic: string;
  members: number;
  description: string;
  postsToday: number;
  isPrivate: boolean;
  isJoined: boolean;
  icon: string;
  image: string;
}

const trendingDiscussions = [
  { title: "How to respond to grant rejections?", replies: 45, community: "Funding" },
  { title: "Best AI tools for market research", replies: 32, community: "AI" },
  { title: "Building a fundable brand on a budget", replies: 28, community: "Branding" }
];

const Community = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showPrivate, setShowPrivate] = useState(false);
  const [showJoined, setShowJoined] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<CommunityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      const response = await api.communities.list();
      const joinedCommunities = JSON.parse(localStorage.getItem('joinedCommunities') || '[]');

      // Transform API response to match component interface
      const transformedCommunities: CommunityData[] = ((response as any)?.communities || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        topic: c.category || 'General',
        members: c.memberCount || 0,
        description: c.description || '',
        postsToday: c.postsToday || 0,
        isPrivate: c.isPrivate || c.type === 'private',
        isJoined: joinedCommunities.includes(c.id),
        icon: CATEGORY_ICONS[c.category] || '🌐',
        image: c.thumbnailUrl || c.coverPhoto || CATEGORY_IMAGES[c.category] || CATEGORY_IMAGES['General'],
      }));

      setCommunities(transformedCommunities);
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
    } else {
      setSelectedTopics(prev => [...prev, topic]);
    }
  };

  const clearFilters = () => {
    setSelectedTopics([]);
    setShowPrivate(false);
    setShowJoined(false);
    setSearchQuery("");
  };

  // Filter communities
  const filteredCommunities = communities.filter(community => {
    const topicMatch = selectedTopics.length === 0 || selectedTopics.includes(community.topic);
    const privateMatch = !showPrivate || community.isPrivate;
    const joinedMatch = !showJoined || community.isJoined;
    
    const searchMatch = !searchQuery || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.topic.toLowerCase().includes(searchQuery.toLowerCase());
    
    return topicMatch && privateMatch && joinedMatch && searchMatch;
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Topics */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#9333EA]" />
          By Topic
        </h3>
        <div className="space-y-2">
          {COMMUNITY_TOPICS.map(topic => (
            <div key={topic} className="flex items-center space-x-2">
              <Checkbox
                id={`topic-${topic}`}
                checked={selectedTopics.includes(topic)}
                onCheckedChange={() => toggleTopic(topic)}
                data-testid={`checkbox-topic-${topic.toLowerCase()}`}
              />
              <label
                htmlFor={`topic-${topic}`}
                className="text-sm font-medium leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer break-words"
              >
                {topic}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <h3 className="font-semibold mb-3">Type</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-private"
              checked={showPrivate}
              onCheckedChange={(checked) => setShowPrivate(checked as boolean)}
              data-testid="checkbox-private"
            />
            <label
              htmlFor="filter-private"
              className="text-sm font-medium leading-tight cursor-pointer break-words"
            >
              Private Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-joined"
              checked={showJoined}
              onCheckedChange={(checked) => setShowJoined(checked as boolean)}
              data-testid="checkbox-joined"
            />
            <label
              htmlFor="filter-joined"
              className="text-sm font-medium leading-tight cursor-pointer break-words"
            >
              My Communities
            </label>
          </div>
        </div>
      </div>

      <Button 
        onClick={clearFilters} 
        variant="outline" 
        className="w-full"
        data-testid="button-clear-filters"
      >
        Clear All Filters
      </Button>

      <Button 
        className="w-full bg-[#9333EA] hover:bg-[#7C3AED] text-white"
        data-testid="button-save-filter"
      >
        Save Filter
      </Button>
    </div>
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 pt-20">
        {/* Main Content Container */}
        <div className="bg-white dark:bg-neutral-800 shadow-lg">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl pt-8 pb-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground" data-testid="link-home">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">Communities</span>
            </div>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black mb-2">
                Join a Community
              </h1>
              <p className="text-muted-foreground">
                <span className="text-[#9333EA] font-bold">+{filteredCommunities.length} communities</span> • Connect with like-minded learners
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="lg:hidden"
                    data-testid="button-open-filters"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Search Bar */}
              <div className="relative flex-1 lg:flex-none lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                  data-testid="input-search"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Create Community Button */}
              <Button 
                onClick={() => navigate('/community/create')}
                className="bg-[#9333EA] hover:bg-[#7C3AED] text-white"
                data-testid="button-create-community"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Create Community</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>

          {/* Topic Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {COMMUNITY_TOPICS.map(topic => (
              <Badge
                key={topic}
                variant={selectedTopics.includes(topic) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedTopics.includes(topic)
                    ? "bg-[#9333EA] hover:bg-[#7C3AED] text-white"
                    : "hover:border-[#9333EA]"
                }`}
                onClick={() => toggleTopic(topic)}
                data-testid={`chip-topic-${topic.toLowerCase()}`}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-[#9333EA]" />
                  Filter
                </h2>
                <FilterContent />
              </div>
            </div>
          </aside>

          {/* Communities Grid */}
          <div className="flex-1">
            {/* Trending Discussions - Horizontal Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#9333EA]" />
                Trending Discussions
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {trendingDiscussions.map((discussion, i) => (
                  <div key={i} className="text-sm p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors cursor-pointer border border-transparent hover:border-[#9333EA]">
                    <p className="font-medium hover:text-[#9333EA] line-clamp-2 mb-2">
                      {discussion.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageCircle className="h-3 w-3" />
                      <span>{discussion.replies} replies</span>
                      <span>•</span>
                      <span>{discussion.community}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-pulse">
                    <div className="h-32 bg-neutral-200 dark:bg-neutral-700"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4"></div>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                      <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <p className="text-muted-foreground">
                  No communities match your filters. Try adjusting your selection.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="card-interactive bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:border-[#9333EA]"
                    data-testid={`community-card-${community.id}`}
                  >
                    {/* Community Image */}
                    <div 
                      className="h-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${community.image})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
                      <div className="absolute top-4 left-4 text-4xl">
                        {community.icon}
                      </div>
                      {community.isPrivate && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-purple-600 text-white flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Private
                          </Badge>
                        </div>
                      )}
                      {community.isJoined && (
                        <div className="absolute bottom-4 left-4">
                          <Badge className="bg-green-600 text-white">
                            Joined ✓
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Community Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                          <Badge variant="outline" className="text-[#9333EA] border-[#9333EA] mb-2">
                            {community.topic}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {community.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{community.members.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{community.postsToday} today</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        className={`w-full ${
                          community.isJoined 
                            ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300" 
                            : "bg-[#9333EA] hover:bg-[#7C3AED] text-white"
                        }`}
                        onClick={() => navigate(`/community/${community.id}`)}
                        data-testid={`button-${community.isJoined ? 'view' : 'join'}-${community.id}`}
                      >
                        {community.isJoined ? "View Community" : community.isPrivate ? "Request to Join" : "Join Community"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/attached_assets/stock_images/diverse_community_pe_a18abfb1.jpg')" }}
        ></div>
        
        {/* Dark Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#9333EA]/95 via-[#7C3AED]/90 to-[#9333EA]/95"></div>
        
        {/* Additional Dark Overlay for Better Contrast */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-white text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black mb-4 drop-shadow-lg">
                Ready to connect?
              </h2>
              <p className="text-lg lg:text-xl text-white font-medium max-w-2xl drop-shadow-md">
                Join communities that match your interests and grow alongside fellow learners and entrepreneurs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/courses")}
                className="bg-white text-[#9333EA] hover:bg-neutral-100 font-bold text-lg px-10 py-6 shadow-xl"
                data-testid="button-browse-courses"
              >
                Browse Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Community;
