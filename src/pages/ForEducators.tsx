import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, DollarSign, BarChart, BookOpen, Video } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";

const ForEducators = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleExploreAsEducator = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    // Set educator role in localStorage
    localStorage.setItem('userRole', 'educator');
    localStorage.setItem('educatorPreviewMode', 'true');
    setShowAuthModal(false);
    navigate('/explore');
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Monetize Your Expertise",
      description: "Set your own pricing and earn up to 90% revenue share. We handle payments, subscriptions, and global distribution so you can focus on teaching.",
    },
    {
      icon: Users,
      title: "Reach Global Learners",
      description: "Access our community of motivated entrepreneurs and professionals. Your courses are automatically translated into 6 languages to maximize reach.",
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      description: "Track student engagement, completion rates, and revenue with powerful dashboards. Get actionable insights to improve your courses and grow your audience.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Join 10,000+ Educators</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Share Your Knowledge.<br />Build Your Business.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create engaging courses, host live events, and sell digital products on a platform designed for entrepreneurial educators. No technical skills required.
            </p>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 h-auto"
              onClick={handleExploreAsEducator}
              data-testid="button-explore-as-educator"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Explore as an Educator
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Free to get started • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Educators Choose The Ready Lab</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, launch, and scale your online teaching business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`benefit-card-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Create Any Type of Content</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 bg-background rounded-lg border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Video Courses</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload video lessons with automatic captioning in 6 languages. Organize into modules and tracks.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-background rounded-lg border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Live Events</h3>
                  <p className="text-sm text-muted-foreground">
                    Host interactive workshops and Q&A sessions with built-in chat, polls, and screen sharing.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-background rounded-lg border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Digital Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Sell templates, guides, and resources. Perfect for supplementing your courses.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-background rounded-lg border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Communities</h3>
                  <p className="text-sm text-muted-foreground">
                    Build engaged learning communities around your courses and expertise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Teaching?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of educators building successful online businesses
              </p>
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={handleExploreAsEducator}
                data-testid="button-cta-bottom"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default ForEducators;
