import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  Award, 
  Target, 
  Flame, 
  Users, 
  Eye, 
  Headphones, 
  BookOpen, 
  Hand,
  CheckSquare,
  Star,
  Clock,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import MicroLearning from "@/components/MicroLearning";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const featuredTracks = [
  {
    title: "Funding Readiness 101",
    description: "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
    duration: "8 weeks",
    students: "3,200",
    rating: "4.9",
    level: "Beginner",
    price: "$299",
    category: "Funding Strategy",
    certification: true,
    featured: true
  },
  {
    title: "Business Infrastructure Mastery",
    description: "Set up compliance, budgets, and operational systems that funders demand to see.",
    duration: "6 weeks",
    students: "2,800",
    rating: "4.8",
    level: "Beginner",
    price: "$249",
    category: "Operations",
    certification: true,
    featured: false
  },
  {
    title: "Branding for Growth & Fundability",
    description: "Develop clear messaging and positioning that attracts investors and customers alike.",
    duration: "4 weeks",
    students: "2,100",
    rating: "4.9",
    level: "Intermediate",
    price: "$199",
    category: "Brand Strategy",
    certification: true,
    featured: false
  },
  {
    title: "AI for Entrepreneurs",
    description: "Streamline operations and scale efficiently using artificial intelligence tools and strategies.",
    duration: "5 weeks",
    students: "1,900",
    rating: "4.7",
    level: "Intermediate",
    price: "$229",
    category: "Technology",
    certification: true,
    featured: false
  },
  {
    title: "Donor Engagement & Strategic Partnerships",
    description: "Build lasting relationships with donors, sponsors, and strategic partners for sustainable growth.",
    duration: "6 weeks",
    students: "1,600",
    rating: "4.8",
    level: "Advanced",
    price: "$279",
    category: "Partnership Strategy",
    certification: true,
    featured: true
  }
];

const popularCourses = [
  {
    title: "Financial Fluency for Founders",
    description: "Master budgeting, financial planning, and reporting that builds credibility with funders.",
    duration: "4 weeks",
    students: "1,400",
    rating: "4.7",
    level: "Intermediate",
    price: "$179",
    category: "Financial Planning",
    certification: true,
    featured: false
  },
  {
    title: "Grant Writing Mastery",
    description: "Learn to write compelling grant proposals that get funded.",
    duration: "6 weeks",
    students: "2,200",
    rating: "4.9",
    level: "Beginner",
    price: "$249",
    category: "Funding Strategy",
    certification: true,
    featured: false
  },
  {
    title: "Social Impact Measurement",
    description: "Track and communicate your organization's impact effectively.",
    duration: "3 weeks",
    students: "980",
    rating: "4.6",
    level: "Intermediate",
    price: "$149",
    category: "Impact",
    certification: true,
    featured: false
  }
];

const communities = [
  {
    name: "Startups Under 2 Years",
    members: "2,400",
    description: "Connect with fellow early-stage entrepreneurs navigating the startup journey."
  },
  {
    name: "501(c)(3) Founders",
    members: "1,800",
    description: "A community for nonprofit leaders building sustainable impact organizations."
  },
  {
    name: "Creative Entrepreneurs",
    members: "1,500",
    description: "Artists, designers, and creative professionals scaling their businesses."
  },
  {
    name: "Tech-Enabled Businesses",
    members: "2,100",
    description: "Founders leveraging technology to solve problems and scale impact."
  }
];

const learningMethods = [
  {
    icon: Eye,
    title: "Visual",
    description: "Watch expert-led video tutorials"
  },
  {
    icon: Headphones,
    title: "Auditory",
    description: "Listen to audio lessons + guest Q&As"
  },
  {
    icon: BookOpen,
    title: "Reading/Writing",
    description: "Follow detailed guides + worksheets"
  },
  {
    icon: Hand,
    title: "Kinesthetic",
    description: "Complete real-world toolkits + simulations"
  }
];

const Courses = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleStartTrial = () => {
    if (auth.user) {
      // If logged in, go to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, open signup modal
      setIsAuthModalOpen(true);
    }
  };

  const handleBrowseCourses = () => {
    // Scroll to courses section or navigate to feed
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 text-center bg-background dark:bg-neutral-900">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Real Education. Real Results.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Explore expert-led courses that teach what funders, partners, and buyers actually want to see.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto" onClick={handleBrowseCourses}>
              <ArrowRight className="h-5 w-5 mr-2" />
              Browse All Courses
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={handleStartTrial}>
              <Play className="h-5 w-5 mr-2" />
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Tracks Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Target className="h-4 w-4" />
              Start With a Track
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🏁 Start With a Track
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock our most popular certification pathways:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTracks.map((course, index) => (
              <div 
                key={index}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Flame className="h-4 w-4" />
              Popular Right Now
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🔥 Popular Right Now
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Highlight top-rated courses and certification programs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course, index) => (
              <div 
                key={index}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CourseCard {...course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Micro Learning Feed */}
      <MicroLearning />

      {/* Top Communities Section */}
      <section className="py-16 bg-background dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Users className="h-4 w-4" />
              Join a Community
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              🏘️ Join a Community That Gets You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect with like-minded entrepreneurs and founders in your space.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {communities.map((community, index) => (
              <Card 
                key={index}
                className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-foreground">{community.name}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {community.members}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{community.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Join Community
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How You'll Learn Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How You'll Learn at The Ready Lab
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Our platform supports different learning styles so you can grow with clarity — your way.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {learningMethods.map((method, index) => (
              <Card 
                key={index}
                className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-scale-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-all duration-300">
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-foreground flex items-center justify-center gap-2">
                    🎨 {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <blockquote className="text-xl font-semibold text-foreground italic">
              "The Ready Lab was built for real people — no matter how you learn, we make sure you grow."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Get Certified. Get Funded. Get Ready.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <Award className="h-5 w-5 mr-2" />
              Start Learning
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
              <Users className="h-5 w-5 mr-2" />
              Join a Community
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signup"
      />
    </div>
  );
};

export default Courses;