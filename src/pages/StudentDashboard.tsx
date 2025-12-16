import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { WelcomeTour } from '@/components/onboarding/WelcomeTour';
import { PageBreadcrumb } from '@/components/PageBreadcrumb';
import { SuggestedActions, SuggestedAction } from '@/components/dashboard/SuggestedActions';
import confetti from 'canvas-confetti';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
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
  Activity,
  Upload,
  Camera,
  Trash2,
  Star,
  Video,
  Package,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllPublishedProducts, 
  getProductPurchasesByStudent,
  createProductPurchase,
  type DigitalProduct,
  type ProductPurchase
} from '@/utils/educatorProductsStorage';
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
  { 
    id: '1', 
    title: 'Startup Funding Strategies', 
    category: 'Funding', 
    price: 199, 
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop', 
    duration: '6 weeks', 
    students: 1240,
    instructor: 'Sarah Chen',
    description: 'Master the art of raising capital and securing funding for your startup.',
    matchScore: 95
  },
  { 
    id: '2', 
    title: 'Building Tech Infrastructure', 
    category: 'Infrastructure', 
    price: 299, 
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop', 
    duration: '8 weeks', 
    students: 892,
    instructor: 'Michael Rodriguez',
    description: 'Learn how to build scalable and reliable technical infrastructure.',
    matchScore: 88
  },
  { 
    id: '3', 
    title: 'Brand Identity Mastery', 
    category: 'Branding', 
    price: 149, 
    thumbnail: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=300&fit=crop', 
    duration: '4 weeks', 
    students: 2150,
    instructor: 'Emma Wilson',
    description: 'Create a memorable brand that resonates with your target audience.',
    matchScore: 92
  },
  { 
    id: '4', 
    title: 'Financial Planning for Startups', 
    category: 'Finance', 
    price: 249, 
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', 
    duration: '5 weeks', 
    students: 1680,
    instructor: 'David Park',
    description: 'Develop solid financial strategies to ensure long-term success.',
    matchScore: 87
  },
  { 
    id: '5', 
    title: 'Legal Foundations for Founders', 
    category: 'Legal', 
    price: 199, 
    thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop', 
    duration: '6 weeks', 
    students: 980,
    instructor: 'Jennifer Thompson',
    description: 'Navigate legal requirements and protect your business interests.',
    matchScore: 90
  },
  { 
    id: '6', 
    title: 'AI for Business Growth', 
    category: 'AI', 
    price: 349, 
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop', 
    duration: '10 weeks', 
    students: 3200,
    instructor: 'Dr. James Lee',
    description: 'Leverage AI and machine learning to accelerate business growth.',
    matchScore: 94
  },
  { 
    id: '7', 
    title: 'Venture Capital Fundamentals', 
    category: 'Funding', 
    price: 179, 
    thumbnail: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=300&fit=crop', 
    duration: '5 weeks', 
    students: 1450,
    instructor: 'Lisa Martinez',
    description: 'Understand VC funding processes and pitch your startup effectively.',
    matchScore: 91
  },
  { 
    id: '8', 
    title: 'Marketing Strategy & Growth', 
    category: 'Branding', 
    price: 199, 
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', 
    duration: '6 weeks', 
    students: 2890,
    instructor: 'Ryan Johnson',
    description: 'Design and execute marketing strategies that drive real growth.',
    matchScore: 89
  },
];

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { auth } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [myPurchases, setMyPurchases] = useState<ProductPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedCourses, setRecommendedCourses] = useState<typeof MOCK_COURSES>([]);
  
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removePhotoDialogOpen, setRemovePhotoDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    loadMockCertificates();
    loadRecommendedCourses();
    loadProfilePhoto();
  }, []);

  const loadProfilePhoto = () => {
    const storedPhoto = localStorage.getItem('profilePhoto');
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
    }
  };

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

      // Fetch enrollments with track data via API
      const enrollResponse = await api.enrollments.listByUser(user.id, {
        status: 'active',
        include: ['track'],
      });

      // Fetch bookmarks with lesson details via API
      const bookmarksResponse = await api.bookmarks.list(user.id, {
        type: 'lesson',
        include: ['details'],
        limit: 10,
      });

      // Map bookmarks to expected format
      const bookmarksWithLessons = (bookmarksResponse.data || []).map((bookmark: any) => ({
        ...bookmark,
        lesson: bookmark.item ? {
          title: bookmark.item.title,
          module: bookmark.item.module ? {
            track: bookmark.item.module.track ? { title: bookmark.item.module.track.title } : undefined
          } : undefined
        } : undefined
      }));

      // Fetch notifications via API
      const notifs = await api.notifications.list(user.id);

      // Map enrollments to expected format
      const mappedEnrollments = (enrollResponse.data || []).map((e: any) => ({
        id: e.id,
        track_id: e.trackId || e.track_id,
        progress_percentage: e.progressPercentage || e.progress_percentage || 0,
        track: e.track || { title: 'Unknown Track' },
      }));

      setEnrollments(mappedEnrollments);
      setBookmarks(bookmarksWithLessons);
      setNotifications(notifs || []);

      const publishedProducts = getAllPublishedProducts();
      setProducts(publishedProducts);

      const studentId = user.id || 'demo-student';
      const purchases = getProductPurchasesByStudent(studentId);
      setMyPurchases(purchases);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationRead = async (notifId: string) => {
    try {
      await api.notifications.markRead(notifId);
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    try {
      await api.bookmarks.delete(bookmarkId);
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      toast({ title: 'Bookmark removed' });
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast({ title: 'Error removing bookmark', variant: 'destructive' });
    }
  };

  const handleCertificateClick = (cert: Certification) => {
    setSelectedCertificate(cert);
    setCertificateModalOpen(true);
  };

  const handleDownloadCertificate = () => {
    // Trigger confetti celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Confetti from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    toast({
      title: '🎉 Certificate downloaded successfully!',
      description: 'Your certificate has been saved to your downloads folder.',
    });
  };

  const handleShareLinkedIn = () => {
    toast({
      title: 'Opening LinkedIn share...',
      description: 'Redirecting you to LinkedIn to share your achievement.',
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePhoto = () => {
    if (previewPhoto) {
      setProfilePhoto(previewPhoto);
      localStorage.setItem('profilePhoto', previewPhoto);
      setPreviewPhoto(null);
      setSelectedFile(null);
      toast({
        title: 'Profile photo updated',
        description: 'Your profile photo has been successfully updated.',
      });
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPreviewPhoto(null);
    setSelectedFile(null);
    localStorage.removeItem('profilePhoto');
    setRemovePhotoDialogOpen(false);
    toast({
      title: 'Profile photo removed',
      description: 'Your profile photo has been removed.',
    });
  };

  const handleEnrollNow = (courseTitle: string) => {
    toast({
      title: 'Enrolling in course',
      description: `You're being enrolled in "${courseTitle}". Redirecting to checkout...`,
    });
  };

  const totalHours = enrollments.reduce((acc, e) => acc + (e.progress_percentage / 100) * 40, 0);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Suggested actions for student journey
  const suggestedActions: SuggestedAction[] = [
    {
      icon: GraduationCap,
      title: "Explore New Courses",
      description: "Discover courses in business, technology, creative arts, and more to expand your skills.",
      ctaText: "Browse Catalog",
      ctaLink: "/courses",
      badge: "Popular",
    },
    {
      icon: Users,
      title: "Join a Community",
      description: "Connect with fellow learners, share insights, and participate in discussions.",
      ctaText: "Explore Communities",
      ctaLink: "/community",
    },
    {
      icon: Video,
      title: "Attend Live Events",
      description: "Join upcoming workshops, webinars, and Q&A sessions with industry experts.",
      ctaText: "View Events",
      ctaLink: "/courses",
      badge: "New",
    },
    {
      icon: Trophy,
      title: "Earn Your Certificate",
      description: "Complete your enrolled courses to earn professional certificates you can share.",
      ctaText: "View Progress",
      ctaLink: "#",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeTour />
      
      <div className="container mx-auto px-4 py-16">
        {/* Breadcrumb Navigation */}
        <PageBreadcrumb className="mb-8" />

        {/* Profile Photo Section */}
        <Card className="mb-8" data-testid="profile-section">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-primary/20" data-testid="avatar-current">
                  <AvatarImage src={previewPhoto || profilePhoto || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {auth.user?.full_name?.charAt(0) || 'S'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="button-upload-photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-photo-upload"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{auth.user?.full_name || 'Student'}</h2>
                <p className="text-muted-foreground mb-4">{auth.user?.email || 'student@example.com'}</p>
                <div className="flex gap-2">
                  {previewPhoto && (
                    <Button
                      size="sm"
                      onClick={handleSavePhoto}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-save-photo"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Save Photo
                    </Button>
                  )}
                  {profilePhoto && !previewPhoto && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setRemovePhotoDialogOpen(true)}
                      data-testid="button-remove-photo"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/settings')}
                    data-testid="button-edit-profile"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header with Welcome */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Welcome back, {auth.user?.full_name || 'Student'}!</h1>
          <p className="text-lg text-muted-foreground">Track your progress and continue learning</p>
        </div>

        {/* Suggested Next Actions */}
        <SuggestedActions 
          actions={suggestedActions}
          title="Suggested Next Steps"
          description="Continue your learning journey with these recommended actions"
        />

        {/* Tab Navigation */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-muted" data-tour="navigation" data-testid="dashboard-tabs">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3" data-testid="tab-overview">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2 py-3" data-testid="tab-courses">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">My Courses</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2 py-3" data-testid="tab-products">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Products</span>
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
                        className="overflow-hidden hover:shadow-lg transition-all group"
                        data-testid={`card-recommendation-${course.id}`}
                      >
                        <div className="relative aspect-video">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            data-testid={`img-course-${course.id}`}
                          />
                          <Badge className="absolute top-2 left-2 bg-green-600 text-white flex items-center gap-1">
                            <Star className="h-3 w-3 fill-white" />
                            {course.matchScore}% Match
                          </Badge>
                          <Badge className="absolute top-2 right-2 bg-primary" data-testid={`badge-category-${course.id}`}>
                            {course.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-course-title-${course.id}`}>
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`text-instructor-${course.id}`}>
                            by {course.instructor}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2" data-testid={`text-description-${course.id}`}>
                            {course.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{course.duration}</span>
                            </div>
                            <span className="text-lg font-bold text-primary" data-testid={`text-price-${course.id}`}>${course.price}</span>
                          </div>
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEnrollNow(course.title);
                            }}
                            data-testid={`button-enroll-${course.id}`}
                          >
                            Enroll Now
                          </Button>
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

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Digital Products
                </CardTitle>
                <CardDescription>
                  Browse and download digital products from educators
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products available</h3>
                    <p className="text-muted-foreground mb-4">
                      Check back later for new digital products from our educators
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const isPurchased = myPurchases.some(p => p.productId === product.id);
                      const isFree = product.pricing.type === 'free';
                      const canDownload = isPurchased || isFree;
                      
                      const handleGetProduct = () => {
                        if (isFree && !isPurchased) {
                          createProductPurchase({
                            productId: product.id,
                            productTitle: product.title,
                            studentId: auth.user?.id || 'demo-student',
                            studentName: auth.user?.full_name || 'Student',
                            studentEmail: auth.user?.email || 'student@demo.com',
                            amount: 0,
                          });
                          setMyPurchases(getProductPurchasesByStudent(auth.user?.id || 'demo-student'));
                          toast({
                            title: "Product Added",
                            description: `${product.title} has been added to your library.`,
                          });
                        } else if (!isFree && !isPurchased) {
                          toast({
                            title: "Purchase Required",
                            description: `This product costs $${product.pricing.amount}. Purchases will be available soon.`,
                          });
                        }
                      };

                      const handleDownload = () => {
                        if (product.file?.url) {
                          window.open(product.file.url, '_blank');
                          toast({
                            title: "Download Started",
                            description: `Downloading ${product.file.name}`,
                          });
                        }
                      };

                      return (
                        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`product-card-${product.id}`}>
                          {product.thumbnail && (
                            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5">
                              <img
                                src={product.thumbnail}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                              {isFree ? (
                                <Badge className="bg-green-500 text-xs">Free</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">${product.pricing.amount}</Badge>
                              )}
                            </div>
                            <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                              <FileText className="h-3 w-3" />
                              <span>{product.file.name}</span>
                            </div>
                            {canDownload ? (
                              <Button 
                                className="w-full bg-primary hover:bg-primary/90"
                                onClick={handleDownload}
                                data-testid={`button-download-${product.id}`}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            ) : (
                              <Button 
                                className="w-full"
                                onClick={handleGetProduct}
                                data-testid={`button-get-${product.id}`}
                              >
                                {isFree ? 'Get Free' : `Buy for $${product.pricing.amount}`}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
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
                        onClick={() => handleCertificateClick(cert)}
                        data-testid={`card-certificate-${cert.id}`}
                      >
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          {cert.thumbnailUrl ? (
                            <img 
                              src={cert.thumbnailUrl} 
                              alt={cert.courseTitle}
                              className="w-full h-full object-cover"
                              data-testid={`img-certificate-${cert.id}`}
                            />
                          ) : (
                            <div className="text-center p-6">
                              <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                              <p className="text-sm font-medium text-primary">Certificate</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-green-500 text-white" data-testid={`badge-verified-${cert.id}`}>
                              ✓ Verified
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors" data-testid={`text-cert-title-${cert.id}`}>
                            {cert.courseTitle}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <span data-testid={`text-cert-date-${cert.id}`}>
                              {new Date(cert.completionDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            <span className="font-mono text-xs" data-testid={`text-cert-id-${cert.id}`}>{cert.serialNumber}</span>
                          </div>
                          <Button 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCertificateClick(cert);
                            }}
                            data-testid={`button-view-certificate-${cert.id}`}
                          >
                            <Award className="h-4 w-4 mr-2" />
                            View Certificate
                          </Button>
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

      {/* Certificate Modal */}
      <Dialog open={certificateModalOpen} onOpenChange={setCertificateModalOpen}>
        <DialogContent className="max-w-3xl" data-testid="modal-certificate">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Certificate of Completion
            </DialogTitle>
            <DialogDescription>
              Your verified achievement certificate
            </DialogDescription>
          </DialogHeader>
          
          {selectedCertificate && (
            <div className="space-y-6">
              {/* Certificate Preview */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-background to-primary/5 border-2 border-primary/20 rounded-lg overflow-hidden">
                {selectedCertificate.thumbnailUrl ? (
                  <img
                    src={selectedCertificate.thumbnailUrl}
                    alt="Certificate Preview"
                    className="w-full h-full object-cover"
                    data-testid="img-certificate-preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <Award className="h-24 w-24 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Certificate of Completion</h3>
                      <p className="text-lg text-muted-foreground">The Ready Lab</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white text-sm px-3 py-1">
                    ✓ Verified
                  </Badge>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="grid gap-4 bg-accent/30 p-6 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Course Name</label>
                  <p className="text-lg font-semibold mt-1" data-testid="text-modal-course-name">
                    {selectedCertificate.courseTitle}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                    <p className="text-base font-medium mt-1" data-testid="text-modal-issue-date">
                      {new Date(selectedCertificate.completionDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Certificate ID</label>
                    <p className="text-base font-mono font-medium mt-1" data-testid="text-modal-certificate-id">
                      {selectedCertificate.serialNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <DialogFooter className="flex gap-2 sm:gap-2">
                <Button
                  onClick={handleDownloadCertificate}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  data-testid="button-modal-download"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleShareLinkedIn}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-modal-share-linkedin"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Remove Photo Confirmation Dialog */}
      <ConfirmDialog
        open={removePhotoDialogOpen}
        onOpenChange={setRemovePhotoDialogOpen}
        title="Remove Profile Photo"
        description="Are you sure you want to remove your profile photo? This action cannot be undone."
        confirmText="Remove Photo"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleRemovePhoto}
      />
    </div>
  );
};
