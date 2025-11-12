import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Clock,
  Users,
  Star,
  ChevronLeft,
  Award,
  ArrowRight,
  Heart,
  MessageCircle,
  PlayCircle,
  Eye,
  Ear,
  BookOpen,
  Hand,
  Search,
  X,
} from "lucide-react";
import fundingImage from "../../attached_assets/stock_images/business_professiona_9e1fef7d.jpg";
import operationsImage from "../../attached_assets/stock_images/business_operations__a3e6e538.jpg";
import brandingImage from "../../attached_assets/stock_images/branding_marketing_s_50e607b2.jpg";
import aiImage from "../../attached_assets/stock_images/artificial_intellige_80651e44.jpg";
import partnershipImage from "../../attached_assets/stock_images/partnership_handshak_d5c0b270.jpg";
import financialImage from "../../attached_assets/stock_images/financial_planning_a_96357d65.jpg";
import ctaBackgroundImage from "../../attached_assets/stock_images/diverse_business_tea_d87c6b57.jpg";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const allCourses = [
  {
    id: "1",
    title: "Funding Readiness 101",
    description: "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
    duration: "8 weeks",
    students: "3,200",
    rating: "4.9",
    level: "Beginner",
    price: 299,
    category: "Funding Strategy",
    certification: true,
    featured: true,
    image: fundingImage,
    instructorName: "Dr. Michael Chen",
    format: "Video",
    learningStyle: "visual"
  },
  {
    id: "2",
    title: "Business Infrastructure Mastery",
    description: "Set up compliance, budgets, and operational systems that funders demand to see.",
    duration: "6 weeks",
    students: "2,800",
    rating: "4.8",
    level: "Beginner",
    price: 249,
    category: "Operations",
    certification: true,
    featured: false,
    image: operationsImage,
    instructorName: "Sarah Rodriguez",
    format: "Video",
    learningStyle: "reading"
  },
  {
    id: "3",
    title: "Branding for Growth & Fundability",
    description: "Develop clear messaging and positioning that attracts investors and customers alike.",
    duration: "4 weeks",
    students: "2,100",
    rating: "4.9",
    level: "Intermediate",
    price: 199,
    category: "Brand Strategy",
    certification: true,
    featured: false,
    image: brandingImage,
    instructorName: "Alex Thompson",
    format: "Interactive",
    learningStyle: "visual"
  },
  {
    id: "4",
    title: "AI for Entrepreneurs",
    description: "Streamline operations and scale efficiently using artificial intelligence tools and strategies.",
    duration: "5 weeks",
    students: "1,900",
    rating: "4.7",
    level: "Intermediate",
    price: 229,
    category: "Technology",
    certification: true,
    featured: false,
    image: aiImage,
    instructorName: "Jamie Lee",
    format: "Video",
    learningStyle: "kinesthetic"
  },
  {
    id: "5",
    title: "Donor Engagement & Strategic Partnerships",
    description: "Build lasting relationships with donors, sponsors, and strategic partners for sustainable growth.",
    duration: "6 weeks",
    students: "1,600",
    rating: "4.8",
    level: "Advanced",
    price: 279,
    category: "Partnership Strategy",
    certification: true,
    featured: true,
    image: partnershipImage,
    instructorName: "Morgan Taylor",
    format: "Interactive",
    learningStyle: "auditory"
  },
  {
    id: "6",
    title: "Financial Fluency for Founders",
    description: "Master budgeting, financial planning, and reporting that builds credibility with funders.",
    duration: "4 weeks",
    students: "1,400",
    rating: "4.7",
    level: "Intermediate",
    price: 0,
    category: "Financial Planning",
    certification: true,
    featured: false,
    image: financialImage,
    instructorName: "Chris Anderson",
    format: "Video",
    learningStyle: "visual"
  },
  {
    id: "7",
    title: "Grant Writing Mastery",
    description: "Learn to write compelling grant proposals that get funded.",
    duration: "6 weeks",
    students: "2,200",
    rating: "4.9",
    level: "Beginner",
    price: 249,
    category: "Funding Strategy",
    certification: true,
    featured: false,
    image: fundingImage,
    instructorName: "Dr. Emily Foster",
    format: "Video",
    learningStyle: "reading"
  },
  {
    id: "8",
    title: "Social Impact Measurement",
    description: "Track and communicate your organization's impact effectively.",
    duration: "3 weeks",
    students: "980",
    rating: "4.6",
    level: "Intermediate",
    price: 0,
    category: "Impact",
    certification: true,
    featured: false,
    image: partnershipImage,
    instructorName: "Jordan Lee",
    format: "Interactive",
    learningStyle: "kinesthetic"
  }
];

