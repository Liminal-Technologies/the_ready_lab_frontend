import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, BarChart3, Shield, BookOpen, Award, TrendingUp, Globe, Zap, Palette, Code } from "lucide-react";
import { RequestDemoModal } from "@/components/institution/RequestDemoModal";
import { ContactSalesModal } from "@/components/institution/ContactSalesModal";

const Solutions = () => {
  const [showRequestDemo, setShowRequestDemo] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);

  const solutionTypes = [
    {
      icon: Building2,
      title: "Ready Lab for Institutions",
      description: "Pre-built, feature-rich LMS platform ready to deploy for universities, nonprofits, and enterprises. Get started in days, not months.",
      features: [
        "Cohort management & tracking",
        "Advanced analytics & reporting",
        "SSO & enterprise security",
        "Custom branding options",
        "Multi-language support",
      ],
      cta: "Request Demo",
      popular: true,
    },
    {
      icon: Code,
      title: "Custom White-Label Solutions",
      description: "Fully branded, custom-built LMS tailored to your exact specifications. Complete ownership and unlimited flexibility.",
      features: [
        "100% custom design & branding",
        "Tailored feature development",
        "Full source code ownership",
        "Dedicated development team",
        "Ongoing support & maintenance",
      ],
      cta: "Discuss Custom Build",
      popular: false,
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
    {
      icon: BookOpen,
      title: "Custom Learning Paths",
      description: "Create tailored curricula for different departments, roles, or skill levels. Combine courses, live events, and assessments.",
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Automatically translate content into 6 languages. Serve diverse learners globally without additional overhead.",
    },
    {
      icon: TrendingUp,
      title: "Scalable Infrastructure",
      description: "From 50 to 50,000 learners, our platform scales with your needs. No performance degradation, guaranteed uptime.",
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
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">Trusted by 500+ Organizations</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Enterprise & Custom<br />Learning Solutions
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you need a ready-to-deploy LMS or a fully custom white-label solution, we have the perfect fit for your organization's learning and development needs.
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setShowRequestDemo(true)}
                data-testid="button-request-demo"
              >
                <Building2 className="mr-2 h-5 w-5" />
                Request Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 h-auto"
                onClick={() => setShowContactSales(true)}
                data-testid="button-contact-sales"
              >
                Discuss Custom Build
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-6">
              Custom pricing for organizations • Free trial available
            </p>
          </div>
        </div>
      </section>

      {/* Solution Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Choose Your Solution Type</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select the approach that best fits your timeline, budget, and customization needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {solutionTypes.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-xl transition-all ${solution.popular ? 'border-primary border-2' : ''}`}
                  data-testid={`solution-type-${index}`}
                >
                  <CardHeader>
                    {solution.popular && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-4 w-fit">
                        <Zap className="h-3 w-3" />
                        Most Popular
                      </div>
                    )}
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{solution.title}</CardTitle>
                    <CardDescription className="text-base">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={solution.popular ? "default" : "outline"}
                      onClick={() => solution.popular ? setShowRequestDemo(true) : setShowContactSales(true)}
                      data-testid={`button-${index}-cta`}
                    >
                      {solution.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Organizations Choose The Ready Lab</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run successful learning programs at scale
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`value-prop-${index}`}>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
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

      {/* Additional Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Enterprise Features</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-lg border">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Proven Results</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Organizations Served</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <div className="text-sm text-muted-foreground">Learners Trained</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">94%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
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
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning Programs?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Schedule a personalized demo or discuss your custom solution needs with our team.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 h-auto"
                  onClick={() => setShowRequestDemo(true)}
                  data-testid="button-cta-demo"
                >
                  Request Demo
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto"
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
