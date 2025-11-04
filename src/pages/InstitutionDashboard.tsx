import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
      coursesAssigned: [], // Would be from multiselect
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

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">Institution Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage cohorts, track student progress, and administer your learning programs
              </p>
              <Badge variant="secondary" className="mt-2">Demo View - No real data</Badge>
            </div>
            <Button onClick={() => setShowCohortModal(true)} data-testid="button-create-cohort">
              <Plus className="mr-2 h-4 w-4" />
              Create Cohort
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Students
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">193</div>
                <p className="text-xs text-muted-foreground mt-1">Across all cohorts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Active Cohorts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{cohorts.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Currently running</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Avg Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">63%</div>
                <p className="text-xs text-muted-foreground mt-1">Institution average</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Certificates Issued
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-xs text-muted-foreground mt-1">This semester</p>
              </CardContent>
            </Card>
          </div>

          {/* CSV Upload Section */}
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
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv"
                    className="hidden"
                    onChange={handleCSVUpload}
                  />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" asChild data-testid="button-upload-csv">
                      <span className="cursor-pointer">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Upload CSV File
                      </span>
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    CSV should include: name, email, cohort (optional)
                  </p>
                </div>

                {uploadedFileName && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">Import Successful</div>
                      <div className="text-xs text-muted-foreground">
                        {uploadedCount} students imported from {uploadedFileName}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cohorts Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cohorts
              </CardTitle>
              <CardDescription>
                Manage learning cohorts and track student progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cohort Name</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Avg Progress</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cohorts.map((cohort) => (
                    <TableRow key={cohort.id} data-testid={`cohort-row-${cohort.id}`}>
                      <TableCell className="font-medium">{cohort.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {cohort.startDate} to {cohort.endDate}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{cohort.totalStudents} total</div>
                          <div className="text-muted-foreground text-xs">
                            {cohort.activeLearners} active
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={cohort.avgProgress} className="h-2" />
                          <div className="text-sm text-muted-foreground">{cohort.avgProgress}%</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {cohort.coursesAssigned.length} courses
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendInvitations(cohort)}
                          data-testid={`button-invite-${cohort.id}`}
                        >
                          <Send className="mr-2 h-3 w-3" />
                          Invite
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Download Reports */}
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
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4"
                  onClick={() => handleDownloadReport("Student Progress")}
                  data-testid="button-download-progress"
                >
                  <FileSpreadsheet className="h-6 w-6" />
                  <div className="text-sm font-medium">Student Progress</div>
                  <div className="text-xs text-muted-foreground">CSV export of all student data</div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4"
                  onClick={() => handleDownloadReport("Completion")}
                  data-testid="button-download-completion"
                >
                  <BarChart3 className="h-6 w-6" />
                  <div className="text-sm font-medium">Completion Report</div>
                  <div className="text-xs text-muted-foreground">Course completion statistics</div>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4"
                  onClick={() => handleDownloadReport("Certificates")}
                  data-testid="button-download-certificates"
                >
                  <CheckCircle2 className="h-6 w-6" />
                  <div className="text-sm font-medium">Certificate List</div>
                  <div className="text-xs text-muted-foreground">All issued certificates</div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
    </>
  );
}
