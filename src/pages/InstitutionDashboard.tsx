import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SuggestedActions, SuggestedAction } from "@/components/dashboard/SuggestedActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  Upload,
  Users,
  BookOpen,
  Calendar,
  Download,
  Send,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  Mail,
  BarChart3,
  ChevronRight,
  TrendingUp,
  Settings,
  Eye,
  AlertCircle,
  Globe,
  Languages,
  Subtitles,
  Accessibility,
  Volume2,
  Play,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";

// Analytics chart data
const COMPLETION_TREND_DATA = [
  { month: "Jul", rate: 58, students: 890 },
  { month: "Aug", rate: 62, students: 945 },
  { month: "Sep", rate: 65, students: 1020 },
  { month: "Oct", rate: 68, students: 1105 },
  { month: "Nov", rate: 71, students: 1180 },
  { month: "Dec", rate: 72, students: 1247 },
];

const COURSE_DISTRIBUTION_DATA = [
  { name: "Leadership", value: 28, color: "#3b82f6" },
  { name: "Technical Skills", value: 24, color: "#10b981" },
  { name: "Grant Writing", value: 18, color: "#f59e0b" },
  { name: "Marketing", value: 15, color: "#8b5cf6" },
  { name: "Finance", value: 15, color: "#ec4899" },
];

const ENGAGEMENT_DATA = [
  { day: "Mon", logins: 425, lessons: 312 },
  { day: "Tue", logins: 480, lessons: 345 },
  { day: "Wed", logins: 520, lessons: 398 },
  { day: "Thu", logins: 495, lessons: 367 },
  { day: "Fri", logins: 410, lessons: 289 },
  { day: "Sat", logins: 180, lessons: 124 },
  { day: "Sun", logins: 145, lessons: 98 },
];

// Language & Accessibility stats
const LANGUAGE_STATS = {
  totalCaptionedCourses: 47,
  englishOnly: 23,
  bilingual: 24,
  captionUsageRate: 34,
  preferredLanguages: [
    { language: "English", percentage: 68 },
    { language: "Spanish", percentage: 28 },
    { language: "Portuguese", percentage: 4 },
  ],
  accessibilityUsers: 156,
  screenReaderUsers: 23,
  captionUsers: 133,
};

// Mock cohorts data - 12 cohorts, 1,247 total students, 72% avg completion
const MOCK_COHORTS = [
  {
    id: 1,
    name: "Fall 2025 Entrepreneurs",
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    totalStudents: 127,
    activeLearners: 125,
    avgProgress: 68,
    coursesAssigned: ["Funding Essentials", "Legal Framework", "Marketing Basics"],
  },
  {
    id: 2,
    name: "Corporate Training Q4",
    startDate: "2024-10-01",
    endDate: "2025-03-31",
    totalStudents: 180,
    activeLearners: 176,
    avgProgress: 48,
    coursesAssigned: ["Leadership Skills", "Project Management", "Communication"],
  },
  {
    id: 3,
    name: "Grant Writing Cohort",
    startDate: "2024-11-01",
    endDate: "2025-02-28",
    totalStudents: 65,
    activeLearners: 63,
    avgProgress: 80,
    coursesAssigned: ["Grant Writing 101", "Nonprofit Fundraising"],
  },
  {
    id: 4,
    name: "Spring 2025 Leadership Program",
    startDate: "2025-01-15",
    endDate: "2025-05-30",
    totalStudents: 142,
    activeLearners: 138,
    avgProgress: 85,
    coursesAssigned: ["Strategic Planning", "Team Building", "Executive Communication"],
  },
  {
    id: 5,
    name: "Tech Skills Bootcamp",
    startDate: "2024-09-01",
    endDate: "2025-01-31",
    totalStudents: 145,
    activeLearners: 141,
    avgProgress: 92,
    coursesAssigned: ["Web Development", "Data Analytics", "Cloud Computing"],
  },
  {
    id: 6,
    name: "Healthcare Admin Certification",
    startDate: "2024-08-15",
    endDate: "2025-04-30",
    totalStudents: 87,
    activeLearners: 84,
    avgProgress: 75,
    coursesAssigned: ["Healthcare Management", "Compliance", "Patient Care"],
  },
  {
    id: 7,
    name: "Diversity & Inclusion Training",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    totalStudents: 69,
    activeLearners: 67,
    avgProgress: 89,
    coursesAssigned: ["Workplace Diversity", "Inclusive Leadership"],
  },
  {
    id: 8,
    name: "Financial Literacy Workshop",
    startDate: "2025-01-01",
    endDate: "2025-03-15",
    totalStudents: 94,
    activeLearners: 90,
    avgProgress: 60,
    coursesAssigned: ["Personal Finance", "Investment Basics", "Retirement Planning"],
  },
  {
    id: 9,
    name: "Marketing Mastery 2025",
    startDate: "2024-11-15",
    endDate: "2025-05-15",
    totalStudents: 115,
    activeLearners: 111,
    avgProgress: 67,
    coursesAssigned: ["Digital Marketing", "Social Media Strategy", "Content Creation"],
  },
  {
    id: 10,
    name: "Cybersecurity Fundamentals",
    startDate: "2024-09-01",
    endDate: "2024-12-20",
    totalStudents: 75,
    activeLearners: 72,
    avgProgress: 94,
    coursesAssigned: ["Network Security", "Threat Detection", "Incident Response"],
  },
  {
    id: 11,
    name: "Sustainability Certificate",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    totalStudents: 51,
    activeLearners: 49,
    avgProgress: 35,
    coursesAssigned: ["Environmental Policy", "Sustainable Business", "Green Technology"],
  },
  {
    id: 12,
    name: "Executive MBA Prep",
    startDate: "2024-08-01",
    endDate: "2025-07-31",
    totalStudents: 97,
    activeLearners: 94,
    avgProgress: 71,
    coursesAssigned: ["Business Strategy", "Financial Management", "Operations"],
  },
];

