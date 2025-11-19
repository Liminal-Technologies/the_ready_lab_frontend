import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { SuggestedActions, SuggestedAction } from '@/components/dashboard/SuggestedActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  Video,
  ChevronRight,
  BarChart3,
  Settings,
  Eye,
  Edit,
  CreditCard,
  ShoppingCart,
  MoreVertical,
  Trash2,
  Copy,
  Power,
  PowerOff,
  Play
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PlanSelectionModal } from '@/components/educator/PlanSelectionModal';
import { CourseBuilderWizard } from '@/components/educator/CourseBuilderWizard';
import { ScheduleLiveEventModal } from '@/components/educator/ScheduleLiveEventModal';
import { AutoDemoProgress } from '@/components/AutoDemoProgress';
import { 
  getAllEducatorCourses, 
  getEducatorStats, 
  deleteEducatorCourse,
  duplicateEducatorCourse,
  toggleCoursePublished,
  type EducatorCourse 
} from '@/utils/educatorCoursesStorage';
import { getAutoDemoOrchestrator } from '@/utils/autoDemoOrchestrator';
import { useToast } from '@/hooks/use-toast';

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

const MOCK_LIVE_EVENTS = [
  { id: 1, title: "Q&A: Funding Your Startup", date: "2024-12-10", time: "2:00 PM EST", attendees: 24, status: "upcoming" },
  { id: 2, title: "Workshop: Building Your Pitch Deck", date: "2024-12-15", time: "4:00 PM EST", attendees: 18, status: "upcoming" },
  { id: 3, title: "Office Hours: Legal Questions", date: "2024-11-28", time: "3:00 PM EST", attendees: 32, status: "past" },
];

// Mock analytics data
const REVENUE_TREND_DATA = [
  { month: 'Jul', revenue: 2100 },
  { month: 'Aug', revenue: 2650 },
  { month: 'Sep', revenue: 2890 },
  { month: 'Oct', revenue: 3200 },
  { month: 'Nov', revenue: 3100 },
  { month: 'Dec', revenue: 3847 },
];

const TOP_COURSES_DATA = [
  { id: 1, name: "Funding Essentials", students: 45, revenue: 4455 },
  { id: 2, name: "Legal Framework", students: 38, revenue: 3762 },
  { id: 3, name: "Marketing Basics", students: 32, revenue: 3168 },
  { id: 4, name: "Operations Guide", students: 28, revenue: 2772 },
  { id: 5, name: "Product Development", students: 13, revenue: 1287 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, student: "Sarah Johnson", course: "Funding Essentials", amount: 99, date: "2 hours ago", status: "completed" },
  { id: 2, student: "Michael Chen", course: "Legal Framework", amount: 99, date: "5 hours ago", status: "completed" },
  { id: 3, student: "Emma Davis", course: "Funding Essentials", amount: 99, date: "1 day ago", status: "completed" },
  { id: 4, student: "David Martinez", course: "Marketing Basics", amount: 99, date: "1 day ago", status: "completed" },
  { id: 5, student: "Lisa Anderson", course: "Operations Guide", amount: 99, date: "2 days ago", status: "completed" },
];

