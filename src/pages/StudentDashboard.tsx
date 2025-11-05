import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { WelcomeTour } from '@/components/onboarding/WelcomeTour';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCardSkeleton } from '@/components/skeletons/CourseCardSkeleton';
import { EmptyCertificates } from '@/components/empty-states/EmptyCertificates';
import { EmptyCourses } from '@/components/empty-states/EmptyCourses';
import { EmptyBookmarks } from '@/components/empty-states/EmptyBookmarks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { 
  Award, 
  BookOpen, 
  Bookmark, 
  Bell, 
  TrendingUp, 
  Play,
  Download,
  Share2,
  X,
  Trophy,
  Clock,
  Users,
  ChevronRight,
  Home,
  User,
  GraduationCap,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface Certification {
  id: string;
  courseTitle: string;
  completionDate: string;
  serialNumber: string;
  thumbnailUrl?: string;
}

interface Enrollment {
  id: string;
  track_id: string;
  progress_percentage: number;
  track: {
    title: string;
    thumbnail_url?: string;
  };
}

interface BookmarkedItem {
  id: string;
  bookmarkable_type: string;
  bookmarkable_id: string;
  created_at: string;
  lesson?: { title: string; module: { track: { title: string } } };
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link_url?: string;
  notification_type: string;
}

