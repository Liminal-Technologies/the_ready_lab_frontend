import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { DemoVideoModal } from "@/components/DemoVideoModal";
import heroImage from "@/assets/hero-entrepreneurs.jpg";

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
      {/* Background Image with Overlay - Full Screen */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Diverse entrepreneurs learning together" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Massive Headline - Bottom Left (Desktop) / Top Center (Mobile) */}
      <div className="absolute bottom-32 md:bottom-40 left-4 md:left-8 lg:left-16 lg:block hidden z-10 max-w-4xl">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
          <span className="text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
            Prepare &{" "}
          </span>
          <br />
          <span style={{ color: '#FDB022', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
            Get Funded
          </span>
        </h1>
      </div>

      {/* Right Floating Content Box - Centered Vertically, Right Aligned */}
      <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-16 lg:right-24 z-20 max-w-sm hidden lg:block">
        <div className="rounded-2xl p-5 text-center">
          <p className="text-white text-sm mb-5 leading-relaxed font-normal" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
            Build the fundable business that funders actually want to back. Real education, real results, real opportunity.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleStartJourney}
              className="w-full rounded-full font-semibold text-base py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#FDB022', color: '#000' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCA311'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FDB022'}
              data-testid="button-start-journey"
            >
              Start Your Journey
            </Button>
            <Button 
              onClick={handleWatchDemo}
              className="w-full rounded-full border-2 bg-transparent hover:bg-white/10 font-semibold text-base py-3 text-white border-white/60"
              data-testid="button-watch-demo"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout - Banner at Top Center, Content Below */}
      <div className="lg:hidden absolute top-20 left-0 right-0 z-10 px-4">
        <div className="container mx-auto max-w-md text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-8">
            <span className="text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              Prepare &{" "}
            </span>
            <br />
            <span style={{ color: '#FDB022', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              Get Funded
            </span>
          </h1>
        </div>
      </div>

      {/* Mobile Content - Below Banner Text */}
      <div className="absolute bottom-16 left-0 right-0 z-20 px-4 lg:hidden">
        <div className="container mx-auto max-w-md text-center">
          <p className="text-white mb-4 leading-relaxed" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.9)' }}>
            Build the fundable business that funders actually want to back. Real education, real results, real opportunity.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleStartJourney}
              size="lg"
              className="w-full rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#FDB022', color: '#000' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCA311'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FDB022'}
              data-testid="button-start-journey-mobile"
            >
              Start Your Journey
            </Button>
            <Button 
              onClick={handleWatchDemo}
              size="lg"
              className="w-full rounded-full border-2 bg-transparent hover:bg-white/10 font-semibold text-white border-white/60"
              data-testid="button-watch-demo-mobile"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2 text-white/80 text-sm animate-bounce">
        <span className="hidden md:inline">Scroll down</span>
        <ChevronDown className="h-5 w-5" />
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