import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Clock, Users, Star, ArrowRight, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import fundingImage from "../../attached_assets/stock_images/business_professiona_9e1fef7d.jpg";
import operationsImage from "../../attached_assets/stock_images/business_operations__a3e6e538.jpg";
import brandingImage from "../../attached_assets/stock_images/branding_marketing_s_50e607b2.jpg";
import aiImage from "../../attached_assets/stock_images/artificial_intellige_80651e44.jpg";
import partnershipImage from "../../attached_assets/stock_images/partnership_handshak_d5c0b270.jpg";
import financialImage from "../../attached_assets/stock_images/financial_planning_a_96357d65.jpg";

const courses = [
  {
    id: "1",
    title: "Funding Readiness 101",
    description: "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
    duration: "8 weeks",
    students: "3,200",
    rating: "4.9",
    level: "Beginner",
    price: "$299",
    category: "FUNDING STRATEGY",
    certification: true,
    featured: true,
    image: fundingImage,
    instructorName: "Dr. Michael Chen"
  },
  {
    id: "2",
    title: "Business Infrastructure Mastery",
    description: "Set up compliance, budgets, and operational systems that funders demand to see.",
    duration: "6 weeks",
    students: "2,800",
    rating: "4.8",
    level: "Beginner",
    price: "$249",
    category: "OPERATIONS",
    certification: true,
    featured: false,
    image: operationsImage,
    instructorName: "Sarah Rodriguez"
  },
  {
    id: "3",
    title: "Branding for Growth & Fundability",
    description: "Develop clear messaging and positioning that attracts investors and customers alike.",
    duration: "4 weeks",
    students: "2,100",
    rating: "4.9",
    level: "Intermediate",
    price: "$199",
    category: "BRAND STRATEGY",
    certification: true,
    featured: false,
    image: brandingImage,
    instructorName: "Alex Thompson"
  },
  {
    id: "4",
    title: "AI for Entrepreneurs",
    description: "Streamline operations and scale efficiently using artificial intelligence tools and strategies.",
    duration: "5 weeks",
    students: "1,900",
    rating: "4.7",
    level: "Intermediate",
    price: "$229",
    category: "TECHNOLOGY",
    certification: true,
    featured: false,
    image: aiImage
  },
  {
    id: "5",
    title: "Donor Engagement & Strategic Partnerships",
    description: "Build lasting relationships with donors, sponsors, and strategic partners for sustainable growth.",
    duration: "6 weeks",
    students: "1,600",
    rating: "4.8",
    level: "Advanced",
    price: "$279",
    category: "PARTNERSHIP STRATEGY",
    certification: true,
    featured: true,
    image: partnershipImage
  },
  {
    id: "6",
    title: "Financial Fluency for Founders",
    description: "Master budgeting, financial planning, and reporting that builds credibility with funders.",
    duration: "4 weeks",
    students: "1,400",
    rating: "4.7",
    level: "Intermediate",
    price: "$179",
    category: "FINANCIAL PLANNING",
    certification: true,
    featured: false,
    image: financialImage
  }
];

const Courses = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'Intermediate': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'Advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
    }
  };

  return (
    <section 
      id="courses" 
      className="py-20 lg:py-32 bg-white dark:bg-neutral-900 transition-colors duration-200"
    >
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="h-4 w-4" />
            {t('courses.certificationTracks')}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="text-black dark:text-white">Get Fundable & </span>
            <span className="text-[#D97706] dark:text-orange-500">Certified</span>
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Course Cards with Soft Background Panel */}
        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-[3rem] p-8 lg:p-12 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
              onClick={() => navigate(`/courses/${course.id}`)}
              data-testid={`course-card-${course.id}`}
            >
              {/* Image Section */}
              <div className="relative h-52 overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-400 dark:bg-yellow-500 text-black px-3 py-1.5 rounded-full font-bold text-lg shadow-lg">
                  <DollarSign className="h-5 w-5" />
                  {course.price.replace('$', '')}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge className={`${getLevelColor(course.level)} border-0 text-xs font-semibold px-3 py-1`}>
                    {course.level}
                  </Badge>
                  {course.certification && (
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0 text-xs font-semibold px-3 py-1">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                  {course.featured && (
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-0 text-xs font-semibold px-3 py-1">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Category */}
                <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                  {course.category}
                </p>

                {/* Title */}
                <h3 className="text-xl lg:text-2xl font-bold text-black dark:text-white mb-3 leading-tight">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-300 mb-4 flex-grow leading-relaxed">
                  {course.description}
                </p>

                {/* Instructor (if available) */}
                {course.instructorName && (
                  <div className="mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Instructor</p>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {course.instructorName}
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Button */}
                <Button
                  className={`w-full rounded-full font-semibold ${
                    course.featured
                      ? 'bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90'
                      : 'bg-white dark:bg-neutral-700 text-black dark:text-white border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/courses/${course.id}`);
                  }}
                  data-testid={`button-view-course-${course.id}`}
                >
                  View Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-3xl p-8 shadow-xl text-center">
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full font-bold"
            style={{ backgroundColor: '#FDB022', color: '#000' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FCA311'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FDB022'}
            data-testid="button-start-certification"
          >
            <Award className="h-6 w-6 mr-2" />
            {t('courses.startCertification')}
          </Button>
          <p className="text-sm text-black/70 dark:text-white/80 mt-4 font-medium">
            {t('courses.paymentPlans')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Courses;
