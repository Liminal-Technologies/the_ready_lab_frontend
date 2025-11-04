import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Award,
  TrendingUp,
  Clock,
  Users,
  Star,
  ArrowRight,
  DollarSign,
  Filter,
  Tag,
  BookOpen,
  X,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import fundingImage from "../../attached_assets/stock_images/business_professiona_9e1fef7d.jpg";
import operationsImage from "../../attached_assets/stock_images/business_operations__a3e6e538.jpg";
import brandingImage from "../../attached_assets/stock_images/branding_marketing_s_50e607b2.jpg";
import aiImage from "../../attached_assets/stock_images/artificial_intellige_80651e44.jpg";
import partnershipImage from "../../attached_assets/stock_images/partnership_handshak_d5c0b270.jpg";
import financialImage from "../../attached_assets/stock_images/financial_planning_a_96357d65.jpg";

const courses = [
  {
    id: "1",
    title: "Funding Readiness 101",
    description: "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
    duration: "8 weeks",
    students: "3,200",
    rating: "4.9",
    level: "Beginner",
    price: "$299",
    category: "FUNDING STRATEGY",
    certification: true,
    featured: true,
    image: fundingImage,
    instructorName: "Dr. Michael Chen",
    interests: ["Funding", "Business", "Leadership"]
  },
  {
    id: "2",
    title: "Business Infrastructure Mastery",
    description: "Set up compliance, budgets, and operational systems that funders demand to see.",
    duration: "6 weeks",
    students: "2,800",
    rating: "4.8",
    level: "Beginner",
    price: "$249",
    category: "OPERATIONS",
    certification: true,
    featured: false,
    image: operationsImage,
    instructorName: "Sarah Rodriguez",
    interests: ["Operations", "Business", "Leadership"]
  },
  {
    id: "3",
    title: "Branding for Growth & Fundability",
    description: "Develop clear messaging and positioning that attracts investors and customers alike.",
    duration: "4 weeks",
    students: "2,100",
    rating: "4.9",
    level: "Intermediate",
    price: "$199",
    category: "BRAND STRATEGY",
    certification: true,
    featured: false,
    image: brandingImage,
    instructorName: "Alex Thompson",
    interests: ["Branding", "Marketing", "Business"]
  },
  {
    id: "4",
    title: "AI for Entrepreneurs",
    description: "Streamline operations and scale efficiently using artificial intelligence tools and strategies.",
    duration: "5 weeks",
    students: "1,900",
    rating: "4.7",
    level: "Intermediate",
    price: "$229",
    category: "TECHNOLOGY",
    certification: true,
    featured: false,
    image: aiImage,
    interests: ["AI", "Technology", "Business"]
  },
  {
    id: "5",
    title: "Donor Engagement & Strategic Partnerships",
    description: "Build lasting relationships with donors, sponsors, and strategic partners for sustainable growth.",
    duration: "6 weeks",
    students: "1,600",
    rating: "4.8",
    level: "Advanced",
    price: "$279",
    category: "PARTNERSHIP STRATEGY",
    certification: true,
    featured: true,
    image: partnershipImage,
    interests: ["Funding", "Business", "Leadership", "Marketing"]
  },
  {
    id: "6",
    title: "Financial Fluency for Founders",
    description: "Master budgeting, financial planning, and reporting that builds credibility with funders.",
    duration: "4 weeks",
    students: "1,400",
    rating: "4.7",
    level: "Intermediate",
    price: "$179",
    category: "FINANCIAL PLANNING",
    certification: true,
    featured: false,
    image: financialImage,
    interests: ["Business", "Funding", "Operations"]
  }
];

