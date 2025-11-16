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
} from "lucide-react";

// Mock cohorts data
const MOCK_COHORTS = [
  {
    id: 1,
    name: "Fall 2024 Leadership Cohort",
    startDate: "2024-09-01",
    endDate: "2024-12-15",
    totalStudents: 45,
    activeLearners: 42,
    avgProgress: 67,
    coursesAssigned: ["Funding Essentials", "Legal Framework", "Marketing Basics"],
  },
  {
    id: 2,
    name: "Nonprofit Fundamentals - Spring 2025",
    startDate: "2025-01-15",
    endDate: "2025-05-30",
    totalStudents: 120,
    activeLearners: 118,
    avgProgress: 34,
    coursesAssigned: ["Nonprofit Operations", "Fundraising 101"],
  },
  {
    id: 3,
    name: "Executive Training Program",
    startDate: "2024-10-01",
    endDate: "2025-03-31",
    totalStudents: 28,
    activeLearners: 26,
    avgProgress: 89,
    coursesAssigned: ["Strategic Planning", "Financial Management", "Team Leadership"],
  },
];

export default function InstitutionDashboard() {
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedCount, setUploadedCount] = useState(0);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [cohorts, setCohorts] = useState(MOCK_COHORTS);

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Fake CSV processing
      setUploadedFileName(file.name);
      const fakeCount = Math.floor(Math.random() * 50) + 10;
      setUploadedCount(fakeCount);
      
      toast({
        title: "CSV uploaded successfully! 📄",
        description: `Imported ${fakeCount} students from ${file.name}`,
      });
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
      ctaLink: "#",
      variant: "default" as const,
      badge: uploadedCount === 0 ? "Start Here" : undefined,
    },
    {
      icon: FileSpreadsheet,
      title: "Download Progress Reports",
      description: "Generate comprehensive reports on student progress, completion rates, and engagement metrics.",
      ctaText: "View Reports",
      ctaLink: "#",
    },
    {
      icon: Users,
      title: "Manage Cohorts",
      description: "Create new cohorts, assign courses, and organize your students into learning groups.",
      ctaText: "Manage Cohorts",
      ctaLink: "#",
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      description: "Monitor overall institution metrics, student completion rates, and identify areas for improvement.",
      ctaText: "View Analytics",
      ctaLink: "#",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <PageBreadcrumb />

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Institution Dashboard</h1>
            <p className="text-muted-foreground mb-2">
              Manage cohorts, track student progress, and administer your learning programs
            </p>
            <Badge variant="secondary">Demo View - Mock Data</Badge>
          </div>
          <Button onClick={() => setShowCohortModal(true)} data-testid="button-create-cohort">
            <Plus className="mr-2 h-4 w-4" />
            Create Cohort
          </Button>
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
              <div className="text-2xl font-bold mb-1">127</div>
              <p className="text-sm text-muted-foreground">Certificates Issued</p>
              <p className="text-xs text-muted-foreground mt-1">This semester</p>
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
            <TabsTrigger value="students" className="flex items-center gap-2" data-testid="tab-students">
              <Upload className="h-4 w-4" />
              Import Students
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2" data-testid="tab-reports">
              <Download className="h-4 w-4" />
              Reports
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
                    />
                    <label htmlFor="csv-upload">
                      <Button variant="default" asChild data-testid="button-upload-csv">
                        <span className="cursor-pointer">
                          <FileSpreadsheet className="mr-2 h-4 w-4" />
                          Upload CSV File
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

                  {uploadedFileName && (
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
    </div>
  );
}
