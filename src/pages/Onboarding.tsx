import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
  Lightbulb,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string>("");

  const interests = [
    "Funding & Grants",
    "Business Operations",
    "Branding & Marketing",
    "Financial Planning",
    "Legal & Compliance",
    "Technology & AI",
    "Partnership Strategy",
    "Social Impact",
  ];

  const goals = [
    "Get Funding",
    "Build Business Infrastructure",
    "Grow My Brand",
    "Learn New Skills",
    "Connect with Others",
    "Get Certified",
  ];

  const experienceLevels = [
    {
      value: "beginner",
      label: "Just Starting Out",
      description: "New to entrepreneurship",
    },
    {
      value: "intermediate",
      label: "Building My Business",
      description: "1-3 years experience",
    },
    {
      value: "advanced",
      label: "Scaling & Growing",
      description: "3+ years experience",
    },
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }
    if (currentStep === 2 && selectedGoals.length === 0) {
      toast.error("Please select at least one goal");
      return;
    }
    if (currentStep === 3 && !selectedExperience) {
      toast.error("Please select your experience level");
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Save user interests
        await supabase.from("user_interests").insert(
          selectedInterests.map((interest) => ({
            user_id: user.id,
            interest_tag: interest,
          })),
        );
      }

      toast.success("Welcome to The Ready Lab! 🎉", {
        description: "Your profile is all set up",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast.error("Failed to save preferences", {
        description: "But you can still proceed to your dashboard",
      });
      navigate("/dashboard");
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to The Ready Lab!
          </h1>
          <p className="text-muted-foreground">
            Let's personalize your experience
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of 3
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            {currentStep === 1 && (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>What are you interested in?</CardTitle>
                <CardDescription>
                  Select topics you'd like to learn about (choose at least one)
                </CardDescription>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>What are your goals?</CardTitle>
                <CardDescription>
                  Tell us what you want to achieve (choose at least one)
                </CardDescription>
              </>
            )}
            {currentStep === 3 && (
              <>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle>What's your experience level?</CardTitle>
                <CardDescription>
                  Help us customize your learning path
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <div
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedInterests.includes(interest)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedInterests.includes(interest)}
                        onCheckedChange={() => toggleInterest(interest)}
                      />
                      <Label className="cursor-pointer">{interest}</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <div
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedGoals.includes(goal)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedGoals.includes(goal)}
                        onCheckedChange={() => toggleGoal(goal)}
                      />
                      <Label className="cursor-pointer">{goal}</Label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3">
                {experienceLevels.map((level) => (
                  <div
                    key={level.value}
                    onClick={() => setSelectedExperience(level.value)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedExperience === level.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedExperience === level.value
                            ? "border-primary bg-primary"
                            : "border-border"
                        }`}
                      >
                        {selectedExperience === level.value && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {level.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 3 ? "Complete" : "Next"}
                {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
