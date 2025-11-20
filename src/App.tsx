import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { DemoExperienceProvider } from "@/contexts/DemoExperienceContext";
import { DemoExperienceOverlay } from "@/components/DemoExperienceOverlay";
import { DashboardRouter } from "@/components/DashboardRouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminOverview } from "@/pages/admin/AdminOverview";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminCourses } from "@/pages/admin/AdminCourses";
import { AdminCommunities } from "@/pages/admin/AdminCommunities";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminPayments } from "@/pages/admin/AdminPayments";
import { AdminInstitutions } from "@/pages/admin/AdminInstitutions";
import { AdminAI } from "@/pages/admin/AdminAI";
import { AdminLegal } from "@/pages/admin/AdminLegal";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { AdminAuditLogs } from "@/pages/admin/AdminAuditLogs";
import CreateLiveEvent from "./pages/educator/CreateLiveEvent";
import CreateProduct from "./pages/educator/CreateProduct";
import StudentAnalytics from "./pages/educator/StudentAnalytics";
import RevenueDashboard from "./pages/educator/RevenueDashboard";
import EventDetail from "./pages/EventDetail";
import { Settings } from "@/components/settings/Settings";
import Index from "./pages/Index";
import CourseBrowse from "./pages/CourseBrowse";
import Products from "./pages/Products";
import ProductDownload from "./pages/ProductDownload";
import Pricing from "./pages/Pricing";
import EducatorProfileDemo from "./pages/EducatorProfileDemo";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import ForStudents from "./pages/ForStudents";
import ForEducators from "./pages/ForEducators";
import ForInstitutions from "./pages/ForInstitutions";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import CustomSaaS from "./pages/CustomSaaS";
import Solutions from "./pages/Solutions";
import Resources from "./pages/Resources";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import EducatorAgreement from "./pages/EducatorAgreement";
import Explore from "./pages/Explore";
import Community from "./pages/Community";
import CommunityFeed from "./pages/CommunityFeed";
import CommunityCreate from "./pages/CommunityCreate";
import CommunityDetail from "./pages/CommunityDetail";
import { LearningFeed } from "./pages/LearningFeed";
import { LessonDetail } from "./pages/LessonDetail";
import { MyCertificates } from "./pages/MyCertificates";
import CertificateView from "./pages/CertificateView";
import VerifyCertificate from "./pages/VerifyCertificate";
import MyPurchases from "./pages/MyPurchases";
import LiveStream from "./pages/LiveStream";
import LiveEvent from "./pages/LiveEvent";
import CourseLessonPlayer from "./pages/CourseLessonPlayer";
import CourseDetail from "./pages/CourseDetail";
import Onboarding from "./pages/Onboarding";
import EducatorOnboarding from "./pages/EducatorOnboarding";
import { EducatorDashboard } from "./pages/EducatorDashboard";
import { StudentDashboard } from "./pages/StudentDashboard";
import LiveEventBroadcaster from "./pages/LiveEventBroadcaster";
import ConfirmEmail from "./pages/ConfirmEmail";
import MobileBottomNav from "@/components/MobileBottomNav";
import { AIChatWidget } from "@/components/ai/AIChatWidget";



