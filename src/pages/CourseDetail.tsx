import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FakeStripeCheckoutModal } from "@/components/checkout/FakeStripeCheckoutModal";
import {
  Clock,
  Users,
  Star,
  Award,
  PlayCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  ArrowRight,
  BookOpen,
  Target,
  ChevronRight,
  Lock,
  Globe,
  BarChart,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Video,
  UserPlus
} from "lucide-react";

// Import course images - use stock images
const fundingImage = "/attached_assets/stock_images/business_professiona_9e1fef7d.jpg";
const partnershipImage = "/attached_assets/stock_images/hands_on_learning_ac_8ca82f64.jpg";
const operationsImage = "/attached_assets/stock_images/business_operations__a3e6e538.jpg";
const instructorImage = "/attached_assets/stock_images/person_watching_educ_8ccc0366.jpg";

// Mock course data with expanded curriculum
const mockCourse = {
  id: "1",
  title: "Funding Readiness 101",
  description: "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
  longDescription: "This comprehensive course will teach you everything you need to know about securing funding for your organization. From understanding different funding sources to crafting compelling proposals, you'll gain the skills and confidence to attract the resources your mission needs. You'll learn from real-world case studies, practice with interactive exercises, and receive personalized feedback on your funding strategies.",
  duration: "8 weeks",
  students: "3,200",
  rating: "4.9",
  level: "Beginner",
  price: 299,
  isFree: false,
  category: "Funding Strategy",
  certification: true,
  language: "English, Spanish",
  image: fundingImage,
  lastUpdated: "December 2024",
  instructor: {
    name: "Dr. Michael Chen",
    title: "Funding Strategy Expert & Grant Consultant",
    bio: "Dr. Chen has over 20 years of experience in nonprofit funding and grant writing. He has helped organizations secure over $50 million in funding and has trained thousands of professionals in fundraising strategies. He holds a Ph.D. in Nonprofit Management and serves as a consultant for major foundations.",
    avatar: instructorImage,
    students: "15,000+",
    courses: 8,
    rating: "4.9"
  },
  modules: [
    {
      id: 1,
      title: "Introduction to Funding",
      duration: "45 mins",
      lessons: [
        { id: 1, title: "Welcome & Course Overview", duration: "5 mins", preview: true, completed: false },
        { id: 2, title: "Understanding the Funding Landscape", duration: "10 mins", preview: true, completed: false },
        { id: 3, title: "Types of Funding Sources", duration: "12 mins", preview: false, completed: false },
        { id: 4, title: "Building Your Funding Mindset", duration: "8 mins", preview: false, completed: false },
        { id: 5, title: "Module 1 Quiz", duration: "10 mins", preview: false, completed: false }
      ]
    },
    {
      id: 2,
      title: "Grant Writing Fundamentals",
      duration: "90 mins",
      lessons: [
        { id: 6, title: "Grant Writing Basics", duration: "15 mins", preview: false, completed: false },
        { id: 7, title: "Researching Grant Opportunities", duration: "12 mins", preview: false, completed: false },
        { id: 8, title: "Crafting a Compelling Narrative", duration: "18 mins", preview: false, completed: false },
        { id: 9, title: "Budget Development", duration: "15 mins", preview: false, completed: false },
        { id: 10, title: "Letters of Support", duration: "10 mins", preview: false, completed: false },
        { id: 11, title: "Review & Submission Process", duration: "10 mins", preview: false, completed: false },
        { id: 12, title: "Grant Writing Workshop", duration: "20 mins", preview: false, completed: false },
        { id: 13, title: "Module 2 Quiz", duration: "10 mins", preview: false, completed: false }
      ]
    },
    {
      id: 3,
      title: "Investor Relations",
      duration: "60 mins",
      lessons: [
        { id: 14, title: "Understanding Investor Expectations", duration: "12 mins", preview: false, completed: false },
        { id: 15, title: "Creating Your Pitch Deck", duration: "15 mins", preview: false, completed: false },
        { id: 16, title: "Financial Projections", duration: "12 mins", preview: false, completed: false },
        { id: 17, title: "Pitch Practice & Feedback", duration: "15 mins", preview: false, completed: false },
        { id: 18, title: "Negotiating Terms", duration: "10 mins", preview: false, completed: false },
        { id: 19, title: "Module 3 Quiz", duration: "8 mins", preview: false, completed: false }
      ]
    },
    {
      id: 4,
      title: "Building Partnerships",
      duration: "75 mins",
      lessons: [
        { id: 20, title: "Partnership Fundamentals", duration: "10 mins", preview: false, completed: false },
        { id: 21, title: "Identifying Strategic Partners", duration: "12 mins", preview: false, completed: false },
        { id: 22, title: "Outreach & Relationship Building", duration: "15 mins", preview: false, completed: false },
        { id: 23, title: "Creating Win-Win Proposals", duration: "15 mins", preview: false, completed: false },
        { id: 24, title: "Managing Partnerships", duration: "12 mins", preview: false, completed: false },
        { id: 25, title: "Case Studies", duration: "15 mins", preview: false, completed: false },
        { id: 26, title: "Final Assessment", duration: "10 mins", preview: false, completed: false }
      ]
    }
  ],
  whatYouLearn: [
    "Identify and research potential funding sources for your organization",
    "Write compelling grant proposals that stand out to funders",
    "Pitch to investors with confidence and professionalism",
    "Build lasting relationships with funders and sponsors",
    "Create a sustainable, diversified funding strategy",
    "Navigate the grant application and review process",
    "Develop realistic budgets and financial projections",
    "Negotiate favorable partnership terms"
  ],
  requirements: [
    "Basic understanding of your organization's mission and goals",
    "Access to internet and computer for course materials",
    "Willingness to practice writing and presenting",
    "No prior fundraising experience required"
  ],
  reviews: [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2 weeks ago",
      comment: "This course transformed my approach to fundraising. The grant writing module alone was worth the price. Highly recommended!"
    },
    {
      id: 2,
      name: "Marcus Williams",
      rating: 5,
      date: "1 month ago",
      comment: "Dr. Chen's teaching style is clear and practical. I secured my first grant within a month of completing this course."
    },
    {
      id: 3,
      name: "Lisa Chen",
      rating: 4,
      date: "1 month ago",
      comment: "Great content and well-structured. Would love to see more real-world examples, but overall excellent course."
    }
  ]
};

