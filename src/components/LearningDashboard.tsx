import ProgressTracker from "@/components/ProgressTracker";
import CertificationBadge from "@/components/CertificationBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Award, TrendingUp, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const mockLearningPaths = [
  {
    id: "funding-101",
    title: "Funding Readiness 101",
    description: "Master grants, sponsorships, and investor pitches for sustainable funding",
    totalLessons: 24,
    completedLessons: 18,
    estimatedTime: "8 weeks",
    category: "Funding Strategy",
    nextLesson: "Creating Your Investor Deck",
    certification: true
  },
  {
    id: "business-infrastructure",
    title: "Business Infrastructure Mastery",
    description: "Set up compliance, budgets, and operational systems funders demand",
    totalLessons: 20,
    completedLessons: 20,
    estimatedTime: "6 weeks",
    category: "Operations",
    certification: true
  },
  {
    id: "branding-growth",
    title: "Branding for Growth & Fundability",
    description: "Develop clear messaging that attracts investors and customers",
    totalLessons: 16,
    completedLessons: 8,
    estimatedTime: "4 weeks",
    category: "Brand Strategy",
    nextLesson: "Value Proposition Canvas",
    certification: true
  },
  {
    id: "ai-entrepreneurs",
    title: "AI for Entrepreneurs",
    description: "Streamline operations and scale efficiently using AI tools",
    totalLessons: 18,
    completedLessons: 3,
    estimatedTime: "5 weeks",
    category: "Technology",
    nextLesson: "ChatGPT for Business Plans",
    certification: true
  }
];

const mockCertifications = [
  {
    title: "Business Infrastructure Certified",
    issuer: "The Ready Lab",
    dateEarned: "Dec 15, 2023",
    status: "earned" as const,
    credentialId: "TRL-BI-2023-1247",
    description: "Mastered compliance, budgets, and operational systems"
  },
  {
    title: "Funding Readiness Specialist",
    issuer: "The Ready Lab",
    progress: 75,
    status: "in-progress" as const,
    description: "Grant writing, investor pitches, and sponsorship strategies"
  },
  {
    title: "Branding for Growth Certified",
    issuer: "The Ready Lab",
    progress: 50,
    status: "in-progress" as const,
    description: "Messaging, positioning, and fundable brand development"
  },
  {
    title: "AI for Entrepreneurs",
    issuer: "The Ready Lab",
    status: "available" as const,
    description: "ChatGPT, automation tools, and AI-powered scaling"
  }
];

const LearningDashboard = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-neutral-50 dark:bg-neutral-800 border-t border-neutral-100 dark:border-neutral-700 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-lg text-sm font-medium mb-4">
            <Target className="h-4 w-4" />
            {t('dashboard.yourProgress')}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-6">
            {t('dashboard.title')}
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('dashboard.progress')}
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {t('dashboard.certifications')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress">
            <ProgressTracker 
              learningPaths={mockLearningPaths}
              totalProgress={65}
              weeklyGoal={5}
              currentStreak={12}
            />
          </TabsContent>

          <TabsContent value="certifications">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {mockCertifications.map((cert, index) => (
                  <CertificationBadge key={index} {...cert} />
                ))}
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('dashboard.certificationBenefits')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-4 bg-success/5 rounded-lg">
                      <div className="font-semibold text-success mb-2">{t('dashboard.credibilityBoost')}</div>
                      <p className="text-muted-foreground">{t('dashboard.credibilityDesc')}</p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="font-semibold text-primary mb-2">{t('dashboard.portfolioReady')}</div>
                      <p className="text-muted-foreground">{t('dashboard.portfolioDesc')}</p>
                    </div>
                    <div className="text-center p-4 bg-accent/5 rounded-lg">
                      <div className="font-semibold text-accent mb-2">{t('dashboard.readyLabNetwork')}</div>
                      <p className="text-muted-foreground">{t('dashboard.networkDesc')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Button size="lg">
            <BookOpen className="h-5 w-5 mr-2" />
            {t('dashboard.continueLearning')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LearningDashboard;