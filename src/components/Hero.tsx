import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { DemoVideoModal } from "@/components/DemoVideoModal";
import heroImage from "@/assets/hero-entrepreneurs.jpg";

// Ecudum-style Hero Section redesigned with full banner image
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
    <section className="min-h-screen relative overflow-hidden">
      {/* Full banner background image - Ecudum style */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Where education blooms alive" 
          className="w-full h-full object-cover"
        />
        {/* Subtle dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content overlay */}
      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* Left: Hero Content with text overlay on image - Ecudum style */}
          <div className="relative">
            {/* Main headline - bold white and yellow text on image */}
            <div className="relative mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                <span className="text-white block">
                  Where{" "}
                  <span style={{ color: 'hsl(45 100% 51%)' }}>education</span>
                </span>
                <span className="text-white block mt-2">
                  blooms{" "}
                  <span style={{ color: 'hsl(45 100% 51%)' }}>alive.</span>
                </span>
              </h1>
            </div>

            {/* Scroll down indicator - bottom left */}
            <div className="absolute -bottom-32 left-0 flex items-center gap-2 text-white/80 text-sm animate-bounce">
              <span>Scroll down</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>

          {/* Right: CTA content and buttons - positioned on image */}
          <div className="relative lg:text-right">
            {/* Description text - white on image */}
            <p className="text-base md:text-lg text-white mb-6 max-w-xl lg:ml-auto leading-relaxed" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
              Create and deliver on-the-job training that builds skills quickly. Mobile, Multilingual, Media-rich, Made for your frontline.
            </p>

            {/* Pill-shaped CTA buttons - Ecudum style */}
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Button 
                onClick={handleStartJourney}
                data-testid="button-start-journey"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: 'hsl(45 100% 51%)', 
                  color: 'hsl(0 0% 0%)',
                  border: 'none'
                }}
              >
                Schedule your class
              </Button>
              <Button 
                onClick={handleWatchDemo}
                data-testid="button-watch-demo"
                size="lg"
                className="rounded-full px-8 py-6 text-base font-semibold border-2 border-white/60 bg-transparent hover:bg-white/10 text-white transition-all duration-300"
              >
                Learn more
              </Button>
            </div>
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
