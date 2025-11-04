import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, Clock, Users, Star, ArrowRight, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import instructorFunding from "@/assets/instructor-funding.jpg";
import instructorOperations from "@/assets/instructor-operations.jpg";
import instructorBranding from "@/assets/instructor-branding.jpg";

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
    category: "Funding Strategy",
    certification: true,
    featured: true,
    instructorImage: instructorFunding,
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
    category: "Operations",
    certification: true,
    featured: false,
    instructorImage: instructorOperations,
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
    category: "Brand Strategy",
    certification: true,
    featured: false,
    instructorImage: instructorBranding,
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
    category: "Technology",
    certification: true,
    featured: false
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
    category: "Partnership Strategy",
    certification: true,
    featured: true
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
    category: "Financial Planning",
    certification: true,
    featured: false
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
    <section id="courses" className="py-20 lg:py-32 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <TrendingUp className="h-4 w-4" />
            {t('courses.certificationTracks')}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-black dark:text-white">
            {t('courses.title')}
          </h2>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
            {t('courses.subtitle')}
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="bg-white dark:bg-neutral-800 rounded-[3rem] p-6 lg:p-10 shadow-lg mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Course 1 - Large Featured Card with Gradient */}
            <div 
              className="lg:col-span-1 lg:row-span-2 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[400px]"
              onClick={() => navigate(`/courses/${courses[0].id}`)}
              data-testid="course-card-1"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge className={`${getLevelColor(courses[0].level)} border-0`}>
                    {courses[0].level}
                  </Badge>
                  {courses[0].certification && (
                    <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                  {courses[0].featured && (
                    <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-black/70 dark:text-white/80 mb-2 uppercase tracking-wide">
                  {courses[0].category}
                </p>
                <h3 className="text-2xl lg:text-3xl font-black text-black dark:text-white mb-3">
                  {courses[0].title}
                </h3>
                <p className="text-base text-black/80 dark:text-white/90 mb-6">
                  {courses[0].description}
                </p>
              </div>
              <div>
                {courses[0].instructorImage && (
                  <div className="flex items-center gap-3 mb-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-3">
                    <img 
                      src={courses[0].instructorImage} 
                      alt={`Instructor ${courses[0].instructorName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-medium text-black/70 dark:text-white/80">Instructor</p>
                      <p className="text-sm font-semibold text-black dark:text-white">{courses[0].instructorName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-black/80 dark:text-white/90 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {courses[0].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {courses[0].students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-black dark:fill-white" />
                    {courses[0].rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-3xl font-black text-black dark:text-white">
                    <DollarSign className="h-6 w-6" />
                    {courses[0].price.replace('$', '')}
                  </div>
                  <Button 
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 rounded-full"
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${courses[0].id}`); }}
                    data-testid="button-view-course-1"
                  >
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course 2 - Medium Card with Image */}
            <div 
              className="bg-white dark:bg-neutral-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer min-h-[280px] flex flex-col"
              onClick={() => navigate(`/courses/${courses[1].id}`)}
              data-testid="course-card-2"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={courses[1].instructorImage} 
                  alt={courses[1].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 dark:bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                  <DollarSign className="h-4 w-4" />
                  {courses[1].price.replace('$', '')}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge className={`${getLevelColor(courses[1].level)} border-0 text-xs`}>
                    {courses[1].level}
                  </Badge>
                  {courses[1].certification && (
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wide">
                  {courses[1].category}
                </p>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {courses[1].title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 flex-grow">
                  {courses[1].description}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {courses[1].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {courses[1].students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {courses[1].rating}
                  </div>
                </div>
              </div>
            </div>

            {/* Course 3 - Medium Card with Image */}
            <div 
              className="bg-white dark:bg-neutral-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer min-h-[280px] flex flex-col"
              onClick={() => navigate(`/courses/${courses[2].id}`)}
              data-testid="course-card-3"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={courses[2].instructorImage} 
                  alt={courses[2].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 dark:bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                  <DollarSign className="h-4 w-4" />
                  {courses[2].price.replace('$', '')}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge className={`${getLevelColor(courses[2].level)} border-0 text-xs`}>
                    {courses[2].level}
                  </Badge>
                  {courses[2].certification && (
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1 uppercase tracking-wide">
                  {courses[2].category}
                </p>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                  {courses[2].title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3 flex-grow">
                  {courses[2].description}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {courses[2].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {courses[2].students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {courses[2].rating}
                  </div>
                </div>
              </div>
            </div>

            {/* Course 4 - Gradient Stat Card */}
            <div 
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[280px]"
              onClick={() => navigate(`/courses/${courses[3].id}`)}
              data-testid="course-card-4"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                    {courses[3].level}
                  </Badge>
                  {courses[3].certification && (
                    <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
                  {courses[3].category}
                </p>
                <h3 className="text-2xl font-black text-white mb-3">
                  {courses[3].title}
                </h3>
                <p className="text-base text-white/90 mb-4">
                  {courses[3].description}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-white/90 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {courses[3].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {courses[3].students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-white" />
                    {courses[3].rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-3xl font-black text-white">
                    <DollarSign className="h-6 w-6" />
                    {courses[3].price.replace('$', '')}
                  </div>
                  <Button 
                    className="bg-white text-blue-600 hover:bg-white/90 rounded-full"
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${courses[3].id}`); }}
                    data-testid="button-view-course-4"
                  >
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course 5 - Large Featured Card with Purple Gradient */}
            <div 
              className="lg:col-span-1 lg:row-span-1 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[280px]"
              onClick={() => navigate(`/courses/${courses[4].id}`)}
              data-testid="course-card-5"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                    {courses[4].level}
                  </Badge>
                  {courses[4].certification && (
                    <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                  {courses[4].featured && (
                    <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
                  {courses[4].category}
                </p>
                <h3 className="text-2xl font-black text-white mb-3">
                  {courses[4].title}
                </h3>
                <p className="text-base text-white/90 mb-4">
                  {courses[4].description}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-white/90 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {courses[4].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {courses[4].students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-white" />
                    {courses[4].rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-3xl font-black text-white">
                    <DollarSign className="h-6 w-6" />
                    {courses[4].price.replace('$', '')}
                  </div>
                  <Button 
                    className="bg-white text-purple-600 hover:bg-white/90 rounded-full"
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${courses[4].id}`); }}
                    data-testid="button-view-course-5"
                  >
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Course 6 - Orange Gradient Card */}
            <div 
              className="bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between min-h-[280px]"
              onClick={() => navigate(`/courses/${courses[5].id}`)}
              data-testid="course-card-6"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-4">
                  <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                    {courses[5].level}
                  </Badge>
                  {courses[5].certification && (
                    <Badge className="bg-white/90 dark:bg-black/50 text-black dark:text-white border-0 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-black/70 dark:text-white/80 mb-2 uppercase tracking-wide">
                  {courses[5].category}
                </p>
                <h3 className="text-2xl font-black text-black dark:text-white mb-3">
                  {courses[5].title}
                </h3>
                <p className="text-base text-black/80 dark:text-white/90 mb-4">
                  {courses[5].description}
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm text-black/80 dark:text-white/90 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {courses[5].duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {courses[5].students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-black dark:fill-white" />
                    {courses[5].rating}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-3xl font-black text-black dark:text-white">
                    <DollarSign className="h-6 w-6" />
                    {courses[5].price.replace('$', '')}
                  </div>
                  <Button 
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 rounded-full"
                    onClick={(e) => { e.stopPropagation(); navigate(`/courses/${courses[5].id}`); }}
                    data-testid="button-view-course-6"
                  >
                    View Course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-3xl p-8 shadow-xl text-center">
          <Button 
            size="lg" 
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/80 dark:hover:bg-white/90 text-lg px-8 py-6 rounded-full font-bold"
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
