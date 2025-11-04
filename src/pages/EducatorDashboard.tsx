import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Users, 
  BookOpen, 
  Star,
  DollarSign,
  TrendingUp,
  MessageCircle,
  Calendar,
  AlertCircle,
  Video
} from 'lucide-react';
import { PlanSelectionModal } from '@/components/educator/PlanSelectionModal';
import { CourseBuilderWizard } from '@/components/educator/CourseBuilderWizard';
import { ScheduleLiveEventModal } from '@/components/educator/ScheduleLiveEventModal';

// Mock student data
const MOCK_STUDENTS = [
  { id: 1, name: "Sarah Johnson", avatar: "", course: "Funding Essentials", progress: 85, lastActive: "2 hours ago", atRisk: false },
  { id: 2, name: "Michael Chen", avatar: "", course: "Legal Framework", progress: 92, lastActive: "1 day ago", atRisk: false },
  { id: 3, name: "Emma Davis", avatar: "", course: "Funding Essentials", progress: 28, lastActive: "7 days ago", atRisk: true },
  { id: 4, name: "James Wilson", avatar: "", course: "Marketing Basics", progress: 67, lastActive: "3 hours ago", atRisk: false },
  { id: 5, name: "Lisa Anderson", avatar: "", course: "Legal Framework", progress: 15, lastActive: "10 days ago", atRisk: true },
  { id: 6, name: "David Martinez", avatar: "", course: "Funding Essentials", progress: 73, lastActive: "1 hour ago", atRisk: false },
  { id: 7, name: "Jennifer Taylor", avatar: "", course: "Marketing Basics", progress: 41, lastActive: "4 days ago", atRisk: false },
  { id: 8, name: "Robert Brown", avatar: "", course: "Funding Essentials", progress: 89, lastActive: "30 min ago", atRisk: false },
];

const MOCK_QUESTIONS = [
  { id: 1, student: "Sarah J.", question: "Can you explain the difference between equity and debt financing?", course: "Funding Essentials", time: "2 hours ago" },
  { id: 2, student: "Michael C.", question: "What are the tax implications of forming an LLC?", course: "Legal Framework", time: "5 hours ago" },
  { id: 3, student: "David M.", question: "How do I calculate my burn rate?", course: "Funding Essentials", time: "1 day ago" },
];

export const EducatorDashboard = () => {
  const navigate = useNavigate();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [showScheduleEvent, setShowScheduleEvent] = useState(false);
  const [educatorProfile, setEducatorProfile] = useState<any>(null);
  const [createdCourses, setCreatedCourses] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  useEffect(() => {
    // Load educator profile and plan from localStorage
    const profile = localStorage.getItem('educatorProfile');
    const plan = localStorage.getItem('selectedPlan');
    const courses = localStorage.getItem('createdCourses');
    
    if (profile) {
      setEducatorProfile(JSON.parse(profile));
    }
    if (plan) {
      setSelectedPlan(plan);
    }
    if (courses) {
      setCreatedCourses(JSON.parse(courses));
    }

    // Check if user needs to select a plan (first time)
    if (!plan && !showPlanModal) {
      setTimeout(() => setShowPlanModal(true), 500);
    }
  }, []);

  const handlePlanSelected = (plan: string) => {
    setSelectedPlan(plan);
    localStorage.setItem('selectedPlan', plan);
    
    // If no profile yet, go to onboarding
    if (!educatorProfile) {
      navigate('/educator/onboarding');
    }
  };

  const handleCourseCreated = () => {
    // Refresh created courses from localStorage
    const courses = localStorage.getItem('createdCourses');
    if (courses) {
      setCreatedCourses(JSON.parse(courses));
    }
  };

  // Calculate onboarding checklist
  const hasProfile = !!educatorProfile;
  const hasFirstCourse = createdCourses.length > 0;
  const hasUploadedLesson = createdCourses.some((c: any) => c.lessons && c.lessons.length > 0);
  const hasSubmittedCourse = createdCourses.some((c: any) => c.status === 'pending' || c.status === 'approved');

  const checklistItems = [
    { label: "Create profile", completed: hasProfile },
    { label: "Create first course", completed: hasFirstCourse },
    { label: "Upload first lesson", completed: hasUploadedLesson },
    { label: "Submit for review", completed: hasSubmittedCourse },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Welcome Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {educatorProfile ? `Welcome back, ${educatorProfile.name.split(' ')[0]}!` : 'Educator Dashboard'}
              </h1>
              <p className="text-muted-foreground">
                Manage your courses, track student progress, and grow your teaching business
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowScheduleEvent(true)}
                data-testid="button-schedule-event"
              >
                <Video className="mr-2 h-4 w-4" />
                Schedule Live Event
              </Button>
              <Button
                onClick={() => setShowCourseWizard(true)}
                data-testid="button-create-course"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Course
              </Button>
            </div>
          </div>

          {/* Onboarding Checklist (if not complete) */}
          {progressPercentage < 100 && (
            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Get Started as an Educator
                </CardTitle>
                <CardDescription>
                  Complete these steps to start teaching ({completedCount}/{checklistItems.length} completed)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercentage} className="h-2" />
                <div className="grid md:grid-cols-4 gap-3">
                  {checklistItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        item.completed ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' : 'bg-background'
                      }`}
                      data-testid={`checklist-item-${index}`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className={`text-sm ${item.completed ? 'font-medium' : ''}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Students Enrolled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">156</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Lessons Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,341</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ⭐⭐⭐⭐⭐ (89 reviews)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Revenue This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$3,847</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-600" />
                  +24% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Students Table */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Monitor your students' learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENTS.map((student) => (
                      <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={student.progress} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">{student.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{student.lastActive}</TableCell>
                        <TableCell>
                          {student.atRisk ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              At Risk
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Active</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Latest Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Latest Questions
                </CardTitle>
                <CardDescription>Recent questions from your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_QUESTIONS.map((q) => (
                  <div key={q.id} className="border-b pb-4 last:border-0 last:pb-0" data-testid={`question-${q.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium text-sm">{q.student}</div>
                      <div className="text-xs text-muted-foreground">{q.time}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{q.question}</p>
                    <Badge variant="outline" className="text-xs">{q.course}</Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" data-testid="button-view-all-questions">
                  View All Questions
                </Button>
              </CardContent>
            </Card>

            {/* Revenue Chart (Static placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Simple CSS-based bar chart */}
                <div className="space-y-3">
                  {[
                    { month: 'Sep', amount: 2100, height: 40 },
                    { month: 'Oct', amount: 2650, height: 55 },
                    { month: 'Nov', amount: 2890, height: 62 },
                    { month: 'Dec', amount: 3200, height: 75 },
                    { month: 'Jan', amount: 3100, height: 70 },
                    { month: 'Feb', amount: 3847, height: 100 },
                  ].map((data, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 text-sm text-muted-foreground">{data.month}</div>
                      <div className="flex-1">
                        <div
                          className="bg-primary rounded h-8 transition-all flex items-center px-3 text-primary-foreground text-sm font-medium"
                          style={{ width: `${data.height}%` }}
                        >
                          ${data.amount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PlanSelectionModal
        open={showPlanModal}
        onOpenChange={setShowPlanModal}
        onPlanSelected={handlePlanSelected}
      />
      <CourseBuilderWizard
        open={showCourseWizard}
        onOpenChange={setShowCourseWizard}
        onCourseCreated={handleCourseCreated}
      />
      <ScheduleLiveEventModal
        open={showScheduleEvent}
        onOpenChange={setShowScheduleEvent}
      />
    </>
  );
};