import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, Users, BarChart3, Shield, BookOpen, Award, TrendingUp, Globe, 
  Zap, Code, ChevronRight, Check
} from "lucide-react";
import { RequestDemoModal } from "@/components/institution/RequestDemoModal";
import { ContactSalesModal } from "@/components/institution/ContactSalesModal";

const Solutions = () => {
  const [showRequestDemo, setShowRequestDemo] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);

  const solutionTypes = [
    {
      icon: Building2,
      title: "Ready Lab for Institutions",
      description: "Pre-built, feature-rich LMS platform ready to deploy for universities, nonprofits, and enterprises.",
      features: [
        "Cohort management & tracking",
        "Advanced analytics & reporting",
        "SSO & enterprise security",
        "Custom branding options",
        "Multi-language support",
        "White-label capabilities"
      ],
      cta: "Request Demo",
      ctaAction: () => setShowRequestDemo(true),
      popular: true,
      color: "primary",
    },
    {
      icon: Code,
      title: "Custom White-Label Solutions",
      description: "Fully branded, custom-built LMS tailored to your exact specifications with complete ownership.",
      features: [
        "100% custom design & branding",
        "Tailored feature development",
        "Full source code ownership",
        "Dedicated development team",
        "Ongoing support & maintenance",
        "Unlimited customization"
      ],
      cta: "Discuss Custom Build",
      ctaAction: () => setShowContactSales(true),
      popular: false,
      color: "secondary",
    },
  ];

  const valueProps = [
    {
      icon: Users,
      title: "Scale Workforce Development",
      description: "Train hundreds or thousands of learners with customized learning paths. Track progress, manage cohorts, and measure outcomes all in one platform.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Reporting",
      description: "Get deep insights into learner engagement, completion rates, and skill development. Export custom reports for compliance and stakeholder updates.",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "SOC 2 compliant with SSO integration, role-based access control, and comprehensive audit logs. Your data is secure and compliant.",
    },
    {
      icon: Award,
      title: "Custom Branding & Certification",
      description: "White-label the platform with your institution's branding. Issue certificates and credentials that align with your standards and accreditation.",
    },
  ];

  const features = [
    { icon: BookOpen, title: "Custom Learning Paths", description: "Tailored curricula for departments and roles" },
    { icon: Globe, title: "Multi-Language Support", description: "Translate content into 6 languages" },
    { icon: TrendingUp, title: "Scalable Infrastructure", description: "From 50 to 50,000 learners" },
  ];

  const stats = [
    { value: "500+", label: "Organizations Served" },
    { value: "1M+", label: "Learners Trained" },
    { value: "94%", label: "Completion Rate" },
    { value: "4.9/5", label: "Average Rating" },
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
            <span className="text-foreground font-medium">Solutions</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 border-primary text-primary">
              <Building2 className="h-3 w-3 mr-1" />
              Trusted by 500+ Organizations
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Enterprise & Custom Learning Solutions
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose the perfect fit for your organization. Deploy quickly with our ready-made platform or build a fully custom solution tailored to your exact needs.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Types */}
      <section className="pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Choose Your Solution Type</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the approach that best fits your timeline, budget, and customization needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16">
            {solutionTypes.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card 
                  key={index} 
                  className={`relative hover:shadow-lg transition-all ${
                    solution.popular ? 'border-primary border-2 shadow-md' : ''
                  }`}
                  data-testid={`solution-type-${index}`}
                >
                  {solution.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1">
                        <Zap className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">{solution.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full"
                      size="lg"
                      variant={solution.popular ? "default" : "outline"}
                      onClick={solution.ctaAction}
                      data-testid={`button-${index}-cta`}
                    >
                      {solution.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto p-8 bg-muted/30 rounded-2xl">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Why Organizations Choose The Ready Lab</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run successful learning programs at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`value-prop-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{prop.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {prop.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Enterprise Features</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-10 pb-10 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning Programs?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Schedule a personalized demo or discuss your custom solution needs with our team.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  onClick={() => setShowRequestDemo(true)}
                  data-testid="button-cta-demo"
                >
                  Request Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowContactSales(true)}
                  data-testid="button-cta-sales"
                >
                  Discuss Custom Build
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <RequestDemoModal 
        open={showRequestDemo}
        onOpenChange={setShowRequestDemo}
      />
      <ContactSalesModal 
        open={showContactSales}
        onOpenChange={setShowContactSales}
      />
    </div>
  );
};

export default Solutions;
