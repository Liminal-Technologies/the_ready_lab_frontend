import { Home, Compass, BookOpen, Users, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  // Hide on course player pages for full-screen experience
  if (location.pathname.includes("/lessons/")) {
    return null;
  }

  const tabs = [
    { icon: Home, label: "Home", path: "/", authRequired: false },
    { icon: Compass, label: "Explore", path: "/explore", authRequired: false },
    { icon: BookOpen, label: "Courses", path: "/courses", authRequired: false },
    { icon: Users, label: "Community", path: "/feed", authRequired: false },
    { icon: User, label: "Profile", path: "/dashboard", authRequired: true },
  ];

  const handleTabClick = (path: string, authRequired: boolean) => {
    if (authRequired && !auth.user) {
      navigate("/");
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

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 lg:hidden transition-colors duration-200">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          
          return (
            <button
              key={tab.path}
              onClick={() => handleTabClick(tab.path, tab.authRequired)}
              className={`flex flex-col items-center justify-center gap-1 h-full flex-1 rounded-lg mx-0.5 transition-all ${
                active 
                  ? "bg-orange-500 text-white" 
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
              <span className={`text-xs font-medium ${active ? "text-white" : ""}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
