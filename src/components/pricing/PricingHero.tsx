import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";

const PricingHero = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const handleStartFreeTrial = () => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    }
  };

  const handleJoinAsEducator = () => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    }
  };

  const handleBookDemo = () => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      setAuthMode("signup");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="pt-24 pb-16 px-4 text-center bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Always Free to Learn
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Join for free and start learning today. Pay only for premium courses, certifications, communities, and events.
          </p>
          
          <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
            Whether you're building your business, teaching your expertise, or scaling your institution — The Ready Lab has flexible options for everyone.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleStartFreeTrial}
              data-testid="button-start-free-trial"
            >
              {auth.user ? "Go to Dashboard" : "Start Free Trial"}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleJoinAsEducator}
              data-testid="button-join-educator"
            >
              {auth.user ? "Go to Dashboard" : "Join as Educator"}
            </Button>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={handleBookDemo}
              data-testid="button-book-demo"
            >
              {auth.user ? "Go to Dashboard" : "Book Demo"}
            </Button>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};

export default PricingHero;