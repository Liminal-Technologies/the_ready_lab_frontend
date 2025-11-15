import { useAuth } from '@/hooks/useAuth';
import { StudentSettings } from './StudentSettings';
import { EducatorSettings } from './EducatorSettings';
import { AdminSettings } from './AdminSettings';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const Settings = () => {
  const { auth } = useAuth();

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-neutral-900 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-neutral-900 dark:text-white">Loading settings...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!auth.user) {
    return null;
  }

  // Check if user has admin privileges
  const hasAdminRole = auth.user.admin_roles && auth.user.admin_roles.length > 0;
  const isAdmin = auth.user.role === 'admin';

  if (hasAdminRole || isAdmin) {
    return <AdminSettings />;
  }

  switch (auth.user.role) {
    case 'student':
      return <StudentSettings />;
    case 'educator':
      return <EducatorSettings />;
    default:
      return (
        <div className="min-h-screen bg-background dark:bg-neutral-900 flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">Access Denied</h2>
              <p className="text-muted-foreground">Your account role is not recognized.</p>
            </CardContent>
          </Card>
        </div>
      );
  }
};