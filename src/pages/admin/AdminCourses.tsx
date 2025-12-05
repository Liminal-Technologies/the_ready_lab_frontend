import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Eye,
  Award,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  GraduationCap,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  created_by: string;
  price: number;
  is_active: boolean;
  estimated_hours: number;
  created_at: string;
  _count?: {
    enrollments: number;
    modules: number;
  };
}

const mockCertificates = [
  { id: 1, studentName: "Alex Morgan", courseName: "Business Fundamentals", completedAt: "2024-12-04", score: 94 },
  { id: 2, studentName: "Jordan Lee", courseName: "Digital Marketing Mastery", completedAt: "2024-12-03", score: 88 },
  { id: 3, studentName: "Taylor Kim", courseName: "Financial Planning", completedAt: "2024-12-02", score: 92 },
  { id: 4, studentName: "Morgan Chen", courseName: "Leadership Excellence", completedAt: "2024-12-01", score: 96 },
  { id: 5, studentName: "Casey Williams", courseName: "Operations Management", completedAt: "2024-11-30", score: 85 },
];

const topCertifiedCourses = [
  { name: "Business Fundamentals", certificates: 234, completionRate: 78 },
  { name: "Digital Marketing Mastery", certificates: 189, completionRate: 72 },
  { name: "Financial Planning", certificates: 156, completionRate: 81 },
  { name: "Leadership Excellence", certificates: 142, completionRate: 75 },
  { name: "Operations Management", certificates: 152, completionRate: 69 },
];

export function AdminCourses() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/certificates')) return 'certificates';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'overview') {
      navigate('/admin/courses');
    } else {
      navigate(`/admin/courses/${value}`);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  useEffect(() => {
    filterTracks();
  }, [tracks, searchTerm]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          enrollments(count),
          modules(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTracks = () => {
    let filtered = tracks;

    if (searchTerm) {
      filtered = filtered.filter(track => 
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTracks(filtered);
  };

  const getStatusBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Published" : "Draft"}
    </Badge>
  );

  const getLevelBadge = (level: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    };
    return (
      <Badge className={colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const analyticsData = {
    totalCourses: 45,
    certificatesCompleted: 873,
    totalEnrollments: 3247,
    completionRate: 68
  };

  const mockCourses = [
    { id: "1", title: "Business Fundamentals", description: "Core business concepts for entrepreneurs", level: "beginner", category: "Business", is_active: true, estimated_hours: 12, price: 99, created_at: "2024-10-01", _count: { enrollments: 342, modules: 8 } },
    { id: "2", title: "Digital Marketing Mastery", description: "Complete digital marketing strategies", level: "intermediate", category: "Marketing", is_active: true, estimated_hours: 18, price: 149, created_at: "2024-09-15", _count: { enrollments: 289, modules: 12 } },
    { id: "3", title: "Financial Planning & Analysis", description: "Master financial planning and budgeting", level: "intermediate", category: "Finance", is_active: true, estimated_hours: 15, price: 129, created_at: "2024-08-20", _count: { enrollments: 234, modules: 10 } },
    { id: "4", title: "Leadership Excellence", description: "Develop effective leadership skills", level: "advanced", category: "Leadership", is_active: true, estimated_hours: 20, price: 199, created_at: "2024-07-10", _count: { enrollments: 198, modules: 14 } },
    { id: "5", title: "Operations Management", description: "Streamline business operations", level: "intermediate", category: "Operations", is_active: true, estimated_hours: 14, price: 119, created_at: "2024-06-05", _count: { enrollments: 176, modules: 9 } },
  ];

  const displayTracks = (() => {
    const dataSource = tracks.length > 0 ? filteredTracks : mockCourses;
    if (tracks.length === 0 && searchTerm) {
      return mockCourses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return dataSource;
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Courses & Certificates</h1>
        <p className="text-muted-foreground">
          Platform-wide course analytics and certificate tracking
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+3</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.certificatesCompleted.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+47</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+156</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 dark:text-green-400">+2.1%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-courses"
                />
              </div>
            </CardContent>
          </Card>

          {/* Courses Table - Read Only */}
          <Card>
            <CardHeader>
              <CardTitle>All Courses ({displayTracks.length})</CardTitle>
              <CardDescription>
                View course performance and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                {searchTerm && displayTracks.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                    <p className="text-muted-foreground">No courses match "{searchTerm}"</p>
                  </div>
                ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrollments</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayTracks.map((track) => (
                      <TableRow key={track.id} data-testid={`row-course-${track.id}`}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{track.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {track.description}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {track.estimated_hours}h
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getLevelBadge(track.level)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{track.category}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(track.is_active)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {track._count?.enrollments || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {track.price > 0 ? `$${track.price}` : 'Free'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" data-testid={`button-view-course-${track.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Phase 2 Notice */}
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium">Course Approval Workflow</h3>
                  <p className="text-sm text-muted-foreground">
                    Course approval and publishing controls will be available in Phase 2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          {/* Certificate Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">47</div>
                <p className="text-xs text-muted-foreground">Certificates issued</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">183</div>
                <p className="text-xs text-muted-foreground">Certificates issued</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">All Time</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">873</div>
                <p className="text-xs text-muted-foreground">Total certificates</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Certificates</CardTitle>
              <CardDescription>Latest course completions and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCertificates.map((cert) => (
                    <TableRow key={cert.id} data-testid={`row-certificate-${cert.id}`}>
                      <TableCell className="font-medium">{cert.studentName}</TableCell>
                      <TableCell>{cert.courseName}</TableCell>
                      <TableCell>{new Date(cert.completedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={cert.score >= 90 ? "default" : "secondary"}>
                          {cert.score}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" data-testid={`button-view-certificate-${cert.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Certified Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Certified Courses</CardTitle>
              <CardDescription>Courses with the most certificate completions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Certificates</TableHead>
                    <TableHead>Completion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCertifiedCourses.map((course, index) => (
                    <TableRow key={index} data-testid={`row-top-course-${index}`}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          {course.certificates}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${course.completionRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{course.completionRate}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
