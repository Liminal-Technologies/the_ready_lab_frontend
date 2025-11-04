import { Check, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const EducatorPlans = () => {
  const educatorPlans = [
    {
      name: "Free Trial",
      price: "$0",
      duration: "14 days",
      popular: false,
      features: [
        "Upload 1 product",
        "Basic community features",
        "TRL branding",
        "0% fee on first 10 enrollments",
      ],
    },
    {
      name: "Creator Basic",
      price: "$49",
      duration: "per month",
      popular: false,
      features: [
        "Up to 3 courses or products",
        "8% platform fee per sale",
        "TRL branding",
        "Basic analytics",
        "Access to TRL creator community",
      ],
    },
    {
      name: "Creator Pro",
      price: "$129",
      duration: "per month",
      popular: true,
      features: [
        "Up to 10 products",
        "2–5% platform fee",
        "Custom domains + branded storefront",
        "Affiliate tools + course bundles",
        "Advanced analytics",
      ],
    },
    {
      name: "Premium",
      price: "$349",
      duration: "per month",
      popular: false,
      features: [
        "Unlimited products",
        "0–1% platform fee",
        "White-label options",
        "API integrations",
        "Dedicated onboarding and support",
        "Eligible for TRL educator certification",
      ],
    },
  ];

  const includedFeatures = [
    "Payout dashboard for course sales with real-time analytics",
    "Community creation tools and student engagement features",
    "AI tools for lesson planning + content prompts",
    "Custom storefront capabilities with your branding",
    "Access to verified educator track (apply to be certified)",
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-amber-600" />
            <span className="text-amber-600 font-semibold uppercase tracking-wider text-sm">
              EDUCATOR & CREATOR PLANS
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            For Experts Ready to Teach and Earn
          </h2>
          <p className="text-muted-foreground mb-4">
            Share your expertise with free tools to get started, then scale with
            powerful creator features
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {educatorPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-2xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {plan.duration}
                  </span>
                </div>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "variant-outline border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                  size="sm"
                >
                  Get Started
                </Button>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                        <Check className="w-2 h-2 text-green-600" />
                      </div>
                      <span className="text-xs text-foreground leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            🟢 All Educator Plans Include:
          </h3>
          <ul className="grid md:grid-cols-2 gap-2">
            {includedFeatures.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-green-800">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default EducatorPlans;
