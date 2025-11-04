import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, BookOpen, Search, Users, MessageCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string;
}

export function WelcomeTour() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: TourStep[] = [
    {
      title: "Welcome to Your Learning Hub!",
      description: "This is your personalized dashboard where you'll track your learning journey. Let's take a quick tour of the key features.",
      icon: <Sparkles className="h-8 w-8 text-primary" />,
    },
    {
      title: "Your Courses",
      description: "Access all your enrolled courses here. Track your progress, resume where you left off, and see upcoming lessons.",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      highlight: "my-courses"
    },
    {
      title: "Discover New Content",
      description: "Browse our library of courses, live events, and digital products. Find new learning opportunities tailored to your interests.",
      icon: <Search className="h-8 w-8 text-primary" />,
      highlight: "browse"
    },
    {
      title: "Join Communities",
      description: "Connect with fellow learners, share insights, and participate in discussions. Learning is better together!",
      icon: <Users className="h-8 w-8 text-primary" />,
      highlight: "communities"
    },
    {
      title: "AI Learning Assistant",
      description: "Need help? Click the chat button anytime to get instant answers, course recommendations, and personalized guidance.",
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      highlight: "ai-chat"
    }
  ];

  useEffect(() => {
    // Check if user has seen tour before
    const hasSeenTour = localStorage.getItem('hasSeenWelcomeTour');
    const onboardingData = localStorage.getItem('onboardingData');
    
    // Show tour only if they just completed onboarding
    if (!hasSeenTour && onboardingData) {
      const data = JSON.parse(onboardingData);
      // Show tour if onboarding was completed in the last 5 seconds
      const completedAt = new Date(data.completedAt).getTime();
      const now = new Date().getTime();
      if (now - completedAt < 5000) {
        setTimeout(() => setShowTour(true), 800);
      }
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('hasSeenWelcomeTour', 'true');
    setShowTour(false);
    // TODO: backend: save tour completion to user profile
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenWelcomeTour', 'true');
    setShowTour(false);
  };

  const progress = ((currentStep + 1) / tourSteps.length) * 100;
  const step = tourSteps[currentStep];

  return (
    <Dialog open={showTour} onOpenChange={setShowTour}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {step.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSkip}
              className="h-8 w-8"
              data-testid="button-skip-tour"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Step {currentStep + 1} of {tourSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {step.icon}
            </div>
          </div>

          {/* Description */}
          <p className="text-center text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentStep + 1}/{tourSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              data-testid="button-tour-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="flex gap-2">
              {currentStep < tourSteps.length - 1 ? (
                <Button onClick={handleNext} data-testid="button-tour-next">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="bg-primary" data-testid="button-finish-tour">
                  Get Started! 🚀
                </Button>
              )}
            </div>
          </div>

          {/* Skip Link */}
          {currentStep < tourSteps.length - 1 && (
            <div className="text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-muted-foreground hover:text-foreground underline"
                data-testid="button-skip-tour-link"
              >
                Skip tour
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
