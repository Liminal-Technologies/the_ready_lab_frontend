import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "lucide-react";
import fundingImage from "../../attached_assets/stock_images/business_professiona_9e1fef7d.jpg";
import operationsImage from "../../attached_assets/stock_images/business_operations__a3e6e538.jpg";
import brandingImage from "../../attached_assets/stock_images/branding_marketing_s_50e607b2.jpg";
import aiImage from "../../attached_assets/stock_images/artificial_intellige_80651e44.jpg";
import partnershipImage from "../../attached_assets/stock_images/partnership_handshak_d5c0b270.jpg";
import financialImage from "../../attached_assets/stock_images/financial_planning_a_96357d65.jpg";

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
    category: "FUNDING STRATEGY",
    certification: true,
    featured: true,
    image: fundingImage,
    instructorName: "Dr. Michael Chen",
    format: "Video"
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
    category: "OPERATIONS",
    certification: true,
    featured: false,
    image: operationsImage,
    instructorName: "Sarah Rodriguez",
    format: "Video"
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
    category: "BRAND STRATEGY",
    certification: true,
    featured: false,
    image: brandingImage,
    instructorName: "Alex Thompson",
    format: "Interactive"
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
    category: "TECHNOLOGY",
    certification: true,
    featured: false,
    image: aiImage,
    instructorName: "Jamie Lee",
    format: "Video"
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
    category: "PARTNERSHIP STRATEGY",
    certification: true,
    featured: true,
    image: partnershipImage,
    instructorName: "Morgan Taylor",
    format: "Interactive"
  },
  {
    id: "6",
    title: "Financial Fluency for Founders",
    description: "Master budgeting, financial planning, and reporting that builds credibility with funders.",
    duration: "4 weeks",
    students: "1,400",
    rating: "4.7",
    level: "Intermediate",
    price: 179,
    category: "FINANCIAL PLANNING",
    certification: true,
    featured: false,
    image: financialImage,
    instructorName: "Chris Anderson",
    format: "Video"
  }
];

const categories = ["FUNDING STRATEGY", "OPERATIONS", "BRAND STRATEGY", "TECHNOLOGY", "PARTNERSHIP STRATEGY", "FINANCIAL PLANNING"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const formats = ["Video", "Interactive", "Live"];

const CourseBrowse = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const coursesPerPage = 6;

  // Filter courses
  const filteredCourses = allCourses.filter(course => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(course.category);
    const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(course.level);
    const formatMatch = selectedFormats.length === 0 || selectedFormats.includes(course.format);
    const priceMatch = course.price >= priceRange[0] && course.price <= priceRange[1];
    const chipMatch = !activeChip || course.category === activeChip;
    
    return categoryMatch && levelMatch && formatMatch && priceMatch && chipMatch;
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

  const handleChipClick = (category: string) => {
    setActiveChip(activeChip === category ? null : category);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLevels([]);
    setSelectedFormats([]);
    setPriceRange([0, 300]);
    setActiveChip(null);
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
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Main Content Container with Rounded Top */}
      <div className="bg-white dark:bg-neutral-800 rounded-t-[2rem] lg:rounded-t-[3rem] shadow-lg">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl py-8">
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

            <div className="flex items-center gap-3">
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

          {/* Category Chips */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleChipClick(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeChip === category
                    ? "bg-orange-500 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                }`}
                data-testid={`chip-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
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

      {/* Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600 py-16 mt-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-white">
              <h2 className="text-3xl lg:text-4xl font-black mb-4">
                Move closer to your goals with The Ready Lab.
              </h2>
              <p className="text-lg opacity-90 max-w-2xl">
                Achieve your goals with The Ready Lab, your pathway to personal and professional success. Join us on a transformative journey today!
              </p>
              <Button
                size="lg"
                className="mt-6 bg-white text-orange-500 hover:bg-neutral-100 font-bold"
                onClick={() => navigate("/signup")}
                data-testid="button-join-free"
              >
                Join For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center">
                <Award className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBrowse;