const CATEGORIES = [
  { name: "FUNDING STRATEGY", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" },
  { name: "OPERATIONS", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  { name: "BRAND STRATEGY", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" },
  { name: "TECHNOLOGY", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  { name: "PARTNERSHIP STRATEGY", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400" },
  { name: "FINANCIAL PLANNING", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const INTERESTS = ["Funding", "Business", "Branding", "AI", "Marketing", "Operations", "Leadership", "Technology"];

const CourseBrowse = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Intermediate': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'Advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleLevel = (level: string) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedInterests([]);
  };

  const filteredCourses = courses.filter(course => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
      return false;
    }
    if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
      return false;
    }
    if (selectedInterests.length > 0 && !selectedInterests.some(interest => course.interests?.includes(interest))) {
      return false;
    }
    return true;
  });

  const hasActiveFilters = selectedCategories.length > 0 || selectedLevels.length > 0 || selectedInterests.length > 0;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-600 dark:to-orange-700 py-12">
          <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black dark:text-white mb-4">
              Explore Courses & Learning
            </h1>
            <p className="text-lg md:text-xl text-black/80 dark:text-white/90 max-w-3xl">
              Discover certification tracks, live events, and personalized learning content
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-8">
          <div className="flex gap-8">
            {/* Left Sidebar - Filters */}
            <aside className={`${showFilters ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden flex-shrink-0`}>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sticky top-24 shadow-sm border border-neutral-200 dark:border-neutral-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <h2 className="font-bold text-lg">Filters</h2>
                  </div>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs"
                      data-testid="button-clear-filters"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <ScrollArea className="h-[calc(100vh-250px)]">
                  {/* Categories */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <div key={category.name} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${category.name}`}
                            checked={selectedCategories.includes(category.name)}
                            onCheckedChange={() => toggleCategory(category.name)}
                            data-testid={`checkbox-category-${category.name}`}
                          />
                          <Label
                            htmlFor={`cat-${category.name}`}
                            className="text-sm cursor-pointer hover:text-primary"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Levels */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      Level
                    </h3>
                    <div className="space-y-2">
                      {LEVELS.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={`level-${level}`}
                            checked={selectedLevels.includes(level)}
                            onCheckedChange={() => toggleLevel(level)}
                            data-testid={`checkbox-level-${level}`}
                          />
                          <Label
                            htmlFor={`level-${level}`}
                            className="text-sm cursor-pointer hover:text-primary"
                          >
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Interests */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {INTERESTS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={selectedInterests.includes(interest) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleInterest(interest)}
                          data-testid={`badge-interest-${interest}`}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {/* Toggle Filters Button (Mobile) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="mb-4 md:hidden"
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mb-4 flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium">Active filters:</span>
                  {selectedCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="gap-1">
                      {cat}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
                    </Badge>
                  ))}
                  {selectedLevels.map(level => (
                    <Badge key={level} variant="secondary" className="gap-1">
                      {level}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleLevel(level)} />
                    </Badge>
                  ))}
                  {selectedInterests.map(interest => (
                    <Badge key={interest} variant="secondary" className="gap-1">
                      {interest}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => toggleInterest(interest)} />
                    </Badge>
                  ))}
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6 bg-white dark:bg-neutral-800 p-1 rounded-lg">
                  <TabsTrigger value="all" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black" data-testid="tab-all-courses">
                    All Courses
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black" data-testid="tab-trending">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </TabsTrigger>
                  <TabsTrigger value="feed" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black" data-testid="tab-my-feed">
                    My Feed
                  </TabsTrigger>
                </TabsList>

                {/* All Courses Tab */}
                <TabsContent value="all" className="space-y-8">
                  {/* Header Badge */}
                  <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    {t('courses.certificationTracks')}
                  </div>

                  <div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                      <span className="text-black dark:text-white">Get Fundable & </span>
                      <span className="text-[#D97706] dark:text-orange-500">Certified</span>
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl">
                      {t('courses.subtitle')}
                    </p>
                  </div>

                  {/* Course Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col border border-neutral-200 dark:border-neutral-700"
                        onClick={() => navigate(`/courses/${course.id}`)}
                        data-testid={`course-card-${course.id}`}
                      >
                        {/* Image Section */}
                        <div className="relative h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 dark:bg-yellow-500 text-black px-3 py-1.5 rounded-full font-bold text-base shadow-lg">
                            <DollarSign className="h-4 w-4" />
                            {course.price.replace('$', '')}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex flex-col flex-grow">
                          {/* Tags */}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <Badge className={`${getLevelColor(course.level)} border-0 text-xs font-semibold px-2.5 py-0.5`}>
                              {course.level}
                            </Badge>
                            {course.certification && (
                              <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0 text-xs font-semibold px-2.5 py-0.5">
                                <Award className="h-3 w-3 mr-1" />
                                Certified
                              </Badge>
                            )}
                            {course.featured && (
                              <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-0 text-xs font-semibold px-2.5 py-0.5">
                                Featured
                              </Badge>
                            )}
                          </div>

                          {/* Category */}
                          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                            {course.category}
                          </p>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-black dark:text-white mb-2 leading-tight">
                            {course.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 flex-grow leading-relaxed">
                            {course.description}
                          </p>

                          {/* Instructor */}
                          {course.instructorName && (
                            <div className="mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Instructor</p>
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                {course.instructorName}
                              </p>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span>{course.rating}</span>
                            </div>
                          </div>

                          {/* Button */}
                          <Button
                            className={`w-full rounded-full font-semibold ${
                              course.featured
                                ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90'
                                : 'bg-white dark:bg-neutral-700 text-black dark:text-white border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/courses/${course.id}`);
                            }}
                            data-testid={`button-view-course-${course.id}`}
                          >
                            View Course
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredCourses.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-2xl">
                      <p className="text-neutral-600 dark:text-neutral-400">
                        No courses match your filters. Try adjusting your selection.
                      </p>
                    </div>
                  )}

                  {/* Bottom CTA Bar */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-3xl p-8 shadow-xl text-center mt-8">
                    <Button
                      size="lg"
                      className="text-base md:text-lg px-6 md:px-8 py-5 md:py-6 rounded-full font-bold w-full md:w-auto"
                      style={{ backgroundColor: '#FDB022', color: '#000' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCA311'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FDB022'}
                      data-testid="button-start-certification"
                    >
                      <Award className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                      <span className="md:hidden">Start Certification</span>
                      <span className="hidden md:inline">{t('courses.startCertification')}</span>
                    </Button>
                    <p className="text-sm text-black/70 dark:text-white/80 mt-4 font-medium">
                      {t('courses.paymentPlans')}
                    </p>
                  </div>
                </TabsContent>

                {/* Trending Tab */}
                <TabsContent value="trending" className="space-y-6">
                  <div className="bg-white dark:bg-neutral-800 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-700">
                    <TrendingUp className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Trending Content Coming Soon</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      We're working on bringing you the most popular courses and learning content.
                    </p>
                  </div>
                </TabsContent>

                {/* My Feed Tab */}
                <TabsContent value="feed" className="space-y-6">
                  <div className="bg-white dark:bg-neutral-800 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-700">
                    <Tag className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Personalized Feed Coming Soon</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Your personalized learning feed will appear here based on your interests and progress.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseBrowse;