const MOCK_COURSES = [
  { id: '1', title: 'Startup Funding Strategies', category: 'Funding', price: 199, thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop', duration: '6 weeks', students: 1240 },
  { id: '2', title: 'Building Tech Infrastructure', category: 'Infrastructure', price: 299, thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', duration: '8 weeks', students: 892 },
  { id: '3', title: 'Brand Identity Mastery', category: 'Branding', price: 149, thumbnail: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop', duration: '4 weeks', students: 2150 },
  { id: '4', title: 'Financial Planning for Startups', category: 'Finance', price: 249, thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', duration: '5 weeks', students: 1680 },
  { id: '5', title: 'Legal Foundations for Founders', category: 'Legal', price: 199, thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', duration: '6 weeks', students: 980 },
  { id: '6', title: 'AI for Business Growth', category: 'AI', price: 349, thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', duration: '10 weeks', students: 3200 },
  { id: '7', title: 'Venture Capital Fundamentals', category: 'Funding', price: 179, thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop', duration: '5 weeks', students: 1450 },
  { id: '8', title: 'Marketing Strategy & Growth', category: 'Branding', price: 199, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', duration: '6 weeks', students: 2890 },
];

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { auth } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState<typeof MOCK_COURSES>([]);

  useEffect(() => {
    fetchDashboardData();
    loadMockCertificates();
    loadRecommendedCourses();
  }, []);

  const loadRecommendedCourses = () => {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const { interests } = JSON.parse(onboardingData);
      const filtered = MOCK_COURSES.filter(course => 
        interests.includes(course.category)
      ).slice(0, 4);
      setRecommendedCourses(filtered);
    } else {
      setRecommendedCourses(MOCK_COURSES.slice(0, 4));
    }
  };

  const loadMockCertificates = () => {
    const storedCerts = localStorage.getItem('mockCertificates');
    if (!storedCerts) {
      const mockCerts: Certification[] = [
        {
          id: 'cert-1',
          courseTitle: 'Advanced React Development & Best Practices',
          completionDate: new Date().toISOString(),
          serialNumber: 'TRL-A1B2-C3D4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop'
        },
        {
          id: 'cert-2',
          courseTitle: 'Full-Stack Web Development Bootcamp',
          completionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          serialNumber: 'TRL-E5F6-G7H8',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop'
        }
      ];
      localStorage.setItem('mockCertificates', JSON.stringify(mockCerts));
      setCertifications(mockCerts);
    } else {
      setCertifications(JSON.parse(storedCerts));
    }
  };

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: enroll } = await supabase
        .from('enrollments')
        .select('*, track:tracks(title, thumbnail_url)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      const { data: bookmarked } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('bookmarkable_type', 'lesson')
        .order('created_at', { ascending: false })
        .limit(10);

      const bookmarksWithLessons = await Promise.all(
        (bookmarked || []).map(async (bookmark) => {
          const { data: lesson } = await supabase
            .from('lessons')
            .select('title, module:modules(track:tracks(title))')
            .eq('id', bookmark.bookmarkable_id)
            .single();
          
          return { ...bookmark, lesson };
        })
      );

      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      setEnrollments(enroll || []);
      setBookmarks(bookmarksWithLessons || []);
      setNotifications(notifs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notifId);
    
    setNotifications(prev => 
      prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
    );
  };

  const removeBookmark = async (bookmarkId: string) => {
    await supabase.from('bookmarks').delete().eq('id', bookmarkId);
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    toast({ title: 'Bookmark removed' });
  };

  const totalHours = enrollments.reduce((acc, e) => acc + (e.progress_percentage / 100) * 40, 0);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeTour />
      
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8" data-testid="breadcrumb-nav">
          <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Dashboard</span>
        </nav>

        {/* Header with Profile */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-3">Welcome back, {auth.user?.full_name || 'Student'}!</h1>
            <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
          </div>
          <Button 
            onClick={() => navigate('/settings')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            data-testid="button-profile"
          >
            <User className="h-4 w-4 mr-2" />
            Profile
          </Button>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted" data-tour="navigation" data-testid="dashboard-tabs">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3" data-testid="tab-overview">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 py-3" data-testid="tab-courses">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">My Courses</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2 py-3" data-testid="tab-certificates">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center gap-2 py-3" data-testid="tab-bookmarks">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2 py-3 relative" data-testid="tab-activity">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{enrollments.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {enrollments.filter(e => e.progress_percentage > 0).length} in progress
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Certificates Earned</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{certifications.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All verified achievements
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(totalHours)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total hours invested
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            {enrollments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Continue Learning
                  </CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {enrollments.slice(0, 3).map((enrollment) => (
                      <Card key={enrollment.id} className="bg-accent/30 hover:bg-accent/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {enrollment.track.thumbnail_url && (
                              <img
                                src={enrollment.track.thumbnail_url}
                                alt={enrollment.track.title}
                                className="w-24 h-24 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold mb-2">{enrollment.track.title}</h3>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">{enrollment.progress_percentage}%</span>
                                </div>
                                <Progress value={enrollment.progress_percentage} />
                              </div>
                              <Button 
                                size="sm" 
                                className="mt-3 bg-primary hover:bg-primary/90"
                                onClick={() => navigate(`/courses/${enrollment.track_id}`)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Continue
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended Courses */}
            {recommendedCourses.length > 0 && (
              <Card data-tour="recommended-courses">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Based on your selected interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendedCourses.map((course) => (
                      <Card 
                        key={course.id} 
                        className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate(`/courses/${course.id}`)}
                        data-testid={`course-recommendation-${course.id}`}
                      >
                        <div className="relative aspect-video">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-2 right-2 bg-primary">
                            {course.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{course.duration}</span>
                            </div>
                            <span className="text-lg font-bold text-primary">${course.price}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/courses')}
                    data-testid="button-explore-more"
                  >
                    Explore More Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Courses Tab */}
          <TabsContent value="courses" className="space-y-6" data-tour="my-courses">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  My Enrolled Courses
                </CardTitle>
                <CardDescription>
                  {enrollments.length} {enrollments.length === 1 ? 'course' : 'courses'} in progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </div>
                ) : enrollments.length === 0 ? (
                  <EmptyCourses />
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
                          {enrollment.track.thumbnail_url && (
                            <img
                              src={enrollment.track.thumbnail_url}
                              alt={enrollment.track.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3 line-clamp-2">{enrollment.track.title}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{enrollment.progress_percentage}%</span>
                            </div>
                            <Progress value={enrollment.progress_percentage} />
                          </div>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => navigate(`/courses/${enrollment.track_id}`)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  My Certificates
                </CardTitle>
                <CardDescription>
                  {certifications.length} {certifications.length === 1 ? 'certificate' : 'certificates'} earned
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </div>
                ) : certifications.length === 0 ? (
                  <EmptyCertificates />
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certifications.map((cert) => (
                      <Card 
                        key={cert.id} 
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                        onClick={() => navigate(`/certificates/${cert.id}`)}
                      >
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          {cert.thumbnailUrl ? (
                            <img 
                              src={cert.thumbnailUrl} 
                              alt={cert.courseTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-center p-6">
                              <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                              <p className="text-sm font-medium text-primary">Certificate</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white">
                              ✓ Verified
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {cert.courseTitle}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <span>
                              {new Date(cert.completionDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="font-mono text-xs">{cert.serialNumber}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/certificates/${cert.id}`);
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Share to LinkedIn",
                                  description: "LinkedIn sharing coming soon!",
                                });
                              }}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  My Bookmarks
                </CardTitle>
                <CardDescription>
                  {bookmarks.length} saved {bookmarks.length === 1 ? 'lesson' : 'lessons'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookmarks.length === 0 ? (
                  <EmptyBookmarks />
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bookmarks.map((bookmark) => (
                      <Card 
                        key={bookmark.id}
                        className="group hover:shadow-md transition-all cursor-pointer"
                        onClick={() => navigate('/courses')}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <Bookmark className="h-5 w-5 text-primary shrink-0" />
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBookmark(bookmark.id);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {bookmark.lesson?.title || 'Untitled Lesson'}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {bookmark.lesson?.module?.track?.title}
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full mt-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/courses');
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Go to Lesson
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notif) => (
                        <Card
                          key={notif.id}
                          className={`p-4 cursor-pointer transition-colors ${
                            !notif.is_read
                              ? 'bg-primary/5 border-primary/20'
                              : 'bg-accent/30 hover:bg-accent/50'
                          }`}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link_url) navigate(notif.link_url);
                          }}
                        >
                          <div className="flex gap-3">
                            <Bell className={`h-5 w-5 shrink-0 ${!notif.is_read ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold mb-1 flex items-center gap-2">
                                {notif.title}
                                {!notif.is_read && (
                                  <Badge variant="default" className="text-xs">New</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(notif.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
