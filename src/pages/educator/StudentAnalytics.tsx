import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, Mail, Filter, TrendingUp, Users, 
  AlertTriangle, CheckCircle2, BarChart3 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllEnrollments } from '@/utils/educatorCoursesStorage';

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledDate: string;
  progress: number;
  lastActive: string;
  status: 'active' | 'at-risk' | 'completed';
}

// Helper function to format relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 60) {
    return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
}

const StudentAnalytics = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'at-risk' | 'completed'>('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Load real enrollments from localStorage
  const allEnrollments = useMemo(() => getAllEnrollments(), []);
  
  // Transform enrollments to Student format
  const allStudents: Student[] = useMemo(() => {
    return allEnrollments.map(enrollment => {
      const lastActive = enrollment.status === 'completed'
        ? `Completed ${new Date(enrollment.lastActiveAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
        : getRelativeTime(enrollment.lastActiveAt);

      return {
        id: enrollment.id,
        name: enrollment.studentName,
        email: enrollment.studentEmail,
        enrolledDate: new Date(enrollment.enrolledAt).toISOString().split('T')[0],
        progress: enrollment.progress,
        lastActive,
        status: enrollment.status,
      };
    });
  }, [allEnrollments]);

  const filteredStudents = filter === 'all' 
    ? allStudents 
    : allStudents.filter(s => s.status === filter);

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendEmail = () => {
    toast({
      title: "Emails sent! ✉️",
      description: `Sent reminder email to ${selectedStudents.length} student(s)`,
    });
    setSelectedStudents([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-blue-500">Active</Badge>;
      case 'at-risk':
        return <Badge variant="destructive">At Risk</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-green-500 text-white">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/educator/dashboard')}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Student Analytics</h1>
            <p className="text-muted-foreground">
              Track progress, identify at-risk students, and engage with your learners
            </p>
          </div>

          <Tabs defaultValue="students" className="space-y-6">
            <TabsList>
              <TabsTrigger value="students" data-testid="tab-students">
                <Users className="mr-2 h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{allStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">
                      {allStudents.filter(s => s.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">
                      {allStudents.filter(s => s.status === 'at-risk').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">
                      {allStudents.filter(s => s.status === 'completed').length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>Student List</CardTitle>
                      <CardDescription>
                        {filteredStudents.length} student(s) • {selectedStudents.length} selected
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilter('all')}
                        data-testid="filter-all"
                      >
                        All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilter('active')}
                        data-testid="filter-active"
                      >
                        Active
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilter('at-risk')}
                        data-testid="filter-at-risk"
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        At Risk
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFilter('completed')}
                        data-testid="filter-completed"
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedStudents.length > 0 && (
                    <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {selectedStudents.length} student(s) selected
                      </span>
                      <Button 
                        size="sm" 
                        onClick={handleSendEmail}
                        data-testid="button-send-email"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reminder Email
                      </Button>
                    </div>
                  )}

                  {filteredStudents.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 pb-3 border-b font-medium text-sm">
                        <div className="w-8">
                          <Checkbox
                            checked={selectedStudents.length === filteredStudents.length}
                            onCheckedChange={handleSelectAll}
                            data-testid="checkbox-select-all"
                          />
                        </div>
                        <div className="flex-1">Student</div>
                        <div className="w-32">Progress</div>
                        <div className="w-32">Last Active</div>
                        <div className="w-24">Status</div>
                      </div>

                      {filteredStudents.map((student) => (
                        <div 
                          key={student.id} 
                          className="flex items-center gap-4 py-3 border-b hover:bg-muted/50 rounded transition-colors"
                          data-testid={`student-row-${student.id}`}
                        >
                          <div className="w-8">
                            <Checkbox
                              checked={selectedStudents.includes(student.id)}
                              onCheckedChange={() => handleSelectStudent(student.id)}
                              data-testid={`checkbox-student-${student.id}`}
                            />
                          </div>
                          <div className="flex-1 flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{student.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-muted-foreground">{student.email}</div>
                            </div>
                          </div>
                          <div className="w-32">
                            <div className="space-y-1">
                              <Progress value={student.progress} className="h-2" />
                              <div className="text-xs text-muted-foreground">{student.progress}%</div>
                            </div>
                          </div>
                          <div className="w-32 text-sm text-muted-foreground">
                            {student.lastActive}
                          </div>
                          <div className="w-24">
                            {getStatusBadge(student.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium mb-2">No students yet</p>
                      <p className="text-sm">
                        {filter === 'all' 
                          ? 'Students will appear here when they enroll in your courses' 
                          : `No ${filter} students`}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Enrollment Trend</CardTitle>
                    <CardDescription>Last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {[42, 58, 65, 71, 84, 89].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Completion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Completion Funnel</CardTitle>
                    <CardDescription>Drop-off by lesson</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { lesson: 'Lesson 1', rate: 100 },
                      { lesson: 'Lesson 2', rate: 92 },
                      { lesson: 'Lesson 3', rate: 77 },
                      { lesson: 'Lesson 4', rate: 71 },
                      { lesson: 'Lesson 5', rate: 68 },
                      { lesson: 'Completed', rate: 65 },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{item.lesson}</span>
                          <span className="font-medium">{item.rate}%</span>
                        </div>
                        <Progress value={item.rate} className="h-2" />
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        💡 <strong>Insight:</strong> Biggest drop-off at Lesson 3 (15%) - consider improving content
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Average Rating */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Rating</CardTitle>
                    <CardDescription>Based on 89 reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-6xl font-bold">4.8</div>
                      <div className="flex-1">
                        <div className="text-yellow-500 text-3xl">★★★★★</div>
                        <p className="text-sm text-muted-foreground mt-1">Excellent rating!</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement Heatmap */}
                <Card>
                  <CardHeader>
                    <CardTitle>Peak Activity Times</CardTitle>
                    <CardDescription>When students are most active</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Weekday Mornings</span>
                        <div className="flex-1 bg-muted h-6 rounded overflow-hidden">
                          <div className="bg-blue-300 h-full" style={{ width: '45%' }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">45%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Weekday Evenings</span>
                        <div className="flex-1 bg-muted h-6 rounded overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">85%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm w-32">Weekends</span>
                        <div className="flex-1 bg-muted h-6 rounded overflow-hidden">
                          <div className="bg-blue-200 h-full" style={{ width: '32%' }} />
                        </div>
                        <span className="text-sm text-muted-foreground w-12">32%</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        💡 <strong>Insight:</strong> Peak activity: Weekday evenings 6-9pm
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StudentAnalytics;