// Mock student progress data for analytics
const MOCK_STUDENT_PROGRESS = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@example.com", cohort: "Fall 2025 Entrepreneurs", progress: 82, lastActive: "2 hours ago", status: "On Track" },
  { id: 2, name: "Michael Chen", email: "m.chen@example.com", cohort: "Corporate Training Q4", progress: 28, lastActive: "8 days ago", status: "At Risk" },
  { id: 3, name: "Emma Davis", email: "emma.d@example.com", cohort: "Tech Skills Bootcamp", progress: 100, lastActive: "1 hour ago", status: "Completed" },
  { id: 4, name: "James Wilson", email: "j.wilson@example.com", cohort: "Spring 2025 Leadership Program", progress: 75, lastActive: "5 hours ago", status: "On Track" },
  { id: 5, name: "Olivia Martinez", email: "o.martinez@example.com", cohort: "Grant Writing Cohort", progress: 15, lastActive: "12 days ago", status: "At Risk" },
  { id: 6, name: "David Brown", email: "d.brown@example.com", cohort: "Healthcare Admin Certification", progress: 91, lastActive: "3 hours ago", status: "On Track" },
  { id: 7, name: "Sophia Garcia", email: "sophia.g@example.com", cohort: "Diversity & Inclusion Training", progress: 88, lastActive: "1 day ago", status: "On Track" },
  { id: 8, name: "Robert Taylor", email: "r.taylor@example.com", cohort: "Financial Literacy Workshop", progress: 22, lastActive: "6 days ago", status: "At Risk" },
  { id: 9, name: "Ava Anderson", email: "ava.a@example.com", cohort: "Marketing Mastery 2025", progress: 64, lastActive: "4 hours ago", status: "On Track" },
  { id: 10, name: "William Thomas", email: "w.thomas@example.com", cohort: "Cybersecurity Fundamentals", progress: 95, lastActive: "2 hours ago", status: "On Track" },
  { id: 11, name: "Isabella Moore", email: "i.moore@example.com", cohort: "Sustainability Certificate", progress: 34, lastActive: "3 days ago", status: "On Track" },
  { id: 12, name: "Ethan Jackson", email: "e.jackson@example.com", cohort: "Executive MBA Prep", progress: 70, lastActive: "6 hours ago", status: "On Track" },
];

