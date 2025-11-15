import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import logoImage from "@assets/ready-lab-logo.png";

const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [educatorPreviewMode, setEducatorPreviewMode] = useState(
    localStorage.getItem('educatorPreviewMode') === 'true'
  );
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  
  
  useEffect(() => {
    const handleStorageChange = () => {
      setEducatorPreviewMode(localStorage.getItem('educatorPreviewMode') === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Courses", path: "/courses" },
  ];

  const mobileNavItems = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Courses", path: "/courses" },
    { label: "Community", path: "/community" },
    { label: "Create a Community", path: "/community/create" },
    { label: "Solutions", path: "/solutions" },
    { label: "Pricing", path: "/pricing" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to home page after sign out
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      // Still navigate to home even if there's an error
      navigate('/');
    }
  };

  const navigateToHome = () => {
    navigate('/');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleCreateCourse = () => {
    navigate('/educator/onboarding');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors duration-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="cursor-pointer transition-opacity hover:opacity-70" onClick={navigateToHome}>
            <img src={logoImage} alt="The Ready Lab" className="h-12 w-auto" />
          </div>
          
          {educatorPreviewMode && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Educator Preview Mode
              </Badge>
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={handleCreateCourse}
              >
                Create Your First Course
              </Button>
            </div>
          )}
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.path) ? "text-primary" : "text-neutral-900 dark:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Community Link */}
          <Link
            to="/community"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/community") ? "text-primary" : "text-neutral-900 dark:text-white"
            }`}
          >
            Community
          </Link>

          <Link
            to="/solutions"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/solutions") ? "text-primary" : "text-neutral-900 dark:text-white"
            }`}
          >
            Solutions
          </Link>
          
          <Link
            to="/pricing"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/pricing") ? "text-primary" : "text-neutral-900 dark:text-white"
            }`}
          >
            Pricing
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Demo Mode Role Switcher */}
          <RoleSwitcher />

          {auth.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{auth.user.full_name || auth.user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <DropdownMenuItem onClick={navigateToDashboard}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => openAuthModal('login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/pricing')}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile User Menu - Only show user actions on mobile since nav is in bottom bar */}
        <div className="lg:hidden">
          {auth.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                <DropdownMenuItem onClick={navigateToDashboard}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => openAuthModal('login')}>
              <User className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </header>
  );
};

export default Header;