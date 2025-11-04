import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Headphones, BookOpen, Hand, MessageCircle, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import IndustryExpertsSection from "./IndustryExpertsSection";
import CommunitySection from "./CommunitySection";
import expertLedImage from "@/assets/feature-expert-led.jpg";
import handsOnImage from "@/assets/feature-hands-on.jpg";
import communityImage from "@/assets/feature-community.jpg";
import careerImage from "@/assets/feature-career.jpg";
import flexibleImage from "@/assets/feature-flexible.jpg";
import certifiedImage from "@/assets/feature-certified.jpg";

// Ecudum-style Features Section redesigned
const Features = () => {
  const { t } = useLanguage();

  const learningStyles = [
    {
      icon: Eye,
      title: "Visual learners",
      description: "Video tutorials, diagrams, and on-screen examples"
    },
    {
      icon: Headphones,
      title: "Auditory learners", 
      description: "Voice-led lessons, expert interviews, and Q&A"
    },
    {
      icon: BookOpen,
      title: "Reading/Writing learners",
      description: "Downloadable guides, toolkits, and checklists"
    },
    {
      icon: Hand,
      title: "Kinesthetic learners",
      description: "Hands-on activities, templates, and interactive labs"
    }
  ];

  const features = [
    {
      image: expertLedImage,
      title: t('features.expertLed'),
      description: t('features.expertLedDesc')
    },
    {
      image: handsOnImage,
      title: t('features.handsOn'),
      description: t('features.handsOnDesc')
    },
    {
      image: communityImage,
      title: t('features.community'),
      description: t('features.communityDesc')
    },
    {
      image: careerImage,
      title: t('features.career'),
      description: t('features.careerDesc')
    },
    {
      image: flexibleImage,
      title: t('features.flexible'),
      description: t('features.flexibleDesc')
    },
    {
      image: certifiedImage,
      title: t('features.certified'),
      description: t('features.certifiedDesc')
    }
  ];

  return (
    <>
    {/* Programs & Features Section - Ecudum style with light green background */}
    <section 
      id="about" 
      className="py-20 lg:py-32 dark:bg-green-900/20 transition-colors duration-200"
      style={{ backgroundColor: 'hsl(142 76% 92%)' }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header with ghost text */}
        <div className="mb-16">
          <div className="relative">
            {/* Ghost text behind */}
            <h2 
              className="absolute -top-6 left-0 text-7xl md:text-8xl lg:text-9xl font-bold leading-none select-none pointer-events-none"
              style={{ color: 'hsl(142 30% 94%)', opacity: 0.4 }}
              aria-hidden="true"
            >
              Education
            </h2>
            
            {/* Small accent tag */}
            <div className="mb-4">
              <span 
                className="inline-block text-sm font-medium px-4 py-2 rounded-full"
                style={{ 
                  backgroundColor: 'hsl(142 50% 45%)',
                  color: 'white'
                }}
              >
                Learning Programs
              </span>
            </div>

            {/* Main headline */}
            <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black dark:text-white max-w-4xl">
              Expand beyond{" "}
              <span style={{ color: 'hsl(142 50% 45%)' }}>
                traditional education.
              </span>
            </h2>
          </div>
        </div>

        {/* Feature cards grid - Ecudum style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 - Comment and Activity */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-4">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'hsl(142 50% 45%)' }}>
                Comment and activity
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-3">
              Give and receive actionable feedback
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Draw innovations and leave comments to collaborate with peers and instructors in real-time.
            </p>
            {features[1]?.image && (
              <div className="rounded-2xl overflow-hidden mt-4">
                <img 
                  src={features[1].image} 
                  alt="Collaborative feedback"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
          </div>

          {/* Card 2 - Schedule and Learn */}
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="mb-4">
              <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'hsl(142 50% 45%)' }}>
                Comment and activity
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-3">
              Schedule and learn on your own time
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Flexible learning for your busy schedule. Take control of your education, anytime, anywhere.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {features[3]?.image && (
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src={features[3].image} 
                    alt="Flexible learning"
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
              {features[4]?.image && (
                <div className="rounded-xl overflow-hidden bg-black text-white flex items-center justify-center p-3 text-xs font-medium">
                  Self-paced courses
                </div>
              )}
            </div>
          </div>

          {/* Card 3 - Knowledge Retention */}
          <div 
            className="rounded-3xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-300"
            style={{ backgroundColor: 'hsl(142 50% 45%)' }}
          >
            <div className="mb-4">
              <span className="text-xs font-medium uppercase tracking-wide opacity-90">
                Proven Results
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              The Ready Lab knows what and how each student is learning
            </h3>
            <p className="opacity-90 text-sm">
              Surfacing the right content at the right time to ensure the knowledge sticks fast and the curiosity keeps growing.
            </p>
          </div>
        </div>

        {/* Additional features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
          {features.slice(0, 3).map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <IndustryExpertsSection />

    <CommunitySection />

    {/* Learning Styles Section - Clean white background */}
    <section className="py-16 lg:py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-700 transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
            Built for Every Learner
          </h2>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            We know every learner is different — that's why The Ready Lab supports multiple learning styles.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {learningStyles.map((style, index) => (
            <div 
              key={index}
              className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6 hover:shadow-md transition-all duration-300"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'hsl(45 100% 51%)' }}
              >
                <style.icon className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-lg font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                ✔️ {style.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                {style.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Features;
