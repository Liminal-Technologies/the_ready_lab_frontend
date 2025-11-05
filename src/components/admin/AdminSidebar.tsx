import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  BookOpen,
  MessageSquare,
  Package,
  CreditCard,
  Building2,
  Bot,
  FileText,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Home,
  ArrowLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const adminMenuItems = [
  {
    title: "Overview",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    badge: "24"
  },
  {
    title: "Courses & Certificates",
    icon: BookOpen,
    subItems: [
      { title: "Tracks", url: "/admin/courses/tracks" },
      { title: "Modules", url: "/admin/courses/modules" },
      { title: "Lessons", url: "/admin/courses/lessons" },
      { title: "Quizzes", url: "/admin/courses/quizzes" },
      { title: "Certificates", url: "/admin/courses/certificates" },
    ]
  },
  {
    title: "Communities",
    url: "/admin/communities",
    icon: MessageSquare,
  },
  {
    title: "Digital Products",
    url: "/admin/products",
    icon: Package,
    badge: "3"
  },
  {
    title: "Payments",
    url: "/admin/payments",
    icon: CreditCard,
  },
  {
    title: "Institutions",
    url: "/admin/institutions",
    icon: Building2,
    badge: "PILOT"
  },
  {
    title: "AI Assistant",
    url: "/admin/ai",
    icon: Bot,
  },
  {
    title: "Legal & Compliance",
    url: "/admin/legal",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openGroups, setOpenGroups] = useState<string[]>(['Courses & Certificates']);
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = (subItems: any[]) => subItems.some(item => isActive(item.url));

  const toggleGroup = (title: string) => {
    setOpenGroups(prev => 
      prev.includes(title) 
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  const getNavClasses = (isActive: boolean) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm">TRL Admin</h2>
              <Badge variant="outline" className="text-xs mt-1">PROD</Badge>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        {/* Back to Home Button */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 font-semibold border-2 border-blue-200 dark:border-blue-800 rounded-md mb-3 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm"
                    data-testid="button-back-to-home"
                  >
                    <ArrowLeft className="mr-3 h-5 w-5" />
                    {!collapsed && <span>Back to Home</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <Collapsible
                      open={openGroups.includes(item.title)}
                      onOpenChange={() => toggleGroup(item.title)}
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={`w-full justify-between ${
                            isGroupActive(item.subItems) 
                              ? "bg-primary/10 text-primary font-medium" 
                              : "hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="mr-3 h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </div>
                          {!collapsed && (
                            openGroups.includes(item.title) 
                              ? <ChevronDown className="h-4 w-4" />
                              : <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuButton key={subItem.url} asChild>
                            <NavLink 
                              to={subItem.url} 
                              className={`ml-6 ${getNavClasses(isActive(subItem.url))}`}
                            >
                              {!collapsed && <span>{subItem.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClasses(isActive(item.url))}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {!collapsed && (
                          <div className="flex items-center justify-between w-full">
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin/audit-logs" 
                    className={getNavClasses(isActive('/admin/audit-logs'))}
                  >
                    <Shield className="mr-3 h-4 w-4" />
                    {!collapsed && <span>Audit Logs</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}