export const EducatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCourseWizard, setShowCourseWizard] = useState(false);
  const [showScheduleEvent, setShowScheduleEvent] = useState(false);
  const [showAutoDemo, setShowAutoDemo] = useState(false);
  const [educatorProfile, setEducatorProfile] = useState<any>(null);
  const [createdCourses, setCreatedCourses] = useState<EducatorCourse[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<EducatorCourse | null>(null);
  const [editingCourse, setEditingCourse] = useState<EducatorCourse | null>(null);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    activeStudents: 0,
    atRiskStudents: 0,
    completedStudents: 0,
  });

  const loadCourses = () => {
    const courses = getAllEducatorCourses();
    const educatorStats = getEducatorStats();
    setCreatedCourses(courses);
    setStats(educatorStats);
  };

  useEffect(() => {
    // Load educator profile and plan from localStorage
    const profile = localStorage.getItem('educatorProfile');
    const plan = localStorage.getItem('selectedPlan');
    
    if (profile) {
      setEducatorProfile(JSON.parse(profile));
    }
    if (plan) {
      setSelectedPlan(plan);
    }

    // Load courses using new storage system
    loadCourses();

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
    // Reload courses using new storage system
    loadCourses();
  };

  const handleDeleteCourse = (course: EducatorCourse) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  const handleStartAutoDemo = async () => {
    setShowAutoDemo(true);
    setShowCourseWizard(true);
    
    // Start the orchestrator
    const orchestrator = getAutoDemoOrchestrator();
    await orchestrator.start();
  };

  const confirmDeleteCourse = () => {
    if (!courseToDelete) return;
    
    try {
      deleteEducatorCourse(courseToDelete.id);
      loadCourses();
      toast({
        title: "Course deleted",
        description: `${courseToDelete.title} has been removed.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting course",
        description: "There was a problem deleting your course. Please try again.",
        variant: "destructive",
      });
    }
    
    setShowDeleteDialog(false);
    setCourseToDelete(null);
  };

  const handleDuplicateCourse = (course: EducatorCourse) => {
    const duplicated = duplicateEducatorCourse(course.id);
    
    if (duplicated) {
      loadCourses();
      toast({
        title: "Course duplicated! 📋",
        description: `Created a copy of "${course.title}"`,
      });
    } else {
      toast({
        title: "Error duplicating course",
        description: "There was a problem duplicating your course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublish = (course: EducatorCourse) => {
    try {
      const newStatus = toggleCoursePublished(course.id);
      loadCourses();
      
      toast({
        title: newStatus ? "Course published! 🎉" : "Course unpublished",
        description: newStatus 
          ? `${course.title} is now visible to students.`
          : `${course.title} has been unpublished.`,
      });
    } catch (error: any) {
      toast({
        title: "Error toggling publish status",
        description: error?.message || "There was a problem updating your course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCourse = (course: EducatorCourse) => {
    setEditingCourse(course);
    setShowCourseWizard(true);
  };

  // Calculate onboarding checklist
  const hasProfile = !!educatorProfile;
  const hasFirstCourse = createdCourses.length > 0;
  const hasUploadedLesson = createdCourses.some((c) => 
    c.modules && Array.isArray(c.modules) && c.modules.some(m => m?.lessons && Array.isArray(m.lessons) && m.lessons.length > 0)
  );
  const hasSubmittedCourse = createdCourses.some((c) => c.published);

  const checklistItems = [
    { label: "Create profile", completed: hasProfile },
    { label: "Create first course", completed: hasFirstCourse },
    { label: "Upload first lesson", completed: hasUploadedLesson },
    { label: "Submit for review", completed: hasSubmittedCourse },
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progressPercentage = (completedCount / checklistItems.length) * 100;

  // Get revenue share based on plan
  const revenueShare = selectedPlan === 'pro' ? '90%' : '85%';

  // Suggested actions for educator journey
  const suggestedActions: SuggestedAction[] = [
    {
      icon: Plus,
      title: "Create Your First Course",
      description: "Build and publish a course to start teaching and earning. Our wizard makes it easy to get started.",
      ctaText: "Launch Course Builder",
      ctaLink: "#",
      variant: "default" as const,
      badge: createdCourses.length === 0 ? "Start Here" : undefined,
    },
    {
      icon: Video,
      title: "Schedule a Live Event",
      description: "Host live Q&A sessions, workshops, or office hours to engage with your students in real-time.",
      ctaText: "Schedule Event",
      ctaLink: "#",
    },
    {
      icon: BarChart3,
      title: "View Your Analytics",
      description: "Track student progress, course performance, and revenue metrics to optimize your teaching.",
      ctaText: "See Analytics",
      ctaLink: "#",
    },
    {
      icon: Users,
      title: "Manage Your Students",
      description: "Monitor student progress, answer questions, and identify students who need extra support.",
      ctaText: "View Students",
      ctaLink: "#",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumb className="mb-8" />
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {educatorProfile ? `Welcome back, ${educatorProfile.name.split(' ')[0]}!` : 'Educator Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              Manage your courses, track student progress, and grow your teaching business
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button
              variant="secondary"
              onClick={handleStartAutoDemo}
              data-testid="button-watch-auto-demo"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
            >
              <Play className="mr-2 h-4 w-4" />
              🎬 Watch Auto Demo
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowScheduleEvent(true)}
              data-testid="button-schedule-event"
            >
              <Video className="mr-2 h-4 w-4" />
              Schedule Event
            </Button>
            <Button
              onClick={() => setShowCourseWizard(true)}
              data-testid="button-create-course"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                {stats.totalStudents > 0 && <TrendingUp className="h-4 w-4 text-green-600" />}
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalStudents}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.totalEnrollments} enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                </div>
                {stats.publishedCourses > 0 && <TrendingUp className="h-4 w-4 text-green-600" />}
              </div>
              <div className="text-2xl font-bold mb-1">{stats.totalCourses}</div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.publishedCourses} published</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{stats.completedStudents}</div>
              <p className="text-sm text-muted-foreground">Completed Students</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.activeStudents} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                {stats.totalRevenue > 0 && <TrendingUp className="h-4 w-4 text-green-600" />}
              </div>
              <div className="text-2xl font-bold mb-1">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xs text-muted-foreground mt-1">{revenueShare} revenue share</p>
            </CardContent>
          </Card>
        </div>

        {/* Suggested Next Actions */}
        <SuggestedActions 
          actions={suggestedActions}
          title="Grow Your Teaching Business"
          description="Take these actions to engage students and maximize your impact"
        />

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2" data-testid="tab-courses">
              <BookOpen className="h-4 w-4" />
              My Courses
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2" data-testid="tab-students">
              <Users className="h-4 w-4" />
              Students
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center gap-2" data-testid="tab-qa">
              <MessageCircle className="h-4 w-4" />
              Q&A
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2" data-testid="tab-events">
              <Calendar className="h-4 w-4" />
              Live Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Onboarding Checklist */}
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
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

            <div className="grid md:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Trend
                  </CardTitle>
                  <CardDescription>Last 6 months · {revenueShare} revenue share</CardDescription>
                </CardHeader>
                <CardContent>
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

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowCourseWizard(true)}
                    data-testid="quick-create-course"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowScheduleEvent(true)}
                    data-testid="quick-schedule-event"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Schedule Live Event
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/educator/onboarding')}
                    data-testid="quick-edit-profile"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    data-testid="quick-view-analytics"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {createdCourses.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdCourses.map((course, index) => (
                  <Card key={index} data-testid={`course-card-${index}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={course.published ? 'default' : 'secondary'}>
                          {course.published ? 'Published' : 'Draft'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`course-actions-${index}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCourse(course)} data-testid={`course-edit-${index}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePublish(course)} data-testid={`course-toggle-publish-${index}`}>
                              {course.published ? (
                                <><PowerOff className="mr-2 h-4 w-4" />Unpublish</>
                              ) : (
                                <><Power className="mr-2 h-4 w-4" />Publish</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateCourse(course)} data-testid={`course-duplicate-${index}`}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCourse(course)} 
                              className="text-destructive focus:text-destructive"
                              data-testid={`course-delete-${index}`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Students</span>
                          <span className="font-medium">{course.enrollmentCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Lessons</span>
                          <span className="font-medium">{course.totalLessons}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Revenue</span>
                          <span className="font-medium">${course.revenue.toFixed(0)}</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline" onClick={() => navigate(`/courses/${course.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Course
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-10 pb-10 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first course to start teaching and earning
                  </p>
                  <Button onClick={() => setShowCourseWizard(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
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
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Student Questions
                </CardTitle>
                <CardDescription>Recent questions from your students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_QUESTIONS.map((q) => (
                  <div key={q.id} className="border rounded-lg p-4" data-testid={`question-${q.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{q.student.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{q.student}</div>
                          <div className="text-xs text-muted-foreground">{q.time}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{q.course}</Badge>
                    </div>
                    <p className="text-sm mb-3 pl-11">{q.question}</p>
                    <div className="flex gap-2 pl-11">
                      <Button size="sm" variant="outline">Reply</Button>
                      <Button size="sm" variant="ghost">Mark as Answered</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Events</CardTitle>
                    <CardDescription>Schedule and manage your live sessions</CardDescription>
                  </div>
                  <Button onClick={() => setShowScheduleEvent(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_LIVE_EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`event-${event.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.date} at {event.time}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                            {event.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.attendees} attendees
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {event.status === 'upcoming' && (
                        <Button variant="outline" size="sm">Start Event</Button>
                      )}
                      <Button variant="ghost" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Revenue KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card data-testid="card-total-revenue">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-revenue">
                    $17,787
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last 6 months
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-this-month">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-this-month">
                    $3,847
                  </div>
                  <p className="text-xs text-green-600">
                    +24% from last month
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-avg-per-student">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Per Student</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-avg-per-student">
                    $114
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per enrolled student
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-course-sales">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Course Sales Count</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-course-sales">
                    156
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total enrollments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Trend Chart */}
            <Card data-testid="card-revenue-chart">
              <CardHeader>
                <CardTitle>6-Month Revenue Trend</CardTitle>
                <CardDescription>
                  Your earnings over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={REVENUE_TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  Revenue
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  ${payload[0].value}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Performing Courses */}
              <Card data-testid="card-top-courses">
                <CardHeader>
                  <CardTitle>Top Performing Courses</CardTitle>
                  <CardDescription>Your best sellers this period</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course Name</TableHead>
                        <TableHead className="text-right">Students</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TOP_COURSES_DATA.map((course) => (
                        <TableRow key={course.id} data-testid={`top-course-${course.id}`}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell className="text-right" data-testid={`top-course-students-${course.id}`}>
                            {course.students}
                          </TableCell>
                          <TableCell className="text-right font-semibold" data-testid={`top-course-revenue-${course.id}`}>
                            ${course.revenue.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card data-testid="card-recent-transactions">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest 5 course purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECENT_TRANSACTIONS.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        data-testid={`transaction-${transaction.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm" data-testid={`transaction-student-${transaction.id}`}>
                              {transaction.student}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.course}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold" data-testid={`transaction-amount-${transaction.id}`}>
                            ${transaction.amount}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <PlanSelectionModal
        open={showPlanModal}
        onOpenChange={setShowPlanModal}
        onPlanSelected={handlePlanSelected}
      />
      <CourseBuilderWizard
        open={showCourseWizard}
        onOpenChange={(open) => {
          setShowCourseWizard(open);
          if (!open) {
            setEditingCourse(null);
          }
        }}
        onCourseCreated={handleCourseCreated}
        editingCourse={editingCourse}
      />
      <ScheduleLiveEventModal
        open={showScheduleEvent}
        onOpenChange={setShowScheduleEvent}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
              All associated enrollments and revenue data will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="delete-dialog-cancel">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCourse} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="delete-dialog-confirm"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Auto Demo Progress Overlay */}
      {showAutoDemo && (
        <AutoDemoProgress
          onClose={() => setShowAutoDemo(false)}
        />
      )}
    </div>
  );
};
