import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Headphones, BookOpen, Hand } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import IndustryExpertsSection from "./IndustryExpertsSection";
import CommunitySection from "./CommunitySection";
import expertLedImage from "@/assets/feature-expert-led.jpg";
import handsOnImage from "@/assets/feature-hands-on.jpg";
import communityImage from "@/assets/feature-community.jpg";
import careerImage from "@/assets/feature-career.jpg";
import flexibleImage from "@/assets/feature-flexible.jpg";
import certifiedImage from "@/assets/feature-certified.jpg";

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
    <section id="about" className="py-24 lg:py-32 bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Hero Header with Ghost Text */}
        <div className="relative mb-20 lg:mb-24">
          {/* Ghost Text Background */}
          <div className="absolute left-0 top-0 opacity-[0.03] dark:opacity-[0.02] select-none pointer-events-none overflow-hidden">
            <h2 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black leading-none whitespace-nowrap">
              WHY CHOOSE
            </h2>
          </div>
          
          {/* Main Content */}
          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-16 items-center pt-8 lg:pt-12">
            {/* Left: Headline */}
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-black dark:text-white leading-tight mb-4">
                {t('features.title')}
              </h2>
            </div>
            
            {/* Right: Supporting Text */}
            <div>
              <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('features.subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Colorful Card Mosaic */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            // Define vibrant gradient backgrounds for each card
            const gradients = [
              'bg-gradient-to-br from-blue-500 to-blue-600',
              'bg-gradient-to-br from-orange-400 to-orange-500',
              'bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700',
              'bg-gradient-to-br from-yellow-400 to-yellow-500',
              'bg-gradient-to-br from-green-500 to-green-600',
              'bg-gradient-to-br from-purple-500 to-purple-600'
            ];
            
            return (
              <div
                key={index}
                className={`
                  group relative rounded-3xl lg:rounded-[2rem] p-8 lg:p-10
                  shadow-lg hover:shadow-2xl
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:scale-[1.02]
                  animate-scale-in overflow-hidden
                  ${gradients[index]}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`feature-card-${index}`}
              >
                {/* Card Image */}
                <div className="w-full h-48 lg:h-52 mb-6 overflow-hidden rounded-2xl">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                {/* Card Content */}
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-base lg:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {feature.description}
                  </p>
                </div>
                
                {/* Subtle decorative element */}
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-neutral-200/50 dark:bg-neutral-700/50 blur-3xl transition-all duration-300 group-hover:scale-150" />
              </div>
            );
          })}
        </div>
      </div>
    </section>

    <IndustryExpertsSection />

    <CommunitySection />

    <section className="py-16 lg:py-24 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {/* Built for Every Learner Section */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            Built for Every Learner
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto mb-6">
            We know every learner is different — that's why The Ready Lab supports multiple learning styles to help you absorb, retain, and apply knowledge in real life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
          {learningStyles.map((style, index) => (
            <Card 
              key={index} 
              className="group transition-all duration-200 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4 transition-all duration-200">
                  <style.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg flex items-center gap-2">
                  ✔️ {style.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{style.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            This isn't passive learning — it's learning that sticks.
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default Features;