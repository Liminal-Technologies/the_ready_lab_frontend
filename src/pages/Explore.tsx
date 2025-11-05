import { useState } from "react";
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

const AVAILABLE_INTERESTS = [
  'Funding', 'Business', 'Branding', 'AI', 'Marketing', 
  'Operations', 'Leadership', 'Technology', 'Design'
];

const microLessons = [
  {
    id: "m1",
    title: "EIN Setup Essentials",
    instructor: "Maria Rodriguez",
    duration: "3 min",
    level: "Beginner",
    category: "Operations",
    interests: ["Business", "Operations"],
    description: "💼 Getting your EIN is step #1 to fundability!\n\n✅ Apply directly with the IRS (free!)\n✅ Takes 5-10 minutes online\n✅ Unlocks business banking & credibility\n\nSkip the paid services - do it yourself and save $200+",
    likes: 156,
    comments: 23,
    timeAgo: "5m ago",
    initials: "MR"
  },
  {
    id: "m2",
    title: "Grant vs. Investment: Know the Difference",
    instructor: "David Kim",
    duration: "4 min",
    level: "Beginner",
    category: "Funding",
    interests: ["Funding", "Business"],
    description: "🎯 Grants = Free money (no equity lost)\nInvestments = Money for ownership\n\nGrant tip: Focus on impact, not profit in your pitch.\nInvestor tip: Show scalability and ROI potential.\n\nKnow which door you're knocking on!",
    likes: 203,
    comments: 41,
    timeAgo: "12m ago",
    initials: "DK"
  },
  {
    id: "m3",
    title: "Brand Message Formula",
    instructor: "Jessica Chen",
    duration: "5 min",
    level: "Intermediate",
    category: "Branding",
    interests: ["Branding", "Marketing"],
    description: "🚀 The Ready Lab Brand Formula:\n\nWE HELP [target audience]\nTO [desired outcome]\nSO THEY CAN [bigger vision]\n\nExample: 'We help early-stage founders build fundable businesses so they can scale with confidence.'\n\nClear. Fundable. Memorable.",
    likes: 178,
    comments: 32,
    timeAgo: "45m ago",
    initials: "JC"
  },
  {
    id: "m4",
    title: "AI Prompt for Business Plans",
    instructor: "Carlos Martinez",
    duration: "6 min",
    level: "Intermediate",
    category: "AI",
    interests: ["AI", "Technology"],
    description: "🤖 Transform ChatGPT into your business strategist:\n\n'Act as a business consultant. Help me create a [section] for my [industry] business that [goal]. Include specific metrics and actionable steps.'\n\nSpecific prompts = better outputs. Try it!",
    likes: 267,
    comments: 58,
    timeAgo: "2h ago",
    initials: "CM"
  },
  {
    id: "m5",
    title: "Networking That Actually Works",
    instructor: "Sarah Johnson",
    duration: "4 min",
    level: "Beginner",
    category: "Leadership",
    interests: ["Leadership", "Business"],
    description: "🤝 Stop collecting business cards. Start building relationships.\n\n✅ Follow up within 24 hours\n✅ Offer value before asking\n✅ Be genuinely curious\n\nYour network is your net worth!",
    likes: 189,
    comments: 27,
    timeAgo: "3h ago",
    initials: "SJ"
  },
  {
    id: "m6",
    title: "Social Media Strategy in 10 Minutes",
    instructor: "Alex Rivera",
    duration: "8 min",
    level: "Intermediate",
    category: "Marketing",
    interests: ["Marketing", "Branding"],
    description: "📱 Quick social media framework:\n\n1. Choose 2 platforms max\n2. Post 3x/week minimum\n3. Engage > Promote (80/20 rule)\n4. Use analytics to improve\n\nConsistency beats perfection!",
    likes: 234,
    comments: 45,
    timeAgo: "5h ago",
    initials: "AR"
  }
];

const pollData = {
  question: "What's your biggest challenge in your learning journey?",
  options: [
    { id: '1', text: 'Finding time to study', votes: 45 },
    { id: '2', text: 'Staying motivated', votes: 32 },
    { id: '3', text: 'Understanding complex topics', votes: 28 },
    { id: '4', text: 'Applying what I learn', votes: 15 },
  ],
  totalVotes: 120
};

