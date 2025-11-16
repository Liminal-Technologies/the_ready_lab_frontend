import { useState } from "react";
import { Home, Compass, BookOpen, User, LayoutGrid } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import MobileMoreMenu from "@/components/MobileMoreMenu";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  // Hide on course player pages for full-screen experience
  if (location.pathname.includes("/lessons/")) {
    return null;
  }

  const tabs = [
    { icon: Home, label: "Home", path: "/", authRequired: false, isButton: false },
    { icon: Compass, label: "Explore", path: "/explore", authRequired: false, isButton: false },
    { icon: BookOpen, label: "Courses", path: "/courses", authRequired: false, isButton: false },
    { icon: LayoutGrid, label: "More", path: "#", authRequired: false, isButton: true },
    { icon: User, label: "Profile", path: "/dashboard", authRequired: true, isButton: false },
  ];

  const handleTabClick = (path: string, authRequired: boolean, isButton: boolean, label?: string) => {
    if (isButton) {
      setIsMoreMenuOpen(true);
    } else if (authRequired && !auth.user) {
      navigate("/");
    } else if (label === "Profile" && auth.user) {
      // Use role-based routing for Profile button (matching Header navigation)
      const hasAdminRole = auth.user.admin_roles && auth.user.admin_roles.length > 0;
      const isAdmin = auth.user.role === 'admin';
      
      if (hasAdminRole || isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate(path);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname.startsWith("/dashboard");
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const isCoursesPage = () => {
    return location.pathname === "/courses" || location.pathname === "/browse" || location.pathname.startsWith("/courses");
  };

  const isExplorePage = () => {
    return location.pathname === "/explore" || location.pathname.startsWith("/explore");
  };

  const isCommunityPage = () => {
    return location.pathname === "/feed" || location.pathname === "/community" || location.pathname.startsWith("/community");
  };

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 lg:hidden transition-all duration-300 ${
        scrollDirection === "down" ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.isButton ? false : isActive(tab.path);
          
          // Use orange for courses page, green for explore page, purple for community page, yellow for others
          const activeColor = (tab.path === "/courses" && isCoursesPage()) 
            ? "bg-orange-500" 
            : (tab.path === "/explore" && isExplorePage())
              ? "bg-[#10A37F]"
              : (tab.path === "/feed" && isCommunityPage())
                ? "bg-[#9333EA]"
                : active 
                  ? "bg-[#E5A000]" 
                  : "";
          
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path, tab.authRequired, tab.isButton, tab.label)}
              className={`flex flex-col items-center justify-center gap-1 h-full flex-1 rounded-lg mx-0.5 transition-all ${
                active 
                  ? `${activeColor} text-white` 
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              }`}
              data-testid={`mobile-nav-${tab.label.toLowerCase()}`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
              <span className={`text-xs font-medium ${active ? "text-white" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      
      <MobileMoreMenu open={isMoreMenuOpen} onOpenChange={setIsMoreMenuOpen} />
    </nav>
  );
};

export default MobileBottomNav;
