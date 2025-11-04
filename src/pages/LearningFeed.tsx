import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { LessonCard } from '@/components/feed/LessonCard';
import { PollCard } from '@/components/feed/PollCard';
import { LiveCard } from '@/components/feed/LiveCard';
import { ResourceCard } from '@/components/feed/ResourceCard';
import { FeedCardSkeleton } from '@/components/skeletons/FeedCardSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Tag, Bookmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content_url: string;
  duration_minutes: number;
  module: {
    track: {
      id: string;
      title: string;
      interest_tags?: string[];
    };
  };
  lesson_progress: Array<{
    status: string;
    completion_date: string;
  }>;
}

const AVAILABLE_INTERESTS = [
  'Funding', 'Business', 'Branding', 'AI', 'Marketing', 
  'Operations', 'Leadership', 'Technology', 'Design'
];

export const LearningFeed = () => {
  const { toast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUserInterests();
    fetchFeedContent();
  }, [selectedInterests.length]);

  const fetchUserInterests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_interests')
      .select('interest_tag')
      .eq('user_id', user.id);

    const interests = data?.map(d => d.interest_tag) || [];
    setSelectedInterests(interests);
  };

  const toggleInterest = async (interest: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (selectedInterests.includes(interest)) {
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('interest_tag', interest);
      
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      await supabase
        .from('user_interests')
        .insert({ user_id: user.id, interest_tag: interest });
      
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const toggleBookmark = async (lessonId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (bookmarkedLessons.has(lessonId)) {
      await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('bookmarkable_type', 'lesson')
        .eq('bookmarkable_id', lessonId);
      
      setBookmarkedLessons(prev => {
        const next = new Set(prev);
        next.delete(lessonId);
        return next;
      });
      
      toast({ title: 'Bookmark removed' });
    } else {
      await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          bookmarkable_type: 'lesson',
          bookmarkable_id: lessonId
        });
      
      setBookmarkedLessons(prev => new Set([...prev, lessonId]));
      toast({ title: 'Lesson bookmarked!' });
    }
  };

  const fetchFeedContent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch lessons
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          module:modules!inner(
            id,
            track:tracks!inner(
              id,
              title,
              interest_tags
            )
          ),
          lesson_progress(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Filter by selected interests on client side
      let filteredLessons = data || [];
      if (selectedInterests.length > 0) {
        filteredLessons = filteredLessons.filter(lesson => {
          const trackTags = lesson.module?.track?.interest_tags || [];
          return selectedInterests.some(interest => trackTags.includes(interest));
        });
      }

      setLessons(filteredLessons);

      // Fetch user's bookmarks
      const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('bookmarkable_id')
        .eq('user_id', user.id)
        .eq('bookmarkable_type', 'lesson');

      setBookmarkedLessons(new Set(bookmarks?.map(b => b.bookmarkable_id) || []));
    } catch (error) {
      console.error('Error fetching feed content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Explore & Discover</h1>
          <p className="text-muted-foreground">Find new lessons and resources tailored to your interests</p>
        </div>

        {/* Interest Tags Filter */}
        <div className="mb-6 p-4 bg-card dark:bg-neutral-800 rounded-lg border dark:border-neutral-700">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Filter by Interests</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Feed Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6 mt-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <FeedCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Sample Poll Card */}
                <PollCard
                  question="What's your biggest challenge in your learning journey?"
                  options={[
                    { id: '1', text: 'Finding time to study', votes: 45 },
                    { id: '2', text: 'Staying motivated', votes: 32 },
                    { id: '3', text: 'Understanding complex topics', votes: 28 },
                    { id: '4', text: 'Applying what I learn', votes: 15 },
                  ]}
                  totalVotes={120}
                  hasVoted={false}
                />

                {/* Sample Live Streaming Card */}
                <LiveCard
                  eventId="sample-event-1"
                  title="Live Q&A: Building Your First Business"
                  description="Join us for an interactive session on starting your entrepreneurial journey"
                  instructorName="Sarah Johnson"
                  scheduledAt={new Date('2024-01-20T15:00:00Z')}
                  status="scheduled"
                  attendeeCount={234}
                  maxAttendees={500}
                  thumbnailUrl="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800"
                />

                {/* Sample Resource Card */}
                <ResourceCard
                  title="Complete Business Plan Template"
                  description="A comprehensive template to help you create a professional business plan"
                  resourceType="Template"
                  fileUrl="/resources/business-plan-template.pdf"
                  thumbnailUrl="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"
                />

                {/* Lesson Cards with Bookmark */}
                <div className="grid md:grid-cols-2 gap-6">
                  {lessons.map((lesson) => {
                    const progress = lesson.lesson_progress?.[0];
                    const isBookmarked = bookmarkedLessons.has(lesson.id);
                    
                    return (
                      <div key={lesson.id} className="relative">
                        <LessonCard
                          lessonId={lesson.id}
                          title={lesson.title}
                          description={lesson.description || ''}
                          thumbnailUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                          duration={lesson.duration_minutes || 0}
                          trackTitle={lesson.module?.track?.title || 'Unknown Track'}
                          progress={progress?.status === 'completed' ? 100 : 0}
                          completed={progress?.status === 'completed'}
                        />
                        <Button
                          size="sm"
                          variant={isBookmarked ? "default" : "outline"}
                          className="absolute top-4 right-4 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(lesson.id);
                          }}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {lessons.length === 0 && !loading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      {selectedInterests.length > 0 
                        ? 'No lessons match your selected interests. Try adjusting your filters.'
                        : 'No lessons available yet. Check back soon!'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-6 mt-6">
            <p className="text-center text-muted-foreground py-12">
              Trending content coming soon!
            </p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
