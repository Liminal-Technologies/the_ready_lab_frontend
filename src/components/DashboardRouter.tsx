import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { EducatorDashboard } from '@/pages/EducatorDashboard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminOverview } from '@/pages/admin/AdminOverview';
import { LoginPromptDialog } from '@/components/auth/LoginPromptDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';

export const DashboardRouter = () => {
  const { auth } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true);

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card>
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-primary animate-pulse" />
            </div>
            <span className="text-lg font-medium">Loading your dashboard...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to The Ready Lab</h2>
              <p className="text-muted-foreground mb-4">
                Sign in to access your personalized dashboard and continue your learning journey.
              </p>
            </CardContent>
          </Card>
        </div>
        <LoginPromptDialog
          open={showLoginPrompt}
          onOpenChange={setShowLoginPrompt}
          onLoginSuccess={() => setShowLoginPrompt(false)}
          title="Sign in to your Dashboard"
          description="Access your courses, certificates, and learning progress"
        />
      </>
    );
  }

  // Check if user has admin privileges
  const hasAdminRole = auth.user.admin_roles && auth.user.admin_roles.length > 0;
  const isAdmin = auth.user.role === 'admin';

  if (hasAdminRole || isAdmin) {
    return (
      <AdminLayout>
        <AdminOverview />
      </AdminLayout>
    );
  }

  switch (auth.user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'educator':
      return <EducatorDashboard />;
    default:
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Your account role is not recognized.</p>
            </CardContent>
          </Card>
        </div>
      );
  }
};