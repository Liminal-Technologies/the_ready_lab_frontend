import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import expertLedImage from "@/assets/feature-expert-led.jpg";
import handsOnImage from "@/assets/feature-hands-on.jpg";
import communityImage from "@/assets/feature-community.jpg";
import careerImage from "@/assets/feature-career.jpg";
import flexibleImage from "@/assets/feature-flexible.jpg";
import certifiedImage from "@/assets/feature-certified.jpg";
import educatorImage from "@/assets/educator-1.jpg";
import studentsImage from "@/assets/students-collaboration.jpg";
import visualLearningImage from "@/assets/stock_images/person_watching_educ_8ccc0366.jpg";
import auditoryLearningImage from "@/assets/stock_images/person_listening_wit_7333fc60.jpg";
import readingLearningImage from "@/assets/stock_images/person_reading_book__3e4c75c3.jpg";
import kinestheticLearningImage from "@/assets/stock_images/hands_on_learning_ac_8ca82f64.jpg";

const Features = () => {
  const { t } = useLanguage();

  const learningStyles = [
    {
      image: visualLearningImage,
      title: "Visual learners",
      description: "Video tutorials, diagrams, and on-screen examples"
    },
    {
      image: auditoryLearningImage,
      title: "Auditory learners", 
      description: "Voice-led lessons, expert interviews, and Q&A"
    },
    {
      image: readingLearningImage,
      title: "Reading/Writing learners",
      description: "Downloadable guides, toolkits, and checklists"
    },
    {
      image: kinestheticLearningImage,
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
    <section id="about" className="py-24 lg:py-32 bg-white dark:bg-neutral-900 transition-colors duration-200 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Hero Header */}
        <div className="relative mb-20 lg:mb-24">
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Headline */}
            <div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-4">
                <span className="text-black dark:text-white">Why Choose The </span>
                <span style={{ color: '#FDB022' }}>Ready Lab</span>
                <span className="text-black dark:text-white">?</span>
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
        
        {/* Colorful Card Mosaic with Soft Yellow Background */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded-[3rem] p-8 lg:p-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="
                  group relative rounded-3xl lg:rounded-[2rem] p-8 lg:p-10
                  shadow-lg hover:shadow-2xl
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:scale-[1.02]
                  animate-scale-in overflow-hidden
                  bg-white dark:bg-neutral-800
                "
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
      </div>
    </section>

    {/* Unified Learning Section - Modern Green Theme */}
    <section className="py-20 lg:py-32 bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          {/* Small Green Label */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
              Learning styles
            </span>
          </div>
          
          {/* Large Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            <span className="text-black dark:text-white">Built for Every</span>
            <br />
            <span className="text-green-600 dark:text-green-500">Learner</span>
          </h2>
          
          {/* Supporting Text */}
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl">
            We know every learner is different — that's why The Ready Lab supports multiple learning styles to help you absorb, retain, and apply knowledge in real life.
          </p>
        </div>
        
        {/* Large Rounded Light Green Panel */}
        <div className="bg-green-50 dark:bg-green-950/20 rounded-[3rem] p-8 lg:p-12 mb-8">
          {/* First Row: Industry Experts & Community Cards */}
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Learn from Industry Experts Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-industry-experts">
              <div className="mb-6">
                <img 
                  src={educatorImage} 
                  alt="Professional educator teaching workshop" 
                  className="w-full h-56 object-cover rounded-2xl"
                />
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold mb-3">
                  Comment and activity
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                Learn from Industry Experts
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Our instructors are successful entrepreneurs and business experts who've been where you want to go.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  500+ Expert Instructors
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  $2B+ Raised by Alumni
                </div>
              </div>
            </div>

            {/* Join a Community Card */}
            <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid="card-community">
              <div className="mb-6">
                <img 
                  src={studentsImage} 
                  alt="Entrepreneurs collaborating" 
                  className="w-full h-56 object-cover rounded-2xl"
                />
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold mb-3">
                  Comment and activity
                </span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                Join a Community
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Connect with fellow entrepreneurs and changemakers. Share challenges, celebrate wins, and grow together.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Weekly peer collaboration</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Direct mentor access</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Exclusive networking events</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second Row: Learning Style Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningStyles.map((style, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                data-testid={`card-learning-style-${index}`}
              >
                <div className="w-full h-32 overflow-hidden">
                  <img 
                    src={style.image} 
                    alt={style.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                    {style.title}
                  </h4>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {style.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Closing Statement */}
        <div className="text-center mt-8">
          <p className="text-xl font-semibold text-neutral-900 dark:text-white">
            This isn't passive learning — it's learning that sticks.
          </p>
        </div>
      </div>
    </section>
    </>
  );
};

export default Features;