const categories = ["Funding Strategy", "Operations", "Brand Strategy", "Technology", "Partnership Strategy", "Financial Planning", "Impact"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const formats = ["Video", "Interactive", "Live"];

const communities = [
  {
    id: "c1",
    name: "Startups Under 2 Years",
    members: "2,400",
    description: "Connect with fellow early-stage entrepreneurs navigating the startup journey."
  },
  {
    id: "c2",
    name: "501(c)(3) Founders",
    members: "1,800",
    description: "A community for nonprofit leaders building sustainable impact organizations."
  },
  {
    id: "c3",
    name: "Creative Entrepreneurs",
    members: "1,500",
    description: "Artists, designers, and creative professionals scaling their businesses."
  },
  {
    id: "c4",
    name: "Tech-Enabled Businesses",
    members: "2,100",
    description: "Founders leveraging technology to solve problems and scale impact."
  }
];

const learningStyles = [
  {
    icon: "🎨",
    title: "Visual",
    description: "Watch expert-led video tutorials"
  },
  {
    icon: "🎧",
    title: "Auditory",
    description: "Listen to audio lessons + guest Q&As"
  },
  {
    icon: "📝",
    title: "Reading/Writing",
    description: "Follow detailed guides + worksheets"
  },
  {
    icon: "🤲",
    title: "Kinesthetic",
    description: "Complete real-world toolkits + simulations"
  }
];

const CourseBrowse = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedLearningStyles, setSelectedLearningStyles] = useState<string[]>([]);
  const [paidFilter, setPaidFilter] = useState<"all" | "free" | "paid">("all");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const coursesPerPage = 6;

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(course.level);
    const formatMatch = selectedFormats.length === 0 || selectedFormats.includes(course.format);
    const learningStyleMatch = selectedLearningStyles.length === 0 || selectedLearningStyles.includes(course.learningStyle);
    const paidFilterMatch = paidFilter === "all" || 
      (paidFilter === "free" && course.price === 0) ||
      (paidFilter === "paid" && course.price > 0);
    const priceMatch = course.price >= priceRange[0] && course.price <= priceRange[1];
    const chipMatch = !activeChip || course.category === activeChip;
    
    // Search match - search in title, instructor, category, and description if available
    const searchMatch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && levelMatch && formatMatch && learningStyleMatch && paidFilterMatch && priceMatch && chipMatch && searchMatch;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "popular":
        return parseInt(b.students.replace(",", "")) - parseInt(a.students.replace(",", ""));
      default:
        return b.featured ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

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

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev =>
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const toggleLearningStyle = (style: string) => {
    setSelectedLearningStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const handleChipClick = (category: string) => {
    setActiveChip(activeChip === category ? null : category);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedFormats([]);
    setSelectedLearningStyles([]);
    setPaidFilter("all");
    setPriceRange([0, 300]);
    setActiveChip(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
              />
              <label
                htmlFor={`cat-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Free/Paid</h3>
        <div className="flex gap-2">
          <Button
            variant={paidFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setPaidFilter("all")}
            className={paidFilter === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
            data-testid="button-filter-all"
          >
            All
          </Button>
          <Button
            variant={paidFilter === "free" ? "default" : "outline"}
            size="sm"
            onClick={() => setPaidFilter("free")}
            className={paidFilter === "free" ? "bg-orange-500 hover:bg-orange-600" : ""}
            data-testid="button-filter-free"
          >
            Free
          </Button>
          <Button
            variant={paidFilter === "paid" ? "default" : "outline"}
            size="sm"
            onClick={() => setPaidFilter("paid")}
            className={paidFilter === "paid" ? "bg-orange-500 hover:bg-orange-600" : ""}
            data-testid="button-filter-paid"
          >
            Paid
          </Button>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={300}
            step={10}
            className="mb-2"
            data-testid="slider-price-range"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Level</h3>
        <div className="space-y-3">
          {levels.map(level => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level}`}
                checked={selectedLevels.includes(level)}
                onCheckedChange={() => toggleLevel(level)}
                data-testid={`checkbox-level-${level.toLowerCase()}`}
              />
              <label
                htmlFor={`level-${level}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {level}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Format</h3>
        <div className="space-y-3">
          {formats.map(format => (
            <div key={format} className="flex items-center space-x-2">
              <Checkbox
                id={`format-${format}`}
                checked={selectedFormats.includes(format)}
                onCheckedChange={() => toggleFormat(format)}
                data-testid={`checkbox-format-${format.toLowerCase()}`}
              />
              <label
                htmlFor={`format-${format}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {format}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-4">Learning Style</h3>
        <div className="space-y-3">
          {[
            { value: "visual", label: "Visual", icon: "🎨" },
            { value: "auditory", label: "Auditory", icon: "🎧" },
            { value: "reading", label: "Reading/Writing", icon: "📝" },
            { value: "kinesthetic", label: "Kinesthetic", icon: "🤲" }
          ].map(style => (
            <div key={style.value} className="flex items-center space-x-2">
              <Checkbox
                id={`learning-${style.value}`}
                checked={selectedLearningStyles.includes(style.value)}
                onCheckedChange={() => toggleLearningStyle(style.value)}
                data-testid={`checkbox-learning-${style.value}`}
              />
              <label
                htmlFor={`learning-${style.value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
              >
                <span>{style.icon}</span>
                <span>{style.label}</span>
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
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
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
              <span className="text-foreground font-medium">Courses & More</span>
            </div>

          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black mb-2">
                Browse Courses & More
              </h1>
              <p className="text-muted-foreground">
                <span className="text-orange-500 font-bold">+{filteredCourses.length} products</span>
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
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-10 h-10 text-sm border-2 border-neutral-200 dark:border-neutral-700 focus:border-orange-500 rounded-lg"
                  data-testid="input-search-courses"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {searchQuery && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-bold text-orange-500">{filteredCourses.length}</span> {filteredCourses.length === 1 ? 'course' : 'courses'} matching "{searchQuery}"
              </p>
            </div>
          )}

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <Badge
                key={category}
                variant={activeChip === category ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  activeChip === category
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "hover:border-orange-500"
                }`}
                onClick={() => handleChipClick(category)}
                data-testid={`chip-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Main Content: Sidebar + Grid */}
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Filter</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {paginatedCourses.map(course => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col border border-neutral-200 dark:border-neutral-700"
                    data-testid={`course-card-${course.id}`}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.featured && (
                        <Badge className="absolute top-3 left-3 bg-yellow-400 text-black hover:bg-yellow-500">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Duration & Level */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {course.duration}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            course.level === "Beginner" 
                              ? "border-green-500 text-green-600" 
                              : course.level === "Intermediate"
                              ? "border-orange-500 text-orange-600"
                              : "border-red-500 text-red-600"
                          }`}
                        >
                          {course.level}
                        </Badge>
                      </div>

                      {/* Category */}
                      <p className="text-xs font-semibold text-orange-500 mb-2 uppercase tracking-wide">
                        {course.category}
                      </p>

                      {/* Title */}
                      <h3 className="text-lg font-bold mb-2 leading-tight line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                        {course.description}
                      </p>

                      {/* Instructor */}
                      <p className="text-xs text-muted-foreground mb-4">
                        by <span className="font-semibold text-foreground">{course.instructorName}</span>
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground pb-4 border-b border-neutral-200 dark:border-neutral-700 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-foreground">{course.rating}</span>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">${course.price}</span>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course.id}`);
                          }}
                          data-testid={`button-view-course-${course.id}`}
                        >
                          View
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    data-testid="button-next-page"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Join a Community Section */}
      <div className="bg-white dark:bg-neutral-800 py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              🏘️ <span className="text-black dark:text-white">Join a Community </span>
              <span className="text-orange-500">That Gets You</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with like-minded entrepreneurs and founders in your space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {communities.map((community) => (
              <div
                key={community.id}
                className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 transition-colors"
                data-testid={`community-card-${community.id}`}
              >
                <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Users className="h-4 w-4" />
                  <span>{community.members} members</span>
                </div>
                <p className="text-muted-foreground mb-6">{community.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/community/join")}
                  data-testid={`button-join-community-${community.id}`}
                >
                  Join Community
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How You'll Learn Section */}
      <div className="bg-neutral-50 dark:bg-neutral-900 py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="text-black dark:text-white">How You'll Learn at </span>
              <span className="text-orange-500">The Ready Lab</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform supports different learning styles so you can grow with clarity — your way.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {learningStyles.map((style, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 transition-colors"
                data-testid={`learning-style-${style.title.toLowerCase()}`}
              >
                <div className="text-5xl mb-4">{style.icon}</div>
                <h3 className="text-xl font-bold mb-2">{style.title}</h3>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-2xl p-8">
            <p className="text-lg italic text-foreground max-w-3xl mx-auto">
              "The Ready Lab was built for real people — no matter how you learn, we make sure you grow."
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative py-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ctaBackgroundImage})` }}
        >
          <div className="absolute inset-0 bg-white/80 dark:bg-black/70"></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h2 className="text-3xl lg:text-4xl font-black mb-4 text-black dark:text-white">
                Move closer to your goals with The Ready Lab.
              </h2>
              <p className="text-lg max-w-2xl text-neutral-700 dark:text-neutral-300">
                Achieve your goals with The Ready Lab, your pathway to personal and professional success. Join us on a transformative journey today!
              </p>
              <Button
                size="lg"
                className="mt-6 bg-[#E5A000] text-white hover:bg-[#cc8f00] font-bold"
                onClick={() => navigate("/signup")}
                data-testid="button-join-free"
              >
                Join For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      </div>
    </>
  );
};

export default CourseBrowse;
