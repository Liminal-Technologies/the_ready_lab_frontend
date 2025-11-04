import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import LearningDashboard from '@/components/LearningDashboard';
import { WelcomeTour } from '@/components/onboarding/WelcomeTour';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CourseCardSkeleton } from '@/components/skeletons/CourseCardSkeleton';
import { EmptyCertificates } from '@/components/empty-states/EmptyCertificates';
import { EmptyCourses } from '@/components/empty-states/EmptyCourses';
import { EmptyBookmarks } from '@/components/empty-states/EmptyBookmarks';
import { EmptyNotifications } from '@/components/empty-states/EmptyNotifications';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  BookOpen, 
  Bookmark, 
  Bell, 
  TrendingUp, 
  Calendar,
  Play,
  Download,
  Share2,
  X,
  Trophy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

// Mock courses for recommendations
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
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState<typeof MOCK_COURSES>([]);

  useEffect(() => {
    fetchDashboardData();
    loadMockCertificates();
    loadRecommendedCourses();
  }, []);

  const loadRecommendedCourses = () => {
    // Get interests from onboarding data
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      const { interests } = JSON.parse(onboardingData);
      // Filter courses by selected interests
      const filtered = MOCK_COURSES.filter(course => 
        interests.includes(course.category)
      ).slice(0, 4); // Show max 4 recommended courses
      setRecommendedCourses(filtered);
    } else {
      // Show default recommendations if no interests selected
      setRecommendedCourses(MOCK_COURSES.slice(0, 4));
    }
  };

  const loadMockCertificates = () => {
    // Get certificates from localStorage or create mock ones
    const storedCerts = localStorage.getItem('mockCertificates');
    if (!storedCerts) {
      // Create 2 mock certificates for prototype
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

      // Fetch enrollments with progress
      const { data: enroll } = await supabase
        .from('enrollments')
        .select('*, track:tracks(title, thumbnail_url)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false });

      // Fetch bookmarks
      const { data: bookmarked } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('bookmarkable_type', 'lesson')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch lesson details for bookmarks
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

      // Fetch notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

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

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <WelcomeTour />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and outcomes</p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={() => navigate('/feed')} variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Explore Feed
            </Button>
            <Button 
              variant="outline" 
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* My Certificates Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      My Certificates
                    </CardTitle>
                    {certifications.length > 0 && (
                      <Badge variant="secondary">{certifications.length}</Badge>
                    )}
                  </div>
                  {certifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => navigate('/certificates')}>
                      View All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </div>
                ) : certifications.length === 0 ? (
                  <EmptyCertificates />
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
                              View Certificate
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast({
                                  title: "Share Certificate",
                                  description: "Share options coming soon!",
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

            {/* Recommended for You Section */}
            {recommendedCourses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Based on your selected interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
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
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-3 w-3" />
                              <span>{course.students.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">${course.price}</span>
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/courses/${course.id}`);
                              }}
                              data-testid={`button-view-course-${course.id}`}
                            >
                              View Course
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/explore')}
                    data-testid="button-explore-more"
                  >
                    Explore More Courses
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Progress Tracker Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  My Progress
                </CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </div>
                ) : enrollments.length === 0 ? (
                  <EmptyCourses />
                ) : (
                  <div className="space-y-4">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="bg-accent/30">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {enrollment.track.thumbnail_url && (
                              <img
                                src={enrollment.track.thumbnail_url}
                                alt={enrollment.track.title}
                                className="w-20 h-20 rounded object-cover"
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
                                className="mt-3"
                                onClick={() => navigate(`/courses`)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bookmarks Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-primary" />
                  My Bookmarks
                </CardTitle>
                <CardDescription>Saved lessons and resources</CardDescription>
              </CardHeader>
              <CardContent>
                {bookmarks.length === 0 ? (
                  <EmptyBookmarks />
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map((bookmark) => (
                      <div 
                        key={bookmark.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{bookmark.lesson?.title || 'Untitled'}</p>
                          <p className="text-sm text-muted-foreground">
                            {bookmark.lesson?.module?.track?.title}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeBookmark(bookmark.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Dashboard Section */}
            <div className="mt-6">
              <LearningDashboard />
            </div>
          </div>

          {/* Sidebar - Notifications (Desktop) */}
          <div className="lg:block hidden">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {notifications.length === 0 ? (
                    <EmptyNotifications />
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            notif.is_read 
                              ? 'bg-background' 
                              : 'bg-accent/50 border-primary/20'
                          }`}
                          onClick={() => {
                            markNotificationRead(notif.id);
                            if (notif.link_url) navigate(notif.link_url);
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{notif.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {notif.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notif.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 rounded-full bg-primary" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Notifications Panel */}
        {showNotifications && (
          <div className="lg:hidden fixed inset-0 bg-background/95 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-100px)]">
              {notifications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No notifications yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <Card 
                      key={notif.id}
                      className={notif.is_read ? '' : 'border-primary/20'}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link_url) navigate(notif.link_url);
                        setShowNotifications(false);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{notif.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(notif.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
