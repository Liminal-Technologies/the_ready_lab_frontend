import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { LessonCard } from '@/components/feed/LessonCard';
import { PollCard } from '@/components/feed/PollCard';
import { LiveCard } from '@/components/feed/LiveCard';
import { ResourceCard } from '@/components/feed/ResourceCard';
import { FeedCardSkeleton } from '@/components/skeletons/FeedCardSkeleton';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
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

    try {
      const data = await api.userInterests.list(user.id);
      const interests = data?.map(d => d.interest) || [];
      setSelectedInterests(interests);
    } catch (error) {
      console.error('Error fetching user interests:', error);
    }
  };

  const toggleInterest = async (interest: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (selectedInterests.includes(interest)) {
        await api.userInterests.remove(user.id, interest);
        setSelectedInterests(prev => prev.filter(i => i !== interest));
      } else {
        await api.userInterests.add(user.id, interest);
        setSelectedInterests(prev => [...prev, interest]);
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
    }
  };

  const toggleBookmark = async (lessonId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (bookmarkedLessons.has(lessonId)) {
        await api.bookmarks.deleteByItem(user.id, 'lesson', lessonId);

        setBookmarkedLessons(prev => {
          const next = new Set(prev);
          next.delete(lessonId);
          return next;
        });

        toast({ title: 'Bookmark removed' });
      } else {
        await api.bookmarks.create('lesson', lessonId);

        setBookmarkedLessons(prev => new Set([...prev, lessonId]));
        toast({ title: 'Lesson bookmarked!' });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const fetchFeedContent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch lessons via API with includes for module, track, and progress
      const feedResponse = await api.lessons.feed({
        user_id: user.id,
        include: ['module', 'track', 'progress'],
        interest_tags: selectedInterests.length > 0 ? selectedInterests : undefined,
        limit: 20,
      });

      // Map to expected format
      const mappedLessons = (feedResponse.data || []).map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        content_url: lesson.content_url || lesson.contentUrl,
        duration_minutes: lesson.duration_minutes || lesson.durationMinutes || 0,
        module: lesson.module ? {
          track: lesson.track || lesson.module?.track || { id: '', title: 'Unknown Track' }
        } : { track: { id: '', title: 'Unknown Track' } },
        lesson_progress: lesson.progress ? [lesson.progress] : [],
      }));

      setLessons(mappedLessons);

      // Fetch user's bookmarks via API
      const bookmarksResponse = await api.bookmarks.list(user.id, {
        type: 'lesson',
      });

      setBookmarkedLessons(new Set(
        (bookmarksResponse.data || []).map((b: any) => b.bookmarkable_id || b.bookmarkableId)
      ));
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