const liveEvents = [
  {
    id: "live1",
    title: "Live Q&A: Building Your First Business",
    instructor: "Sarah Johnson",
    scheduledAt: "Today at 3:00 PM",
    attendees: 234,
    maxAttendees: 500,
    thumbnail: "/attached_assets/stock_images/business_professiona_9e1fef7d.jpg"
  },
  {
    id: "live2",
    title: "Funding Strategies Workshop",
    instructor: "Dr. Michael Chen",
    scheduledAt: "Tomorrow at 2:00 PM",
    attendees: 156,
    maxAttendees: 300,
    thumbnail: "/attached_assets/stock_images/diverse_business_tea_d87c6b57.jpg"
  }
];

const Explore = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookmarkedLessons, setBookmarkedLessons] = useState<Set<string>>(new Set());
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);

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
      selectedInterests.some(interest => lesson.interests.includes(interest));
    
    const searchMatch = !searchQuery || 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return interestMatch && searchMatch;
  });

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
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700 mb-6" data-testid="community-poll">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#10A37F]" />
                <h3 className="text-xl font-bold">Community Poll</h3>
                <span className="text-sm text-muted-foreground ml-auto">{pollData.totalVotes} votes</span>
              </div>
              
              <p className="font-semibold mb-4">{pollData.question}</p>
              
              <div className="space-y-3 mb-4">
                {pollData.options.map(option => {
                  const percentage = Math.round((option.votes / pollData.totalVotes) * 100);
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
              >
                Vote
              </Button>
            </div>

            {/* Live Events */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-[#10A37F]" />
                <h2 className="text-2xl font-bold">Upcoming Live Events</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {liveEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-md border border-neutral-200 dark:border-neutral-700 hover:border-[#10A37F] transition-colors"
                    data-testid={`live-event-${event.id}`}
                  >
                    <div className="h-32 bg-gradient-to-br from-[#10A37F] to-[#0D8A6B] flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-white opacity-50" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">with {event.instructor}</p>
                      <p className="text-sm font-semibold text-[#10A37F] mb-3">{event.scheduledAt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{event.attendees}/{event.maxAttendees} attending</span>
                        <Button size="sm" variant="outline" className="border-[#10A37F] text-[#10A37F] hover:bg-[#10A37F] hover:text-white">
                          Register
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Learning Feed */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle className="h-5 w-5 text-[#10A37F]" />
                <h2 className="text-2xl font-bold">Micro Learning Feed</h2>
                <Badge variant="outline" className="ml-auto">{filteredLessons.length} lessons</Badge>
              </div>
              
              {filteredLessons.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                  <p className="text-muted-foreground">
                    No lessons match your filters. Try adjusting your selection.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredLessons.map((lesson) => {
                    const isBookmarked = bookmarkedLessons.has(lesson.id);
                    
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
                          <div className="w-12 h-12 rounded-full bg-[#10A37F] text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {lesson.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{lesson.instructor}</span>
                              <span className="text-sm text-muted-foreground">• {lesson.timeAgo}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {lesson.level}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                              <span className="text-xs font-semibold text-[#10A37F]">{lesson.category}</span>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-3">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                          {lesson.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{lesson.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{lesson.comments}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#10A37F] hover:bg-[#0D8A6B] text-white"
                            data-testid={`button-start-lesson-${lesson.id}`}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            Start Lesson
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
              
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-md border border-neutral-200 dark:border-neutral-700">
                <h3 className="font-bold text-lg mb-2">Complete Business Plan Template</h3>
                <Badge className="bg-[#10A37F] text-white mb-3">Template</Badge>
                <p className="text-sm text-muted-foreground mb-4">
                  A comprehensive template to help you create a professional business plan with all the sections funders want to see.
                </p>
                <Button variant="outline" className="border-[#10A37F] text-[#10A37F] hover:bg-[#10A37F] hover:text-white">
                  Download Template
                </Button>
              </div>
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