export default function InstitutionDashboard() {
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [cohorts, setCohorts] = useState(MOCK_COHORTS);

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploading(true);
      setUploadProgress(0);
      
      // Simulate realistic upload progress for 127 students
      const totalStudents = 127;
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= totalStudents) {
            clearInterval(interval);
            return totalStudents;
          }
          return prev + Math.floor(Math.random() * 8) + 5;
        });
      }, 80);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2500));
      clearInterval(interval);
      
      setUploadProgress(totalStudents);
      setUploadedCount(totalStudents);
      setUploading(false);
      setShowUploadSuccessModal(true);
    }
  };

  const handleCreateCohort = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newCohort = {
      id: cohorts.length + 1,
      name: formData.get('cohortName') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      totalStudents: 0,
      activeLearners: 0,
      avgProgress: 0,
      coursesAssigned: [],
    };

    setCohorts([...cohorts, newCohort]);
    setShowCohortModal(false);
    
    toast({
      title: "Cohort created! 🎓",
      description: `${newCohort.name} has been created successfully.`,
    });
  };

  const handleSendInvitations = (cohort: any) => {
    setSelectedCohort(cohort);
    setShowInviteModal(true);
  };

  const confirmSendInvitations = () => {
    toast({
      title: "Invitations sent! 📧",
      description: `${selectedCohort.totalStudents} invitation emails have been sent.`,
    });
    setShowInviteModal(false);
    setSelectedCohort(null);
  };

  const handleDownloadReport = (type: string) => {
    toast({
      title: "Report downloaded! 📊",
      description: `${type} report has been downloaded as CSV.`,
    });
  };

  const totalStudents = cohorts.reduce((sum, c) => sum + c.totalStudents, 0);
  const avgProgress = Math.round(cohorts.reduce((sum, c) => sum + c.avgProgress, 0) / cohorts.length);

  const suggestedActions: SuggestedAction[] = [
    {
      icon: Upload,
      title: "Import Student Data",
      description: "Upload CSV files with student information to quickly enroll learners into your cohorts.",
      ctaText: "Upload CSV",
      onClick: () => document.querySelector('[data-testid="tab-students"]')?.dispatchEvent(new Event('click', { bubbles: true })),
      variant: "default" as const,
      badge: uploadedCount === 0 ? "Start Here" : undefined,
    },
    {
      icon: FileSpreadsheet,
      title: "Download Progress Reports",
      description: "Generate comprehensive reports on student progress, completion rates, and engagement metrics.",
      ctaText: "View Reports",
      onClick: () => document.querySelector('[data-testid="tab-reports"]')?.dispatchEvent(new Event('click', { bubbles: true })),
    },
    {
      icon: Users,
      title: "Manage Cohorts",
      description: "Create new cohorts, assign courses, and organize your students into learning groups.",
      ctaText: "Manage Cohorts",
      onClick: () => document.querySelector('[data-testid="tab-cohorts"]')?.dispatchEvent(new Event('click', { bubbles: true })),
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      description: "Monitor overall institution metrics, student completion rates, and identify areas for improvement.",
      ctaText: "View Analytics",
      onClick: () => document.querySelector('[data-testid="tab-analytics"]')?.dispatchEvent(new Event('click', { bubbles: true })),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageBreadcrumb />

      <div className="container mx-auto px-4 py-16">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 mb-8 shadow-lg" style={{ background: 'linear-gradient(to right, #2563eb, #4338ca)' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p style={{ color: '#bfdbfe' }} className="text-sm mb-1">Welcome back,</p>
              <h1 style={{ color: '#ffffff' }} className="text-2xl md:text-3xl font-bold mb-2">Stanford Innovation Academy</h1>
              <p style={{ color: '#dbeafe' }} className="max-w-xl">
                Your learning programs are performing well. 8 cohorts are on track and student engagement is up 12% this month.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowCohortModal(true)} data-testid="button-create-cohort">
                <Plus className="mr-2 h-4 w-4" />
                Create Cohort
              </Button>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Institution Overview</h2>
            <p className="text-sm text-muted-foreground">Real-time metrics across all your learning programs</p>
          </div>
          <Badge variant="secondary">Demo View</Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-2xl font-bold mb-1">{totalStudents}</div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-xs text-green-600 mt-1">Across all cohorts</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{cohorts.length}</div>
              <p className="text-sm text-muted-foreground">Active Cohorts</p>
              <p className="text-xs text-muted-foreground mt-1">Currently running</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-amber-500" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{avgProgress}%</div>
              <p className="text-sm text-muted-foreground">Avg Completion</p>
              <p className="text-xs text-muted-foreground mt-1">Institution average</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">873</div>
              <p className="text-sm text-muted-foreground">Certificates Issued</p>
              <p className="text-xs text-muted-foreground mt-1">Across all programs</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted p-1 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="cohorts" className="flex items-center gap-2" data-testid="tab-cohorts">
              <Users className="h-4 w-4" />
              Cohorts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2" data-testid="tab-students">
              <Upload className="h-4 w-4" />
              Import Students
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2" data-testid="tab-reports">
              <Download className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2" data-testid="tab-language">
              <Languages className="h-4 w-4" />
              Language & Accessibility
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cohort Performance</CardTitle>
                  <CardDescription>Average completion rates by cohort</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cohorts.map((cohort) => (
                    <div key={cohort.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium line-clamp-1">{cohort.name}</span>
                        <span className="text-sm text-muted-foreground">{cohort.avgProgress}%</span>
                      </div>
                      <Progress value={cohort.avgProgress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowCohortModal(true)}
                    data-testid="quick-create-cohort"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Cohort
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    data-testid="quick-import-students"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Import Students
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => handleDownloadReport("Progress")}
                    data-testid="quick-download-report"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            <SuggestedActions 
              actions={suggestedActions}
              title="Recommended Actions"
              description="Streamline your institution management with these guided tasks"
            />
          </TabsContent>

          {/* Cohorts Tab */}
          <TabsContent value="cohorts" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cohorts.map((cohort) => (
                <Card key={cohort.id} data-testid={`cohort-card-${cohort.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={cohort.avgProgress > 50 ? 'default' : 'secondary'}>
                        {cohort.avgProgress > 70 ? 'On Track' : 'In Progress'}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{cohort.name}</CardTitle>
                    <CardDescription>
                      {cohort.startDate} - {cohort.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{cohort.avgProgress}%</span>
                      </div>
                      <Progress value={cohort.avgProgress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Students</span>
                        <span className="font-medium">{cohort.totalStudents}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Active Learners</span>
                        <span className="font-medium">{cohort.activeLearners}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Courses</span>
                        <span className="font-medium">{cohort.coursesAssigned.length}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleSendInvitations(cohort)}
                        data-testid={`button-invite-${cohort.id}`}
                      >
                        <Send className="mr-2 h-3 w-3" />
                        Invite
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">8</div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Cohorts On Track</p>
                <p className="text-xs text-muted-foreground mt-1">Meeting completion targets</p>
              </div>
              <div className="text-center p-6 bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">3</div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">At Risk</p>
                <p className="text-xs text-muted-foreground mt-1">Below 50% completion</p>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Completed</p>
                <p className="text-xs text-muted-foreground mt-1">100% completion rate</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Completion Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Completion Rate Trend
                  </CardTitle>
                  <CardDescription>6-month completion rate progression across all cohorts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={COMPLETION_TREND_DATA}>
                        <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis domain={[50, 80]} className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--background))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorRate)" 
                          name="Completion Rate %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>+14% growth over 6 months</span>
                  </div>
                </CardContent>
              </Card>

              {/* Course Distribution Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Course Category Distribution
                  </CardTitle>
                  <CardDescription>Enrollment breakdown by course category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={COURSE_DISTRIBUTION_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {COURSE_DISTRIBUTION_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Engagement Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Weekly Engagement
                </CardTitle>
                <CardDescription>Daily logins and lesson completions this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ENGAGEMENT_DATA}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="logins" stroke="#8b5cf6" strokeWidth={2} name="Daily Logins" dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="lessons" stroke="#f59e0b" strokeWidth={2} name="Lessons Completed" dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Student Progress Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Student Progress Tracking
                </CardTitle>
                <CardDescription>
                  Monitor student engagement and identify at-risk learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Cohort</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_STUDENT_PROGRESS.map((student) => (
                        <TableRow key={student.id} data-testid={`student-row-${student.id}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{student.cohort}</TableCell>
                          <TableCell>
                            <div className="space-y-1 min-w-[120px]">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{student.progress}%</span>
                              </div>
                              <Progress value={student.progress} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{student.lastActive}</TableCell>
                          <TableCell>
                            {student.status === "At Risk" ? (
                              <Badge variant="destructive" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                At Risk
                              </Badge>
                            ) : student.status === "Completed" ? (
                              <Badge variant="default" className="gap-1 bg-green-600">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                On Track
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => toast({ title: "Reminder sent! 📧", description: "Sent engagement reminders to 3 at-risk students" })}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reminders to At-Risk Students
                  </Button>
                  <Button variant="outline" onClick={() => handleDownloadReport("Student Progress")}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Import Students Tab */}
          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Import Students via CSV
                </CardTitle>
                <CardDescription>
                  Upload a CSV file to bulk import students into your institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <input
                      type="file"
                      id="csv-upload"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVUpload}
                      disabled={uploading}
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="default" asChild data-testid="button-upload-csv" disabled={uploading}>
                        <span className="cursor-pointer">
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          {uploading ? "Processing..." : "Upload CSV File"}
                        </span>
                      </Button>
                    </label>
                    <p className="text-sm text-muted-foreground mt-4">
                      CSV should include: name, email, cohort (optional)
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: .csv (max 10MB)
                    </p>
                  </div>

                  {uploading && (
                    <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          Processing {uploadedFileName}
                        </span>
                        <span className="text-blue-700 dark:text-blue-300">
                          {uploadProgress} / 127 students
                        </span>
                      </div>
                      <Progress value={(uploadProgress / 127) * 100} className="h-2" />
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Adding students to Fall 2025 Entrepreneurs cohort...
                      </p>
                    </div>
                  )}

                  {!uploading && uploadedFileName && uploadedCount > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Import Successful</div>
                        <div className="text-xs text-muted-foreground">
                          {uploadedCount} students imported from {uploadedFileName}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <h4 className="font-medium mb-2 text-sm">CSV Format Example</h4>
                    <pre className="text-xs text-muted-foreground font-mono bg-background p-3 rounded overflow-x-auto">
{`name,email,cohort
John Doe,john@example.com,Fall 2024
Jane Smith,jane@example.com,Spring 2025`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Reports
                </CardTitle>
                <CardDescription>
                  Export data and generate reports for your records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto flex flex-col gap-3 p-6 items-start"
                    onClick={() => handleDownloadReport("Student Progress")}
                    data-testid="button-download-progress"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileSpreadsheet className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold mb-1">Student Progress</div>
                      <div className="text-xs text-muted-foreground">CSV export of all student data</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto flex flex-col gap-3 p-6 items-start"
                    onClick={() => handleDownloadReport("Completion")}
                    data-testid="button-download-completion"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold mb-1">Completion Report</div>
                      <div className="text-xs text-muted-foreground">Course completion statistics</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto flex flex-col gap-3 p-6 items-start"
                    onClick={() => handleDownloadReport("Certificates")}
                    data-testid="button-download-certificates"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold mb-1">Certificate List</div>
                      <div className="text-xs text-muted-foreground">All issued certificates</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Language & Accessibility Tab */}
          <TabsContent value="language" className="space-y-6">
            {/* Language Stats Overview */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Subtitles className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{LANGUAGE_STATS.totalCaptionedCourses}</div>
                  <p className="text-sm text-muted-foreground">Captioned Courses</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{LANGUAGE_STATS.bilingual}</div>
                  <p className="text-sm text-muted-foreground">Bilingual Courses (EN/ES)</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Accessibility className="h-5 w-5 text-purple-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{LANGUAGE_STATS.accessibilityUsers}</div>
                  <p className="text-sm text-muted-foreground">Accessibility Users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Volume2 className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold">{LANGUAGE_STATS.captionUsageRate}%</div>
                  <p className="text-sm text-muted-foreground">Caption Usage Rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Language Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5" />
                    Student Language Preferences
                  </CardTitle>
                  <CardDescription>Distribution of preferred content language across your institution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {LANGUAGE_STATS.preferredLanguages.map((lang) => (
                    <div key={lang.language}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.language === "English" ? "🇺🇸" : lang.language === "Spanish" ? "🇪🇸" : "🇧🇷"}</span>
                          <span className="font-medium">{lang.language}</span>
                        </div>
                        <span className="text-muted-foreground">{lang.percentage}%</span>
                      </div>
                      <Progress value={lang.percentage} className="h-2" />
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t mt-4">
                    <p className="text-sm text-muted-foreground mb-3">Default Institution Language</p>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex items-center gap-2">
                        <span>🇺🇸</span> English
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <span>🇪🇸</span> Spanish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accessibility Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5" />
                    Accessibility Features Usage
                  </CardTitle>
                  <CardDescription>How students use accessibility features in your courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Subtitles className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Closed Captions</p>
                          <p className="text-sm text-muted-foreground">Students using video captions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{LANGUAGE_STATS.captionUsers}</p>
                        <p className="text-xs text-muted-foreground">students</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Eye className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">Screen Reader Compatible</p>
                          <p className="text-sm text-muted-foreground">Students using screen readers</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{LANGUAGE_STATS.screenReaderUsers}</p>
                        <p className="text-xs text-muted-foreground">students</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-200">WCAG 2.1 AA Compliant</p>
                        <p className="text-sm text-green-700 dark:text-green-300">All courses meet accessibility standards</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Caption Preview Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Bilingual Caption Preview
                </CardTitle>
                <CardDescription>See how captions appear in courses with bilingual support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video max-w-2xl mx-auto">
                  {/* Mock Video Preview */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <Play className="h-16 w-16 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Video Preview</p>
                    </div>
                  </div>
                  
                  {/* Caption Overlay Preview */}
                  <div className="absolute bottom-8 left-0 right-0 text-center px-4">
                    <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg">
                      <p className="text-sm md:text-base font-medium">
                        Welcome to The Ready Lab. Let's begin your learning journey.
                      </p>
                    </div>
                  </div>
                  
                  {/* Language Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-black/60 text-white border-none">
                      🇺🇸 EN
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="default" size="sm">🇺🇸 English</Button>
                  <Button variant="outline" size="sm">🇪🇸 Español</Button>
                  <Button variant="outline" size="sm">Off</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Cohort Modal */}
      <Dialog open={showCohortModal} onOpenChange={setShowCohortModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Cohort</DialogTitle>
            <DialogDescription>
              Set up a new learning cohort for your students
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCohort} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cohortName">Cohort Name *</Label>
              <Input
                id="cohortName"
                name="cohortName"
                placeholder="e.g., Spring 2025 Leadership Program"
                required
                data-testid="input-cohort-name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  required
                  data-testid="input-start-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  required
                  data-testid="input-end-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courses">Assign Courses (Demo - multiselect)</Label>
              <Textarea
                id="courses"
                name="courses"
                placeholder="In production, this would be a multiselect dropdown"
                rows={2}
                data-testid="textarea-courses"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCohortModal(false)}
                data-testid="button-cancel-cohort"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-submit-cohort">
                Create Cohort
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Send Invitations Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Invitations</DialogTitle>
            <DialogDescription>
              Confirm sending email invitations to students
            </DialogDescription>
          </DialogHeader>

          {selectedCohort && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="font-medium mb-2">{selectedCohort.name}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedCohort.totalStudents} students will receive an email invitation with:
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="font-medium">Sample Email Preview:</span>
                  </div>
                  <div className="text-muted-foreground pl-6">
                    <p className="mb-2">Subject: Welcome to {selectedCohort.name}</p>
                    <p className="italic">
                      "You've been enrolled in {selectedCohort.name}. Click here to access your courses and get started..."
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                  data-testid="button-cancel-invite"
                >
                  Cancel
                </Button>
                <Button onClick={confirmSendInvitations} data-testid="button-confirm-invite">
                  <Send className="mr-2 h-4 w-4" />
                  Send Invitations
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Success Modal */}
      <Dialog open={showUploadSuccessModal} onOpenChange={setShowUploadSuccessModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <DialogTitle>Import Successful!</DialogTitle>
                <DialogDescription>
                  Students have been added to your institution
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-1">127</div>
                  <p className="text-sm text-muted-foreground">Students Imported</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">127</div>
                  <p className="text-sm text-muted-foreground">Emails Sent</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border">
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium mb-1">Fall 2025 Entrepreneurs</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    All 127 students have been added to this cohort and can access their courses immediately.
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Badge variant="secondary">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Cohort created
                    </Badge>
                    <Badge variant="secondary">
                      <Mail className="h-3 w-3 mr-1" />
                      Welcome emails sent
                    </Badge>
                    <Badge variant="secondary">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Courses assigned
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowUploadSuccessModal(false)}
                data-testid="button-close-success"
              >
                Close
              </Button>
              <Button onClick={() => {
                setShowUploadSuccessModal(false);
                // Switch to cohorts tab to see the new cohort
                document.querySelector('[data-testid="tab-cohorts"]')?.dispatchEvent(new Event('click', { bubbles: true }));
              }} data-testid="button-view-cohort">
                <Eye className="mr-2 h-4 w-4" />
                View Cohort
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