const AppContent = () => {
  const { auth } = useAuth();
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  console.log('AppContent auth state:', auth);
  
  // Show loading state while auth is being determined
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is authenticated, show both platform and dashboard routes
  if (auth.user) {
    return (
      <>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/for-students" element={<ForStudents />} />
          <Route path="/for-educators" element={<ForEducators />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/for-institutions" element={<Navigate to="/solutions" replace />} />
          <Route path="/custom-saas" element={<Navigate to="/solutions" replace />} />
          <Route path="/custom" element={<Navigate to="/solutions" replace />} />
          <Route path="/institution-demo" element={<InstitutionDashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/educator-agreement" element={<EducatorAgreement />} />
          <Route path="/verify/:serial" element={<VerifyCertificate />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community" element={<CommunityFeed />} />
          <Route path="/community/browse" element={<Community />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/community/create" element={<CommunityCreate />} />
          <Route path="/community/:communityId" element={<CommunityDetail />} />
          <Route path="/browse" element={<CourseBrowse />} />
          <Route path="/courses" element={<CourseBrowse />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id/download" element={<ProductDownload />} />
          <Route path="/courses/:courseId/lessons/:lessonId" element={<CourseLessonPlayer />} />
          <Route path="/educator-demo" element={<EducatorProfileDemo />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/student-view" element={<StudentDashboard />} />
          <Route path="/feed" element={<Community />} />
          <Route path="/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="/live/:eventId" element={<LiveStream />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/events/:eventId/live" element={<LiveEvent />} />
          <Route path="/educator/onboarding" element={<EducatorOnboarding />} />
          <Route path="/educator/dashboard" element={<EducatorDashboard />} />
          <Route path="/educator/events/:eventId/broadcast" element={<LiveEventBroadcaster />} />
          <Route path="/educator/events/create" element={<CreateLiveEvent />} />
          <Route path="/educator/products/create" element={<CreateProduct />} />
          <Route path="/educator/students" element={<StudentAnalytics />} />
          <Route path="/educator/revenue" element={<RevenueDashboard />} />
          <Route path="/certificates" element={<MyCertificates />} />
          <Route path="/certificates/:certificateId" element={<CertificateView />} />
          <Route path="/my-purchases" element={<MyPurchases />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={
          <AdminLayout>
            <AdminOverview />
          </AdminLayout>
        } />
        <Route path="/admin/users" element={
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        } />
        <Route path="/admin/courses/*" element={
          <AdminLayout>
            <AdminCourses />
          </AdminLayout>
        } />
        <Route path="/admin/communities" element={
          <AdminLayout>
            <AdminCommunities />
          </AdminLayout>
        } />
        <Route path="/admin/products" element={
          <AdminLayout>
            <AdminProducts />
          </AdminLayout>
        } />
        <Route path="/admin/payments" element={
          <AdminLayout>
            <AdminPayments />
          </AdminLayout>
        } />
        <Route path="/admin/institutions" element={
          <AdminLayout>
            <AdminInstitutions />
          </AdminLayout>
        } />
        <Route path="/admin/ai" element={
          <AdminLayout>
            <AdminAI />
          </AdminLayout>
        } />
        <Route path="/admin/legal" element={
          <AdminLayout>
            <AdminLegal />
          </AdminLayout>
        } />
        <Route path="/admin/settings" element={
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        } />
        <Route path="/admin/profile" element={
          <AdminLayout>
            <AdminSettings />
          </AdminLayout>
        } />
        <Route path="/admin/audit-logs" element={
          <AdminLayout>
            <AdminAuditLogs />
          </AdminLayout>
        } />
        
        <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatWidget />
        <MobileBottomNav />
      </>
    );
  }
  
  // Otherwise show public pages only
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/for-educators" element={<ForEducators />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/for-institutions" element={<Navigate to="/solutions" replace />} />
        <Route path="/custom-saas" element={<Navigate to="/solutions" replace />} />
        <Route path="/custom" element={<Navigate to="/solutions" replace />} />
        <Route path="/institution-demo" element={<InstitutionDashboard />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/educator-agreement" element={<EducatorAgreement />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/community" element={<CommunityFeed />} />
        <Route path="/community/browse" element={<Community />} />
        <Route path="/feed" element={<CommunityFeed />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/community/create" element={<CommunityCreate />} />
        <Route path="/community/:communityId" element={<CommunityDetail />} />
        <Route path="/browse" element={<CourseBrowse />} />
        <Route path="/courses" element={<CourseBrowse />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id/download" element={<ProductDownload />} />
        <Route path="/educator-demo" element={<EducatorProfileDemo />} />
        <Route path="/educator/onboarding" element={<EducatorOnboarding />} />
        <Route path="/educator/dashboard" element={<EducatorDashboard />} />
        <Route path="/educator/students" element={<StudentAnalytics />} />
        <Route path="/educator/revenue" element={<RevenueDashboard />} />
        <Route path="/live/:eventId" element={<LiveStream />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatWidget />
      <MobileBottomNav />
    </>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <TooltipProvider>
      <Sonner position="top-right" richColors />
      <AuthProvider>
        <DemoExperienceProvider>
          <AppContent />
        </DemoExperienceProvider>
      </AuthProvider>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
