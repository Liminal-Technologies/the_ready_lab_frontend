import { Button } from "@/components/ui/button";
import { Award, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import ctaBackground from "/attached_assets/stock_images/diverse_business_tea_d87c6b57.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthModal } from "./auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const FinalCTASection = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleStartLearning = () => {
    if (auth.user) {
      navigate('/courses');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleJoinCommunity = () => {
    if (auth.user) {
      navigate('/community');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
    <section className="py-16 lg:py-24 relative text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={ctaBackground} 
          alt="Professional team celebrating success" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Content Bubble */}
        <div className="max-w-3xl mx-auto bg-yellow-50/95 dark:bg-yellow-100/95 backdrop-blur-sm rounded-3xl px-8 py-10 shadow-2xl border-2 border-yellow-200/50">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-900">
            Get Certified. Get Funded. Get Ready.
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-700 dark:text-gray-800">
            Join thousands who've transformed their ideas into funded ventures
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
            <Button 
              size="lg" 
              className="w-full sm:w-auto font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              style={{ backgroundColor: '#FDB022', color: '#000' }}
              onClick={handleStartLearning}
              data-testid="button-start-learning-cta"
            >
              <Award className="h-5 w-5 mr-2" />
              Start Learning
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto font-semibold border-2 border-gray-800 bg-white hover:bg-gray-100 text-gray-900 shadow-lg hover:shadow-xl transition-all"
              onClick={handleJoinCommunity}
              data-testid="button-join-community-cta"
            >
              <Users className="h-5 w-5 mr-2" />
              Join Community
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-gray-700 dark:text-gray-800">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>

    </section>

    <AuthModal 
      isOpen={isAuthModalOpen} 
      onClose={() => setIsAuthModalOpen(false)}
      defaultMode="signup"
    />
    </>
  );
};

export default FinalCTASection;