// Live events mock data
const liveEvents = [
  {
    id: "1",
    title: "Grant Writing Q&A Session",
    instructor: "Dr. Michael Chen",
    date: "Dec 15, 2024",
    time: "2:00 PM EST",
    duration: "60 mins",
    attendees: 45,
    maxAttendees: 100,
    type: "Live Q&A"
  },
  {
    id: "2",
    title: "Pitch Deck Workshop: Get Feedback",
    instructor: "Dr. Michael Chen",
    date: "Dec 22, 2024",
    time: "3:00 PM EST",
    duration: "90 mins",
    attendees: 28,
    maxAttendees: 50,
    type: "Workshop"
  }
];

// Similar courses mock data
const similarCourses = [
  {
    id: "2",
    title: "Donor Engagement & Strategic Partnerships",
    instructor: "Morgan Taylor",
    image: partnershipImage,
    rating: "4.8",
    students: "1,600",
    price: 279,
    category: "Partnership Strategy"
  },
  {
    id: "3",
    title: "Nonprofit Operations Management",
    instructor: "Sarah Rodriguez",
    image: operationsImage,
    rating: "4.8",
    students: "2,800",
    price: 249,
    category: "Operations"
  },
  {
    id: "4",
    title: "Advanced Grant Writing Strategies",
    instructor: "Dr. Michael Chen",
    image: fundingImage,
    rating: "4.9",
    students: "1,200",
    price: 349,
    category: "Funding Strategy"
  }
];

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastWatchedLesson, setLastWatchedLesson] = useState<number>(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [courseId]);

  // Check enrollment status from localStorage
  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    const enrolled = enrolledCourses.includes(courseId);
    setIsEnrolled(enrolled);
    
    if (enrolled) {
      const progress = localStorage.getItem(`course_${courseId}_progress`);
      if (progress) {
        setLastWatchedLesson(parseInt(progress) || 1);
      }
    }
  }, [courseId]);

  const handleEnrollClick = () => {
    // Demo mode: Free courses get instant enrollment, paid courses show checkout UI
    if (mockCourse.isFree) {
      handleFreeEnrollment();
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleFreeEnrollment = async () => {
    setIsProcessing(true);
    
    // Brief delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    enrolledCourses.push(courseId);
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    
    setIsEnrolled(true);
    setIsProcessing(false);
    
    toast.success("Enrolled successfully! 🎉", {
      description: "You can now access all course materials",
    });
    
    // Redirect to first lesson
    setTimeout(() => {
      navigate(`/courses/${courseId}/lessons/1`);
    }, 1000);
  };

  const handlePaymentMethod = async (method: string) => {
    setIsProcessing(true);
    setShowCheckoutModal(false);
    
    // Demo mode: Instant payment processing with brief UX feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
    enrolledCourses.push(courseId);
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
    
    setIsEnrolled(true);
    setIsProcessing(false);
    
    toast.success("Payment successful! 🎉", {
      description: `Demo: Enrolled using ${method}. Welcome to the course!`,
    });
    
    // Redirect to first lesson
    setTimeout(() => {
      navigate(`/courses/${courseId}/lessons/1`);
    }, 1000);
  };

  const handleContinueLearning = () => {
    navigate(`/courses/${courseId}/lessons/${lastWatchedLesson}`);
  };

  const totalLessons = mockCourse.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = mockCourse.modules.reduce((acc, module) => 
    acc + module.lessons.filter(l => l.completed).length, 0
  );
  const progressPercentage = isEnrolled ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors" data-testid="link-home">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/courses" className="hover:text-foreground transition-colors" data-testid="link-browse">Courses</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{mockCourse.category}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{mockCourse.title}</span>
            </div>
          </div>

          {/* Hero Section with Background */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="relative bg-gradient-to-r from-primary/10 to-orange-500/10 dark:from-primary/5 dark:to-orange-500/5 rounded-2xl p-8 md:p-12 mb-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Course Info */}
                <div className="lg:col-span-2 space-y-4">
                  <Badge className="bg-primary hover:bg-primary/90 text-white border-0" data-testid="badge-category">
                    {mockCourse.category}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold">{mockCourse.title}</h1>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    {mockCourse.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary fill-current" />
                      <span className="font-bold">{mockCourse.rating}</span>
                      <span className="text-muted-foreground">({mockCourse.reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span>{mockCourse.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{mockCourse.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <span>{mockCourse.language}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-muted-foreground" />
                      <span>{mockCourse.level}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {mockCourse.certification && (
                      <Badge variant="outline" className="border-primary text-primary">
                        <Award className="h-3 w-3 mr-1" />
                        Certificate included
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-muted-foreground">
                      Updated {mockCourse.lastUpdated}
                    </Badge>
                  </div>

                  {/* Instructor Info Preview */}
                  <div className="flex items-center gap-3 pt-4">
                    {mockCourse.instructor.avatar ? (
                      <img 
                        src={mockCourse.instructor.avatar}
                        alt={mockCourse.instructor.name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Created by</p>
                      <p className="font-semibold">{mockCourse.instructor.name}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview Card (Desktop Only) */}
                <div className="hidden lg:block">
                  <Card className="overflow-hidden shadow-xl">
                    <div className="aspect-video relative bg-neutral-900 flex items-center justify-center overflow-hidden">
                      <img 
                        src={mockCourse.image} 
                        alt={mockCourse.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer shadow-lg">
                          <PlayCircle className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-primary text-white border-0">
                        Preview
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Content */}
              <div className="lg:col-span-2 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum" data-testid="tab-curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor" data-testid="tab-instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    <Card className="p-6">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Target className="h-6 w-6 text-primary" />
                        What You'll Learn
                      </h2>
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                        {mockCourse.whatYouLearn.map((item, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-2xl font-bold mb-4">Course Description</h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {mockCourse.longDescription}
                      </p>
                      <Separator className="my-4" />
                      <div>
                        <h3 className="font-semibold mb-3">Requirements</h3>
                        <ul className="space-y-2">
                          {mockCourse.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Course Stats</h2>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{mockCourse.students}</p>
                          <p className="text-sm text-muted-foreground">Students</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{totalLessons}</p>
                          <p className="text-sm text-muted-foreground">Lessons</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{mockCourse.duration}</p>
                          <p className="text-sm text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                          <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">Yes</p>
                          <p className="text-sm text-muted-foreground">Certificate</p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Curriculum Tab */}
                  <TabsContent value="curriculum">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <BookOpen className="h-6 w-6 text-yellow-500" />
                          Course Curriculum
                        </h2>
                        <Badge variant="outline" className="text-sm">
                          {mockCourse.modules.length} modules • {totalLessons} lessons
                        </Badge>
                      </div>
                      
                      <Accordion type="single" collapsible className="w-full" defaultValue="module-1">
                        {mockCourse.modules.map((module, moduleIndex) => (
                          <AccordionItem 
                            key={module.id} 
                            value={`module-${module.id}`}
                            className="border rounded-lg mb-3 px-4"
                          >
                            <AccordionTrigger className="hover:no-underline py-4" data-testid={`accordion-module-${module.id}`}>
                              <div className="flex items-start justify-between w-full pr-4">
                                <div className="text-left">
                                  <h3 className="font-semibold text-base mb-1">
                                    Module {module.id}: {module.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground font-normal">
                                    {module.lessons.length} lessons • {module.duration}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2 pt-2 pb-2">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    onClick={() => {
                                      if (isEnrolled || lesson.preview) {
                                        navigate(`/courses/${courseId}/lessons/${lesson.id}`);
                                      }
                                    }}
                                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group ${
                                      isEnrolled || lesson.preview ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                                    }`}
                                    data-testid={`lesson-${lesson.id}`}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      {isEnrolled ? (
                                        lesson.completed ? (
                                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                          <PlayCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                        )
                                      ) : lesson.preview ? (
                                        <PlayCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                      ) : (
                                        <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                      )}
                                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {lesson.preview && !isEnrolled && (
                                        <Badge variant="outline" className="text-xs border-primary text-primary">
                                          Preview
                                        </Badge>
                                      )}
                                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {lesson.duration}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </Card>
                  </TabsContent>

                  {/* Instructor Tab */}
                  <TabsContent value="instructor">
                    <Card className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Your Instructor</h2>
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          {mockCourse.instructor.avatar ? (
                            <img 
                              src={mockCourse.instructor.avatar}
                              alt={mockCourse.instructor.name}
                              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-primary/20"
                            />
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg">
                              <Users className="h-16 w-16 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="font-bold text-2xl mb-1">{mockCourse.instructor.name}</h3>
                            <p className="text-muted-foreground text-lg mb-3">{mockCourse.instructor.title}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Star className="h-5 w-5 text-primary fill-current" />
                              <span className="font-semibold">{mockCourse.instructor.rating}</span>
                              <span className="text-muted-foreground">Instructor Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold">{mockCourse.instructor.students}</span>
                              <span className="text-muted-foreground">Students</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PlayCircle className="h-5 w-5 text-muted-foreground" />
                              <span className="font-semibold">{mockCourse.instructor.courses}</span>
                              <span className="text-muted-foreground">Courses</span>
                            </div>
                          </div>

                          <Separator />

                          <p className="text-muted-foreground leading-relaxed">
                            {mockCourse.instructor.bio}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews">
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Student Reviews</h2>
                        <div className="flex items-center gap-2">
                          <Star className="h-6 w-6 text-yellow-500 fill-current" />
                          <span className="text-2xl font-bold">{mockCourse.rating}</span>
                          <span className="text-muted-foreground">({mockCourse.reviews.length} reviews)</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {mockCourse.reviews.map((review) => (
                          <div key={review.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">
                                    {review.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-semibold">{review.name}</p>
                                  <p className="text-sm text-muted-foreground">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <ThumbsUp className="h-4 w-4" />
                                Helpful
                              </button>
                              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <MessageSquare className="h-4 w-4" />
                                Reply
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Enrollment Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24 shadow-lg border-2">
                  <div className="aspect-video bg-neutral-900 rounded-lg mb-4 relative flex items-center justify-center overflow-hidden lg:hidden">
                    <img 
                      src={mockCourse.image} 
                      alt={mockCourse.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center cursor-pointer shadow-lg">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                  
                  {!isEnrolled ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold mb-2">
                          {mockCourse.isFree ? "Free" : `$${mockCourse.price}`}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          One-time payment • Lifetime access
                        </p>
                        
                        {/* BNPL Payment Options */}
                        {!mockCourse.isFree && (
                          <div className="flex flex-col gap-2 pt-3 border-t">
                            <p className="text-xs text-muted-foreground font-medium">Or pay in installments with:</p>
                            <div className="flex items-center justify-center gap-3 flex-wrap">
                              <div className="px-3 py-1.5 border rounded-md bg-white dark:bg-neutral-800 flex items-center gap-1.5">
                                <div className="font-semibold text-xs" style={{ color: '#FFB3C7' }}>Klarna</div>
                              </div>
                              <div className="px-3 py-1.5 border rounded-md bg-white dark:bg-neutral-800 flex items-center gap-1.5">
                                <div className="font-semibold text-xs" style={{ color: '#B2FCE4' }}>Afterpay</div>
                              </div>
                              <div className="px-3 py-1.5 border rounded-md bg-white dark:bg-neutral-800 flex items-center gap-1.5">
                                <div className="font-semibold text-xs" style={{ color: '#0FA0EA' }}>Affirm</div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              4 interest-free payments of ${(mockCourse.price / 4).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full mb-4 bg-primary hover:bg-primary/90 text-white font-semibold shadow-md hover:shadow-lg transition-all" 
                        size="lg"
                        onClick={handleEnrollClick}
                        disabled={isProcessing}
                        data-testid="button-enroll"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Enroll Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full mb-4">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Enrolled</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You have access to this course
                        </p>
                      </div>

                      <Button 
                        className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all" 
                        size="lg"
                        onClick={handleContinueLearning}
                        data-testid="button-continue"
                      >
                        Continue Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Your Progress</span>
                          <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          {completedLessons} of {totalLessons} lessons completed
                        </p>
                      </div>
                    </>
                  )}

                  <Separator className="my-4" />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Mobile and desktop</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                    <button
                      onClick={() => navigate('/community')}
                      className="flex items-center gap-3 w-full hover:bg-neutral-50 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors group"
                      data-testid="button-community-access"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="flex-1 text-left">Access to community</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>English & Spanish subtitles</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Live Events Section */}
          {isEnrolled && liveEvents.length > 0 && (
            <div className="max-w-7xl mx-auto mt-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">Upcoming Live Events</h2>
                <Badge className="bg-[#E5A000] hover:bg-[#E5A000]/90 text-white">
                  <Video className="h-3 w-3 mr-1" />
                  Enrolled students only
                </Badge>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {liveEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-[#E5A000]"
                    onClick={() => toast.success("Event registration coming soon!")}
                    data-testid={`live-event-${event.id}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline" className="text-[#E5A000] border-[#E5A000]">
                          {event.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{event.attendees}/{event.maxAttendees}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-xl mb-3">{event.title}</h3>
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{event.date} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{event.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserPlus className="h-4 w-4 flex-shrink-0" />
                          <span>with {event.instructor}</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-[#E5A000] hover:bg-[#E5A000]/90 text-white"
                        data-testid={`button-register-event-${event.id}`}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Register for Event
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Similar Courses Section */}
          <div className="max-w-7xl mx-auto mt-16">
            <h2 className="text-3xl font-bold mb-8">Similar Courses You Might Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCourses.map((course) => (
                <Card
                  key={course.id}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  data-testid={`similar-course-${course.id}`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <Badge className="mb-2 bg-primary hover:bg-primary/90 text-white border-0">
                      {course.category}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      by {course.instructor}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-muted-foreground">({course.students})</span>
                      </div>
                      <div className="font-bold text-lg">${course.price}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Fake Stripe Checkout Modal */}
      <FakeStripeCheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
        courseTitle={mockCourse.title}
        price={mockCourse.price}
        onPaymentSuccess={handlePaymentMethod}
      />
    </div>
  );
}
