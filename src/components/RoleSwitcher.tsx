import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useMockAuth, type MockUserRole } from '@/hooks/useMockAuth';
import { useNavigate } from 'react-router-dom';
import { UserCog, Users, GraduationCap, BookOpen, Shield, Building2 } from 'lucide-react';

const roleIcons: Record<MockUserRole, React.ReactNode> = {
  super_admin: <Shield className="h-4 w-4" />,
  admin: <UserCog className="h-4 w-4" />,
  educator: <GraduationCap className="h-4 w-4" />,
  student: <BookOpen className="h-4 w-4" />,
};

const roleLabels: Record<MockUserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  educator: 'Educator',
  student: 'Student',
};

const roleRoutes: Record<MockUserRole, string> = {
  super_admin: '/admin',
  admin: '/admin',
  educator: '/educator/dashboard',
  student: '/dashboard',
};

export function RoleSwitcher() {
  const { user, isDemo, login, logout } = useMockAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleSwitch = (role: MockUserRole) => {
    login(role);
    navigate(roleRoutes[role]);
    setIsOpen(false);
  };

  const handleEnterDemo = (role: MockUserRole) => {
    login(role);
    navigate(roleRoutes[role]);
    setIsOpen(false);
  };

  const handleEnterInstitutionDemo = () => {
    navigate('/institution-demo');
    setIsOpen(false);
  };

  const handleExitDemo = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Show different UI based on demo mode state
  if (!isDemo) {
    // Entry point to demo mode - always visible
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2"
            data-testid="button-enter-demo"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Try Demo</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Enter Demo Mode As:
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => handleEnterDemo('super_admin')}
            className="cursor-pointer"
            data-testid="demo-as-super-admin"
          >
            <Shield className="h-4 w-4 mr-2" />
            Super Admin
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => handleEnterDemo('admin')}
            className="cursor-pointer"
            data-testid="demo-as-admin"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Admin
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => handleEnterDemo('educator')}
            className="cursor-pointer"
            data-testid="demo-as-educator"
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Educator
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => handleEnterDemo('student')}
            className="cursor-pointer"
            data-testid="demo-as-student"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Student
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={handleEnterInstitutionDemo}
            className="cursor-pointer"
            data-testid="demo-as-institution"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Institution
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200"
          data-testid="button-role-switcher"
        >
          {user && roleIcons[user.role]}
          <span className="hidden sm:inline">{user ? roleLabels[user.role] : 'Demo Mode'}</span>
          <Badge variant="secondary" className="ml-1">DEMO</Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Role (Demo Mode)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('super_admin')}
          disabled={user?.role === 'super_admin'}
          className="cursor-pointer"
          data-testid="role-super-admin"
        >
          <Shield className="h-4 w-4 mr-2" />
          Super Admin
          {user?.role === 'super_admin' && (
            <Badge variant="secondary" className="ml-auto">Active</Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('admin')}
          disabled={user?.role === 'admin'}
          className="cursor-pointer"
          data-testid="role-admin"
        >
          <UserCog className="h-4 w-4 mr-2" />
          Admin
          {user?.role === 'admin' && (
            <Badge variant="secondary" className="ml-auto">Active</Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('educator')}
          disabled={user?.role === 'educator'}
          className="cursor-pointer"
          data-testid="role-educator"
        >
          <GraduationCap className="h-4 w-4 mr-2" />
          Educator
          {user?.role === 'educator' && (
            <Badge variant="secondary" className="ml-auto">Active</Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem 
          onClick={() => handleRoleSwitch('student')}
          disabled={user?.role === 'student'}
          className="cursor-pointer"
          data-testid="role-student"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Student
          {user?.role === 'student' && (
            <Badge variant="secondary" className="ml-auto">Active</Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          onClick={handleEnterInstitutionDemo}
          className="cursor-pointer"
          data-testid="role-institution"
        >
          <Building2 className="h-4 w-4 mr-2" />
          Institution
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleExitDemo}
          className="cursor-pointer text-red-600 dark:text-red-400"
          data-testid="exit-demo-mode"
        >
          <Users className="h-4 w-4 mr-2" />
          Exit Demo Mode
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
