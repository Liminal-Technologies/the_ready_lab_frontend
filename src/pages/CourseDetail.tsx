import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
} from "lucide-react";

// Mock course data
const mockCourse = {
  id: "1",
  title: "Funding Readiness 101",
  description:
    "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
  longDescription:
    "This comprehensive course will teach you everything you need to know about securing funding for your organization. From understanding different funding sources to crafting compelling proposals, you'll gain the skills and confidence to attract the resources your mission needs.",
  duration: "8 weeks",
  students: "3,200",
  rating: "4.9",
  level: "Beginner",
  price: 299,
  isFree: false,
  category: "Funding Strategy",
  certification: true,
  instructor: {
    name: "Dr. Sarah Johnson",
    title: "Funding Strategy Expert",
    bio: "20+ years of experience in nonprofit funding and grant writing",
  },
  modules: [
    {
      id: 1,
      title: "Introduction to Funding",
      lessons: 5,
      duration: "45 mins",
    },
    {
      id: 2,
      title: "Grant Writing Fundamentals",
      lessons: 8,
      duration: "90 mins",
    },
    {
      id: 3,
      title: "Investor Relations",
      lessons: 6,
      duration: "60 mins",
    },
    {
      id: 4,
      title: "Building Partnerships",
      lessons: 7,
      duration: "75 mins",
    },
  ],
  whatYouLearn: [
    "Identify and research potential funding sources",
    "Write compelling grant proposals",
    "Pitch to investors with confidence",
    "Build lasting relationships with funders",
    "Create a sustainable funding strategy",
  ],
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastWatchedLesson, setLastWatchedLesson] = useState<number>(1);

  // Check enrollment status from localStorage
  useEffect(() => {
    const enrolledCourses = JSON.parse(
      localStorage.getItem("enrolledCourses") || "[]",
    );
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
    if (mockCourse.isFree) {
      handleFreeEnrollment();
    } else {
      setShowCheckoutModal(true);
    }
  };

  const handleFreeEnrollment = async () => {
    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update localStorage
    const enrolledCourses = JSON.parse(
      localStorage.getItem("enrolledCourses") || "[]",
    );
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

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update localStorage
    const enrolledCourses = JSON.parse(
      localStorage.getItem("enrolledCourses") || "[]",
    );
    enrolledCourses.push(courseId);
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));

    setIsEnrolled(true);
    setIsProcessing(false);

    toast.success("Payment successful! 🎉", {
      description: `Enrolled using ${method}. Welcome to the course!`,
    });

    // Redirect to first lesson
    setTimeout(() => {
      navigate(`/courses/${courseId}/lessons/1`);
    }, 1000);
  };

  const handleContinueLearning = () => {
    navigate(`/courses/${courseId}/lessons/${lastWatchedLesson}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Course Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <Badge className="mb-4">{mockCourse.category}</Badge>
                  <h1 className="text-4xl font-bold mb-4">
                    {mockCourse.title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {mockCourse.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{mockCourse.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{mockCourse.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{mockCourse.duration}</span>
                    </div>
                    <Badge variant="outline">{mockCourse.level}</Badge>
                    {mockCourse.certification && (
                      <div className="flex items-center gap-2 text-primary">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">
                          Certificate included
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* What You'll Learn */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    What You'll Learn
                  </h2>
                  <ul className="space-y-3">
                    {mockCourse.whatYouLearn.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Course Content */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    Course Content
                  </h2>
                  <div className="space-y-3">
                    {mockCourse.modules.map((module) => (
                      <div
                        key={module.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div>
                          <h3 className="font-semibold mb-1">
                            Module {module.id}: {module.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {module.lessons} lessons • {module.duration}
                          </p>
                        </div>
                        <PlayCircle className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Instructor */}
                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Your Instructor</h2>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {mockCourse.instructor.name}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {mockCourse.instructor.title}
                      </p>
                      <p className="text-sm">{mockCourse.instructor.bio}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Enrollment Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <div className="aspect-video bg-primary rounded-lg mb-6 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white" />
                  </div>

                  {!isEnrolled ? (
                    <>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold mb-2">
                          {mockCourse.isFree ? "Free" : `$${mockCourse.price}`}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          One-time payment • Lifetime access
                        </p>
                      </div>

                      <Button
                        className="w-full mb-4"
                        size="lg"
                        onClick={handleEnrollClick}
                        disabled={isProcessing}
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
                        className="w-full mb-4 bg-green-600 hover:bg-green-700"
                        size="lg"
                        onClick={handleContinueLearning}
                      >
                        Continue Learning
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Your Progress
                          </span>
                          <span className="font-medium">25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                    </>
                  )}

                  <div className="space-y-3 mt-6 pt-6 border-t text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Mobile and desktop access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span>Access to community</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Checkout Modal */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Choose Your Payment Method
            </DialogTitle>
            <DialogDescription>
              Secure payment powered by Stripe
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="text-center mb-6 p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">
                Course Price
              </div>
              <div className="text-4xl font-bold">${mockCourse.price}</div>
              <div className="text-sm text-muted-foreground mt-1">
                One-time payment
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-16 text-base justify-start hover:bg-accent"
                onClick={() => handlePaymentMethod("Credit/Debit Card")}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Credit / Debit Card</div>
                    <div className="text-xs text-muted-foreground">
                      Visa, Mastercard, Amex
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-16 text-base justify-start hover:bg-accent"
                onClick={() => handlePaymentMethod("Klarna")}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <span className="font-bold text-pink-600">K</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Klarna</div>
                    <div className="text-xs text-muted-foreground">
                      Pay in 4 interest-free payments
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-16 text-base justify-start hover:bg-accent"
                onClick={() => handlePaymentMethod("Afterpay")}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <span className="font-bold text-teal-600">A</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Afterpay</div>
                    <div className="text-xs text-muted-foreground">
                      Buy now, pay later
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full h-16 text-base justify-start hover:bg-accent"
                onClick={() => handlePaymentMethod("Affirm")}
                disabled={isProcessing}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="font-bold text-blue-600">a</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold">Affirm</div>
                    <div className="text-xs text-muted-foreground">
                      Monthly payment plans
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-6">
              Secure checkout powered by Stripe. Your payment information is
              encrypted and secure.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
