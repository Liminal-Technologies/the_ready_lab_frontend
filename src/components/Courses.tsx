import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import instructorFunding from "@/assets/instructor-funding.jpg";
import instructorOperations from "@/assets/instructor-operations.jpg";
import instructorBranding from "@/assets/instructor-branding.jpg";

const courses = [
  {
    title: "Funding Readiness 101",
    description: "Master grants, sponsorships, and investor pitches. Build the foundation for sustainable funding.",
    duration: "8 weeks",
    students: "3,200",
    rating: "4.9",
    level: "Beginner",
    price: "$299",
    category: "Funding Strategy",
    certification: true,
    featured: true,
    instructorImage: instructorFunding,
    instructorName: "Dr. Michael Chen"
  },
  {
    title: "Business Infrastructure Mastery",
    description: "Set up compliance, budgets, and operational systems that funders demand to see.",
    duration: "6 weeks",
    students: "2,800",
    rating: "4.8",
    level: "Beginner",
    price: "$249",
    category: "Operations",
    certification: true,
    featured: false,
    instructorImage: instructorOperations,
    instructorName: "Sarah Rodriguez"
  },
  {
    title: "Branding for Growth & Fundability",
    description: "Develop clear messaging and positioning that attracts investors and customers alike.",
    duration: "4 weeks",
    students: "2,100",
    rating: "4.9",
    level: "Intermediate",
    price: "$199",
    category: "Brand Strategy",
    certification: true,
    featured: false,
    instructorImage: instructorBranding,
    instructorName: "Alex Thompson"
  },
  {
    title: "AI for Entrepreneurs",
    description: "Streamline operations and scale efficiently using artificial intelligence tools and strategies.",
    duration: "5 weeks",
    students: "1,900",
    rating: "4.7",
    level: "Intermediate",
    price: "$229",
    category: "Technology",
    certification: true,
    featured: false
  },
  {
    title: "Donor Engagement & Strategic Partnerships",
    description: "Build lasting relationships with donors, sponsors, and strategic partners for sustainable growth.",
    duration: "6 weeks",
    students: "1,600",
    rating: "4.8",
    level: "Advanced",
    price: "$279",
    category: "Partnership Strategy",
    certification: true,
    featured: true
  },
  {
    title: "Financial Fluency for Founders",
    description: "Master budgeting, financial planning, and reporting that builds credibility with funders.",
    duration: "4 weeks",
    students: "1,400",
    rating: "4.7",
    level: "Intermediate",
    price: "$179",
    category: "Financial Planning",
    certification: true,
    featured: false
  }
];

const Courses = () => {
  const { t } = useLanguage();

  return (
    <section id="courses" className="py-16 lg:py-24 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-4 py-2 rounded-lg text-sm font-medium mb-4">
            <TrendingUp className="h-4 w-4" />
            {t('courses.certificationTracks')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            {t('courses.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CourseCard {...course} />
            </div>
          ))}
        </div>
        
        <div className="text-center space-y-4">
          <Button size="lg">
            <Award className="h-5 w-5 mr-2" />
            {t('courses.startCertification')}
          </Button>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t('courses.paymentPlans')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Courses;