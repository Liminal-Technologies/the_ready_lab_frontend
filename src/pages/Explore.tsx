import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  SlidersHorizontal,
  Heart,
  MessageCircle,
  PlayCircle,
  Search,
  X,
  Bookmark,
  TrendingUp,
  Calendar,
  FileText,
  Tag,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { api, MicroLesson, CommunityPoll, Product } from "@/services/api";
import { format, formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

const AVAILABLE_INTERESTS = [
  'Funding', 'Business', 'Branding', 'AI', 'Marketing',
  'Operations', 'Leadership', 'Technology', 'Design'
];

interface LiveEvent {
  id: string;
  title: string;
  description: string | null;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
  max_participants: number | null;
  host?: {
    full_name: string;
  };
}

const Explore = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth.user;
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [microLessons, setMicroLessons] = useState<MicroLesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [poll, setPoll] = useState<CommunityPoll | null>(null);
  const [pollLoading, setPollLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [resources, setResources] = useState<Product[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const eventsCarouselRef = useRef<HTMLDivElement>(null);

  const scrollEvents = (direction: 'left' | 'right') => {
    if (eventsCarouselRef.current) {
      const scrollAmount = 340; // Card width + gap
      const newScrollPosition = eventsCarouselRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);
      eventsCarouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    fetchLiveEvents();
    fetchMicroLessons();
    fetchPoll();
    fetchResources();
  }, []);

  const fetchPoll = async () => {
    try {
      const response = await api.communityPolls.list({ is_active: true, limit: 1 });
      const polls = response?.data || [];
      if (polls.length > 0) {
        setPoll(polls[0]);
        // Check if user has already voted
        if (user?.id && polls[0].user_vote) {
          setSelectedPoll(polls[0].user_vote);
        }
      }
    } catch (error) {
      console.error('Error fetching poll:', error);
    } finally {
      setPollLoading(false);
    }
  };

  const handleVote = async () => {
    if (!poll || !selectedPoll || !user?.id) return;

    setIsVoting(true);
    try {
      await api.communityPolls.vote(poll.id, user.id, selectedPoll);
      // Refresh poll data to get updated counts
      const updatedPoll = await api.communityPolls.get(poll.id, user.id);
      setPoll(updatedPoll);
    } catch (error: any) {
      console.error('Error voting:', error);
      // If already voted, just show the message
      if (error.message?.includes('Already voted')) {
        // Still refresh to show current state
        const updatedPoll = await api.communityPolls.get(poll.id, user.id);
        setPoll(updatedPoll);
      }
    } finally {
      setIsVoting(false);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await api.products.list({ is_active: true });
      // API returns { products: [...] } but typed as Product[]
      const products = (response as any)?.products || response || [];
      setResources(products);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchMicroLessons = async () => {
    try {
      const response = await api.microLessons.list({ include: ['instructor'], limit: 20 });
      const lessons = response?.data || [];
      setMicroLessons(lessons);
    } catch (error) {
      console.error('Error fetching micro lessons:', error);
    } finally {
      setLessonsLoading(false);
    }
  };

  const fetchLiveEvents = async () => {
    try {
      const response = await api.liveEvents.list({ status: 'scheduled' });
      const events = (response as any)?.data || response || [];
      setLiveEvents(events);
    } catch (error) {
      console.error('Error fetching live events:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 86400000).toDateString();

    if (isToday) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d at h:mm a');
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const toggleBookmark = (lessonId: string) => {
    if (bookmarkedLessons.has(lessonId)) {
      setBookmarkedLessons(prev => {
        const next = new Set(prev);
        next.delete(lessonId);
        return next;
      });
    } else {
      setBookmarkedLessons(prev => new Set([...prev, lessonId]));
    }
  };

  const clearFilters = () => {
    setSelectedInterests([]);
    setSearchQuery("");
  };

  // Filter lessons
  const filteredLessons = microLessons.filter(lesson => {
    const interestMatch = selectedInterests.length === 0 ||
      selectedInterests.some(interest => (lesson.interest_tags || []).includes(interest));

    const searchMatch = !searchQuery ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.instructor?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase());

    return interestMatch && searchMatch;
  });

  // Helper to format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return mins < 1 ? '< 1 min' : `${mins} min`;
  };

  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to format time ago
  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return '';
    }
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Interest Tags */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-[#10A37F]" />
          <h3 className="font-semibold">Interests</h3>
        </div>
        <div className="space-y-2">
          {AVAILABLE_INTERESTS.map(interest => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={`interest-${interest}`}
                checked={selectedInterests.includes(interest)}
                onCheckedChange={() => toggleInterest(interest)}
                data-testid={`checkbox-interest-${interest.toLowerCase()}`}
              />
              <label
                htmlFor={`interest-${interest}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {interest}
              </label>
            </div>
          ))}
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
        className="w-full bg-[#10A37F] hover:bg-[#0D8A6B] text-white"
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
              <span className="text-foreground font-medium">Explore & Discover</span>
            </div>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black mb-2">
                Explore & Discover
              </h1>
              <p className="text-muted-foreground">
                <span className="text-[#10A37F] font-bold">+{filteredLessons.length} quick lessons</span> • Find bite-sized learning for your interests
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
                  placeholder="Search lessons..."
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
            </div>
          </div>

          {/* Interest Filter Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {AVAILABLE_INTERESTS.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedInterests.includes(interest)
                    ? "bg-[#10A37F] hover:bg-[#0D8A6B] text-white"
                    : "hover:border-[#10A37F]"
                }`}
                onClick={() => toggleInterest(interest)}
                data-testid={`chip-interest-${interest.toLowerCase()}`}
              >
                {interest}
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
            <div className="sticky top-24 bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-[#10A37F]" />
                Filter
              </h2>
              <FilterContent />
            </div>
          </aside>

          {/* Content Feed */}
          <div className="flex-1">
            {/* Community Poll */}
            {pollLoading ? (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700 mb-6 animate-pulse">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-5 w-5 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-32" />
                </div>
                <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4" />
                <div className="space-y-3 mb-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ) : poll ? (
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700 mb-6" data-testid="community-poll">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-[#10A37F]" />
                  <h3 className="text-xl font-bold">Community Poll</h3>
                  <span className="text-sm text-muted-foreground ml-auto">{poll.total_votes} votes</span>
                </div>

                <p className="font-semibold mb-4">{poll.question}</p>

                <div className="space-y-3 mb-4">
                  {poll.options.map(option => {
                    const percentage = poll.total_votes > 0
                      ? Math.round((option.votes_count / poll.total_votes) * 100)
                      : 0;
                    return (
                      <div key={option.id}>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="poll"
                            value={option.id}
                            checked={selectedPoll === option.id}
                            onChange={() => setSelectedPoll(option.id)}
                            className="w-4 h-4 text-[#10A37F] accent-[#10A37F]"
                            disabled={isVoting}
                          />
                          <span className="text-sm flex-1">{option.text}</span>
                        </label>
                        <div className="ml-7 mt-1">
                          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#10A37F] transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground mt-1">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button
                  className="w-full bg-[#10A37F] hover:bg-[#0D8A6B] text-white"
                  data-testid="button-vote"
                  onClick={handleVote}
                  disabled={!selectedPoll || isVoting || !user}
                >
                  {isVoting ? 'Voting...' : user ? 'Vote' : 'Sign in to vote'}
                </Button>
              </div>
            ) : null}

            {/* Live Events */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-[#10A37F]" />
                <h2 className="text-2xl font-bold">Upcoming Live Events</h2>
                {liveEvents.length > 1 && !eventsLoading && (
                  <div className="ml-auto flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => scrollEvents('left')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => scrollEvents('right')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {eventsLoading ? (
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex-shrink-0 w-80 bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-md border animate-pulse">
                      <div className="h-32 bg-neutral-200 dark:bg-neutral-700" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : liveEvents.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No upcoming live events scheduled.</p>
                </div>
              ) : (
                <div
                  ref={eventsCarouselRef}
                  className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {liveEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex-shrink-0 w-80 bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-700 hover:border-[#10A37F] transition-colors snap-start"
                      data-testid={`live-event-${event.id}`}
                    >
                      <div
                        className="h-32 bg-gradient-to-br from-[#10A37F] to-[#0D8A6B] relative flex items-center justify-center"
                      >
                        <Calendar className="h-12 w-12 text-white/50" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
                        )}
                        <p className="text-sm font-semibold text-[#10A37F] mb-3">{formatEventTime(event.scheduled_start)}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {event.max_participants ? `Max ${event.max_participants} attendees` : 'Unlimited spots'}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#10A37F] text-[#10A37F] hover:bg-[#10A37F] hover:text-white"
                            onClick={() => navigate(`/live/${event.id}`)}
                          >
                            Register
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Micro Learning Feed */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="h-5 w-5 text-[#10A37F]" />
                <h2 className="text-2xl font-bold">Micro Learning Feed</h2>
                <Badge variant="outline" className="ml-auto">{filteredLessons.length} lessons</Badge>
              </div>

              {lessonsLoading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border animate-pulse">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-3" />
                      <div className="space-y-2">
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
                        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredLessons.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                  <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No lessons match your filters. Try adjusting your selection.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredLessons.map((lesson) => {
                    const isBookmarked = bookmarkedLessons.has(lesson.id);
                    const instructorName = lesson.instructor?.full_name || 'Instructor';

                    return (
                      <div
                        key={lesson.id}
                        className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border border-neutral-200 dark:border-neutral-700 relative"
                        data-testid={`micro-lesson-${lesson.id}`}
                      >
                        {/* Bookmark Button */}
                        <Button
                          size="sm"
                          variant={isBookmarked ? "default" : "outline"}
                          className={`absolute top-4 right-4 z-10 ${
                            isBookmarked
                              ? "bg-[#10A37F] hover:bg-[#0D8A6B]"
                              : "hover:border-[#10A37F]"
                          }`}
                          onClick={() => toggleBookmark(lesson.id)}
                          data-testid={`button-bookmark-${lesson.id}`}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </Button>

                        <div className="flex items-start gap-4 mb-4">
                          {lesson.instructor?.avatar_url ? (
                            <img
                              src={lesson.instructor.avatar_url}
                              alt={instructorName}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#10A37F] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {getInitials(instructorName)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{instructorName}</span>
                              <span className="text-sm text-muted-foreground">• {formatTimeAgo(lesson.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs capitalize">
                                {lesson.level}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{formatDuration(lesson.duration_seconds)}</span>
                              <span className="text-xs font-semibold text-[#10A37F]">{lesson.category}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line mb-4 line-clamp-4">
                          {lesson.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{lesson.likes_count}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{lesson.comments_count}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#10A37F] hover:bg-[#0D8A6B] text-white"
                            data-testid={`button-start-lesson-${lesson.id}`}
                            onClick={() => lesson.video_url && window.open(lesson.video_url, '_blank')}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Watch
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Resources Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-[#10A37F]" />
                <h2 className="text-2xl font-bold">Featured Resources</h2>
              </div>

              {resourcesLoading ? (
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700 animate-pulse">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3 mb-3" />
                  <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-20 mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6" />
                  </div>
                  <div className="h-9 bg-neutral-200 dark:bg-neutral-700 rounded w-36" />
                </div>
              ) : resources.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No resources available yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700"
                      data-testid={`resource-${resource.id}`}
                    >
                      <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                      <Badge className="bg-[#10A37F] text-white mb-3">{resource.category || 'Resource'}</Badge>
                      {resource.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {resource.description}
                        </p>
                      )}
                      <Button
                        variant="outline"
                        className="border-[#10A37F] text-[#10A37F] hover:bg-[#10A37F] hover:text-white"
                        onClick={() => resource.fileUrl && window.open(resource.fileUrl, '_blank')}
                        disabled={!resource.fileUrl}
                      >
                        {resource.fileUrl ? 'Download' : 'Coming Soon'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative py-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/attached_assets/stock_images/diverse_students_lea_428a0d18.jpg)` }}
        >
          <div className="absolute inset-0 bg-white/85 dark:bg-white/80"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-black dark:text-black">
              <h2 className="text-3xl lg:text-4xl font-black mb-4">
                Ready to dive deeper?
              </h2>
              <p className="text-lg text-black/80 dark:text-black/80 max-w-2xl">
                Explore our full courses and structured learning paths to take your skills to the next level.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/courses")}
                className="bg-[#10A37F] text-white hover:bg-[#0D8A6B] font-bold text-lg px-8"
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

export default Explore;
