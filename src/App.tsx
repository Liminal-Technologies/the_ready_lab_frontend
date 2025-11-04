import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
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
import EventDetail from "./pages/EventDetail";
import { Settings } from "@/components/settings/Settings";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Products from "./pages/Products";
import ProductDownload from "./pages/ProductDownload";
import Pricing from "./pages/Pricing";
import EducatorProfileDemo from "./pages/EducatorProfileDemo";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import ForStudents from "./pages/ForStudents";
import ForEducators from "./pages/ForEducators";
import CustomSaaS from "./pages/CustomSaaS";
import Resources from "./pages/Resources";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import EducatorAgreement from "./pages/EducatorAgreement";
import Explore from "./pages/Explore";
import CommunityJoin from "./pages/CommunityJoin";
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
import MobileBottomNav from "@/components/MobileBottomNav";
import { AIChatWidget } from "@/components/ai/AIChatWidget";

const AppContent = () => {
  const { auth } = useAuth();

  console.log("AppContent auth state:", auth);

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
          <Route path="/for-students" element={<ForStudents />} />
          <Route path="/for-educators" element={<ForEducators />} />
          <Route path="/custom-saas" element={<CustomSaaS />} />
          <Route path="/custom" element={<CustomSaaS />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/educator-agreement" element={<EducatorAgreement />} />
          <Route path="/verify/:serial" element={<VerifyCertificate />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/community/join" element={<CommunityJoin />} />
          <Route path="/community/create" element={<CommunityCreate />} />
          <Route path="/community/:communityId" element={<CommunityDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id/download" element={<ProductDownload />} />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={<CourseLessonPlayer />}
          />
          <Route path="/educator-demo" element={<EducatorProfileDemo />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/feed" element={<LearningFeed />} />
          <Route path="/lesson/:lessonId" element={<LessonDetail />} />
          <Route path="/live/:eventId" element={<LiveStream />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/events/:eventId/live" element={<LiveEvent />} />
          <Route path="/educator/events/create" element={<CreateLiveEvent />} />
          <Route path="/educator/products/create" element={<CreateProduct />} />
          <Route path="/certificates" element={<MyCertificates />} />
          <Route
            path="/certificates/:certificateId"
            element={<CertificateView />}
          />
          <Route path="/my-purchases" element={<MyPurchases />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <AdminUsers />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/courses/*"
            element={
              <AdminLayout>
                <AdminCourses />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/communities"
            element={
              <AdminLayout>
                <AdminCommunities />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <AdminLayout>
                <AdminPayments />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/institutions"
            element={
              <AdminLayout>
                <AdminInstitutions />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/ai"
            element={
              <AdminLayout>
                <AdminAI />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/legal"
            element={
              <AdminLayout>
                <AdminLegal />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <AdminLayout>
                <AdminAuditLogs />
              </AdminLayout>
            }
          />

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
        <Route path="/for-students" element={<ForStudents />} />
        <Route path="/for-educators" element={<ForEducators />} />
        <Route path="/custom-saas" element={<CustomSaaS />} />
        <Route path="/custom" element={<CustomSaaS />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/educator-agreement" element={<EducatorAgreement />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/events/:eventId" element={<EventDetail />} />
        <Route path="/community/join" element={<CommunityJoin />} />
        <Route path="/community/create" element={<CommunityCreate />} />
        <Route path="/community/:communityId" element={<CommunityDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id/download" element={<ProductDownload />} />
        <Route path="/educator-demo" element={<EducatorProfileDemo />} />
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
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </TooltipProvider>
);

export default App;
