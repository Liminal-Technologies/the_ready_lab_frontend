import { useAuth } from '@/hooks/useAuth';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { EducatorDashboard } from '@/pages/EducatorDashboard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminOverview } from '@/pages/admin/AdminOverview';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const DashboardRouter = () => {
  const { auth } = useAuth();

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card>
          <CardContent className="p-8 flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading your dashboard...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!auth.user) {
    return null; // Will be handled by auth check in main app
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