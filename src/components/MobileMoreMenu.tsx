import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  DollarSign, 
  BookOpen, 
  Users, 
  Settings, 
  FileText, 
  Shield,
  ChevronRight
} from "lucide-react";

interface MobileMoreMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MobileMoreMenu = ({ open, onOpenChange }: MobileMoreMenuProps) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Building2,
      label: "Solutions",
      description: "Enterprise & custom learning",
      path: "/solutions",
      color: "text-primary"
    },
    {
      icon: DollarSign,
      label: "Pricing",
      description: "Plans for everyone",
      path: "/pricing",
      color: "text-primary"
    },
    {
      icon: Users,
      label: "Community",
      description: "Connect with learners",
      path: "/community",
      color: "text-[#9333EA]"
    },
    {
      icon: BookOpen,
      label: "Resources",
      description: "Guides and tutorials",
      path: "/resources",
      color: "text-[#10A37F]"
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Account preferences",
      path: "/settings",
      color: "text-neutral-600 dark:text-neutral-400"
    },
    {
      icon: FileText,
      label: "Terms of Service",
      description: "Legal terms",
      path: "/terms",
      color: "text-neutral-600 dark:text-neutral-400"
    },
    {
      icon: Shield,
      label: "Privacy Policy",
      description: "Your data privacy",
      path: "/privacy",
      color: "text-neutral-600 dark:text-neutral-400"
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] rounded-t-3xl"
        data-testid="mobile-more-menu"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">More</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-1 overflow-y-auto h-[calc(80vh-100px)] pb-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                data-testid={`more-menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.color.includes('primary') ? 'bg-primary/10' : 'bg-neutral-100 dark:bg-neutral-800'} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-base text-neutral-900 dark:text-white">
                    {item.label}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors" />
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMoreMenu;
