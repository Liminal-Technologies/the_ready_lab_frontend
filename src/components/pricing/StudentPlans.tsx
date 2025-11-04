import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StudentPlans = () => {
  const studentPlans = [
    {
      name: "Free Trial",
      price: "$0",
      duration: "14 days",
      popular: false,
      features: [
        "Access 1 intro course + microlearning tools",
        "Limited community access",
        "Free business templates",
      ],
    },
    {
      name: "Monthly Plan",
      price: "$29",
      duration: "per month",
      popular: true,
      features: [
        "Full access to microlearning library",
        "Community groups by topic/stage",
        "Learning roadmap + progress tracker",
        "AI-powered support coach",
        "Discounts on certifications",
      ],
    },
    {
      name: "Certifications",
      price: "Starting at $199",
      duration: "per track",
      popular: false,
      features: [
        "4 to 8 week deep learning programs",
        "Instructor-reviewed assignments",
        "Verified digital certification badge",
        "Includes learning tools + templates",
        "Access to live sessions / Q&A",
      ],
    },
    {
      name: "Bundle Options",
      price: "$499",
      duration: "3 courses",
      popular: false,
      features: [
        "Bundle multiple tracks at a discount",
        "Includes bonus tools and coaching options",
        "Save 30% compared to individual purchases",
        "Extended access period",
        "Priority support",
      ],
    },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
              STUDENT PLANS
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            For Entrepreneurs Ready to Learn and Grow
          </h2>
          <p className="text-muted-foreground mb-4">
            Access free courses and tools, plus premium learning paths and
            certifications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {studentPlans.map((plan, index) => (
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
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1 mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.duration}
                  </span>
                </div>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "variant-outline border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  Get Started
                </Button>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      </div>
                      <span className="text-sm text-foreground leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3">
            🎓 Certification Credibility:
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            All certifications are industry-recognized and include verified
            digital badges that can be shared on LinkedIn, resumes, and
            professional profiles.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="text-accent">💳</span> Payment Options:
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              • Pay in full or split payments via{" "}
              <a
                href="https://klarna.com"
                className="text-primary hover:underline"
              >
                Klarna
              </a>
              ,{" "}
              <a
                href="https://afterpay.com"
                className="text-primary hover:underline"
              >
                Afterpay
              </a>
              , or{" "}
              <a
                href="https://affirm.com"
                className="text-primary hover:underline"
              >
                Affirm
              </a>
            </li>
            <li>
              • Workforce development sponsorships and scholarships accepted (if
              eligible)
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default StudentPlans;
