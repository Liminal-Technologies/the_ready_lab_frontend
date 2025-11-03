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
    <section id="about" className="py-16 lg:py-24 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {/* Why Choose The Ready Lab Section */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            {t('features.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group transition-all duration-200 animate-scale-in overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
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