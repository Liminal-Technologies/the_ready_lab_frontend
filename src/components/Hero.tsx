import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { DemoVideoModal } from "@/components/DemoVideoModal";

// Ecudum-style Hero Section redesigned
const Hero = () => {
  const { t } = useLanguage();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleStartJourney = () => {
    if (auth.user) {
      navigate('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleWatchDemo = () => {
    setIsVideoModalOpen(true);
  };

  return (
    <section className="min-h-screen bg-white dark:bg-neutral-900 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Hero Content with Ghost Text Effect */}
          <div className="relative">
            {/* Small green accent tag - Ecudum style */}
            <div className="mb-6">
              <span className="inline-block text-sm font-medium px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                Transform Your Future
              </span>
            </div>

            {/* Main headline with ghost text behind */}
            <div className="relative mb-8">
              {/* Ghost text - very subtle, almost invisible */}
              <h1 
                className="absolute -top-4 left-0 text-7xl md:text-8xl lg:text-9xl font-bold leading-none select-none pointer-events-none opacity-[0.03]"
                aria-hidden="true"
              >
                Get Funded
              </h1>
              
              {/* Main bold headline - Ecudum style */}
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-black dark:text-white">
                Prepare &{" "}
                <span className="block mt-2 text-green-600 dark:text-green-400">
                  Get Funded
                </span>
              </h1>
            </div>

            {/* Description paragraph */}
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-xl leading-relaxed">
              Build the fundable business that funders actually want to back. Real education, real results, real opportunity.
            </p>

            {/* Pill-shaped CTA buttons - Ecudum style */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleStartJourney}
                data-testid="button-start-journey"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'hsl(45 100% 51%)', 
                  color: 'hsl(0 0% 0%)',
                  border: 'none'
                }}
              >
                Start Your Journey
              </Button>
              <Button 
                onClick={handleWatchDemo}
                data-testid="button-watch-demo"
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-base font-semibold border-2 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300"
              >
                Discover more
              </Button>
            </div>
          </div>

          {/* Right: Stats/Info Cards - Ecudum style */}
          <div className="relative hidden lg:block">
            {/* Large stat card on electric blue background */}
            <div 
              className="rounded-3xl p-8 mb-6 shadow-lg"
              style={{ backgroundColor: 'hsl(217 91% 60%)' }}
            >
              <div className="text-white">
                <div className="text-6xl font-bold mb-2">95%</div>
                <div className="text-lg opacity-90">Success Rate</div>
                <div className="text-sm opacity-75 mt-2">Graduates achieve funding goals within 12 months</div>
              </div>
            </div>

            {/* Smaller info cards grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">$2M+</div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300">Raised by students</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">3,200+</div>
                <div className="text-sm text-neutral-700 dark:text-neutral-300">Active learners</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile stats - shown below hero on small screens */}
        <div className="lg:hidden mt-12 grid grid-cols-2 gap-4">
          <div 
            className="rounded-2xl p-6 text-white shadow-md"
            style={{ backgroundColor: 'hsl(217 91% 60%)' }}
          >
            <div className="text-4xl font-bold mb-1">95%</div>
            <div className="text-sm opacity-90">Success Rate</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-1">$2M+</div>
            <div className="text-sm text-neutral-700 dark:text-neutral-300">Raised</div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="signup"
      />
      
      <DemoVideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
