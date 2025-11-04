import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Check, Loader2, Sparkles, Zap, Crown } from "lucide-react";

interface PlanSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlanSelected?: (plan: string) => void;
}

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  icon: typeof Sparkles;
  iconColor: string;
  popular?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonVariant: "outline" | "default";
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free Plan",
    price: "$0",
    period: "/month",
    icon: Sparkles,
    iconColor: "text-muted-foreground",
    features: [
      { text: "1 course", included: true },
      { text: "10% platform fee", included: true },
      { text: "Community access", included: true },
      { text: "Basic analytics", included: true },
      { text: "Live streaming", included: false },
      { text: "White-label", included: false },
    ],
    buttonText: "Start Free",
    buttonVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$79.99",
    period: "/month",
    icon: Zap,
    iconColor: "text-primary",
    popular: true,
    features: [
      { text: "10 courses", included: true },
      { text: "5% platform fee", included: true },
      { text: "Live streaming", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom branding", included: true },
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "default",
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "$199.99",
    period: "/month",
    icon: Crown,
    iconColor: "text-yellow-500",
    features: [
      { text: "Unlimited courses", included: true },
      { text: "2% platform fee", included: true },
      { text: "White-label platform", included: true },
      { text: "Priority support", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom integrations", included: true },
    ],
    buttonText: "Go Premium",
    buttonVariant: "default",
  },
];

export function PlanSelectionModal({
  open,
  onOpenChange,
  onPlanSelected,
}: PlanSelectionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);

    if (planId === "free") {
      // Free plan - just save and close
      localStorage.setItem("educatorPlan", planId);

      toast({
        title: "Welcome to The Ready Lab! 🎉",
        description:
          "You're all set with the Free plan. Start creating your first course!",
      });

      onPlanSelected?.(planId);
      onOpenChange(false);
      setSelectedPlan(null);
    } else {
      // Paid plans - show mock checkout
      setIsProcessing(true);

      // Simulate Stripe checkout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Save plan selection
      localStorage.setItem("educatorPlan", planId);

      setIsProcessing(false);
      setSelectedPlan(null);

      toast({
        title: "Payment successful! 🎉",
        description: `Welcome to the ${planId === "pro" ? "Pro" : "Premium"} plan. Let's build something amazing!`,
      });

      onPlanSelected?.(planId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-2">
            Choose Your Educator Plan
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Start teaching and earning today. Upgrade anytime as you grow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 py-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isLoading = isProcessing && isSelected;

            return (
              <Card
                key={plan.id}
                className={`relative p-6 transition-all duration-300 ${
                  plan.popular
                    ? "ring-2 ring-primary shadow-lg scale-105"
                    : "hover:shadow-md hover:scale-[1.02]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 ${plan.iconColor}`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  {plan.id === "free" && (
                    <p className="text-sm text-muted-foreground">
                      Perfect to get started
                    </p>
                  )}
                  {plan.id === "pro" && (
                    <p className="text-sm text-primary font-medium">
                      Best value for growing educators
                    </p>
                  )}
                  {plan.id === "premium" && (
                    <p className="text-sm text-muted-foreground">
                      For serious course creators
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 ${
                        !feature.included ? "opacity-50" : ""
                      }`}
                    >
                      <Check
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          feature.included
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          !feature.included ? "line-through" : ""
                        }`}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={plan.buttonVariant}
                  size="lg"
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={isProcessing}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>

                {plan.id === "free" && (
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    No credit card required
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          <p>
            All plans include access to our educator community and resources.
          </p>
          <p className="mt-1">You can upgrade, downgrade, or cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
