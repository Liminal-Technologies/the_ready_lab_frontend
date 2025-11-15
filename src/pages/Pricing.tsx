import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronRight,
  Check,
  Zap,
  Users,
  GraduationCap,
  Building2,
  CreditCard,
  Shield,
  Globe,
  Clock,
  Award,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";

interface SelectedPlan {
  name: string;
  price: { monthly: number; annual: number };
  role: 'student' | 'educator';
  billingCycle: 'monthly' | 'annual';
}

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'signup'>('signup');
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const navigate = useNavigate();
  const { auth } = useAuth();

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePlanClick = (plan: { name: string; price: { monthly: number; annual: number }; role: 'student' | 'educator' }) => {
    if (!auth.user) {
      setSelectedPlan({
        ...plan,
        billingCycle
      });
      setAuthDefaultMode('signup');
      setIsAuthModalOpen(true);
    } else {
      // Navigate to appropriate page based on plan role
      if (plan.role === 'educator') {
        navigate('/educator/dashboard');
      } else {
        navigate('/courses');
      }
    }
  };

  const handleDemoRequest = () => {
    navigate('/solutions');
  };

  const studentPlans = [
    {
      name: "Free",
      price: { monthly: 0, annual: 0 },
      description: "Perfect for getting started",
      features: [
        "Access to free courses",
        "Community participation",
        "Progress tracking",
        "Mobile & desktop access",
        "Basic certifications",
      ],
      cta: "Get Started Free",
      popular: false,
      color: "default" as const,
      role: "student" as const,
    },
    {
      name: "Pro",
      price: { monthly: 29, annual: 290 },
      description: "For serious learners",
      features: [
        "Everything in Free",
        "All premium courses",
        "Priority support",
        "Downloadable resources",
        "Advanced certifications",
        "Ad-free experience",
        "Early access to new content",
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "primary" as const,
      role: "student" as const,
    },
  ];

  const educatorPlans = [
    {
      name: "Creator",
      price: { monthly: 0, annual: 0 },
      description: "Start teaching today",
      features: [
        "Create & sell courses",
        "85% revenue share",
        "Student analytics",
        "Community tools",
        "Live event hosting",
        "Payment processing",
      ],
      cta: "Join as Educator",
      popular: false,
      color: "default" as const,
      role: "educator" as const,
    },
    {
      name: "Pro Educator",
      price: { monthly: 49, annual: 490 },
      description: "Scale your teaching business",
      features: [
        "Everything in Creator",
        "90% revenue share",
        "Advanced analytics",
        "Custom branding",
        "Priority listing",
        "Dedicated support",
        "Marketing tools",
      ],
      cta: "Upgrade to Pro",
      popular: true,
      color: "primary" as const,
      role: "educator" as const,
    },
  ];

  const institutionFeatures = [
    { icon: Users, title: "Unlimited Learners", description: "Scale from 50 to 50,000+ users" },
    { icon: Shield, title: "SSO & Security", description: "Enterprise-grade authentication" },
    { icon: BarChart3, title: "Advanced Analytics", description: "Track progress & ROI" },
    { icon: Globe, title: "White-Label", description: "Your brand, our platform" },
  ];

  const faqs = [
    {
      question: "Is there really a free plan?",
      answer: "Yes! Our free plan gives you access to hundreds of courses, community features, and basic certifications. You only pay for premium courses, advanced certifications, or exclusive content.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. All subscriptions are month-to-month with no long-term commitment. Cancel anytime from your account settings.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and offer Buy Now Pay Later options through Klarna, Afterpay, and Affirm.",
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! Students with a valid .edu email receive 50% off Pro plans. Verify your student status during checkout.",
    },
    {
      question: "What's included in the free trial?",
      answer: "Get 14 days of Pro access with no credit card required. Full access to premium courses, certifications, and all platform features.",
    },
    {
      question: "How does institutional pricing work?",
      answer: "Enterprise pricing is customized based on your needs, number of users, and features required. Schedule a demo to get a personalized quote.",
    },
  ];

  const paymentMethods = [
    { name: "Credit Cards", icon: CreditCard },
    { name: "Klarna", icon: Sparkles },
    { name: "Afterpay", icon: Clock },
    { name: "Affirm", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors" data-testid="link-home">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Pricing</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              <Zap className="h-3 w-3 mr-1" />
              Always Free to Start
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join for free and start learning today. Pay only for premium content, certifications, and exclusive communities.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="button-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  billingCycle === "annual"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-testid="button-annual"
              >
                Annual
                <Badge variant="secondary" className="ml-2 bg-green-500/10 text-green-700 dark:text-green-400">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="students" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="students" className="flex items-center gap-2" data-testid="tab-students">
                <GraduationCap className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="educators" className="flex items-center gap-2" data-testid="tab-educators">
                <Users className="h-4 w-4" />
                Educators
              </TabsTrigger>
              <TabsTrigger value="institutions" className="flex items-center gap-2" data-testid="tab-institutions">
                <Building2 className="h-4 w-4" />
                Institutions
              </TabsTrigger>
            </TabsList>

            {/* Student Plans */}
            <TabsContent value="students" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {studentPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative ${
                      plan.popular
                        ? "border-primary border-2 shadow-lg"
                        : "border-border"
                    }`}
                    data-testid={`student-plan-${index}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          ${billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {billingCycle === "monthly" ? "/month" : "/year"}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={() => handlePlanClick(plan)}
                        data-testid={`button-plan-${index}`}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Educator Plans */}
            <TabsContent value="educators" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {educatorPlans.map((plan, index) => (
                  <Card
                    key={index}
                    className={`relative ${
                      plan.popular
                        ? "border-primary border-2 shadow-lg"
                        : "border-border"
                    }`}
                    data-testid={`educator-plan-${index}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground px-3 py-1">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">
                          ${billingCycle === "monthly" ? plan.price.monthly : plan.price.annual}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          {billingCycle === "monthly" ? "/month" : "/year"}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={() => handlePlanClick(plan)}
                        data-testid={`button-educator-${index}`}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Institution Plans */}
            <TabsContent value="institutions" className="space-y-8">
              <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-3xl">Enterprise Solutions</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Custom pricing tailored to your organization's needs
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {institutionFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex gap-4 justify-center pt-4">
                    <Button size="lg" data-testid="button-request-demo">
                      Request Demo
                    </Button>
                    <Button size="lg" variant="outline" data-testid="button-contact-sales">
                      Contact Sales
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Flexible Payment Options</h2>
            <p className="text-muted-foreground mb-8">
              Pay with your preferred method or split payments with Buy Now Pay Later
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <div
                    key={index}
                    className="p-4 bg-background rounded-lg border border-border flex flex-col items-center gap-2"
                  >
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{method.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about pricing and plans
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-border rounded-lg px-6 bg-card"
                  data-testid={`faq-${index}`}
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-10 pb-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of learners, educators, and institutions transforming education
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  onClick={() => {
                    if (!auth.user) {
                      setSelectedPlan({
                        name: 'Free',
                        price: { monthly: 0, annual: 0 },
                        role: 'student',
                        billingCycle
                      });
                      setAuthDefaultMode('signup');
                      setIsAuthModalOpen(true);
                    } else {
                      navigate('/courses');
                    }
                  }}
                  data-testid="button-cta-signup"
                >
                  Sign Up Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleDemoRequest}
                  data-testid="button-cta-demo"
                >
                  Book a Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authDefaultMode}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default Pricing;
