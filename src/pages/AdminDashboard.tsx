import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SuggestedActions, SuggestedAction } from '@/components/dashboard/SuggestedActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  UserPlus,
  BadgeCheck,
  FileText,
  ChevronRight,
  Globe,
  Mail,
  Download,
  FileSpreadsheet,
  ChevronDown,
  BookOpen,
  MessageSquare,
  Package,
  CreditCard,
  Building2,
  Settings,
  LayoutDashboard,
  Shield,
  Scale,
  Bot,
  ClipboardList,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportPlatformAnalytics, type ExportFormat } from '@/utils/exportAnalytics';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAdminDataSource } from '@/hooks/useAdminDataSource';
import type { KPIData, Alert as AdminAlert } from '@/services/AdminDataService';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { auth } = useAuth();
  const dataSource = useAdminDataSource();
  
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // For demo mode, we allow access without strict auth checks
  // In production, this would verify admin privileges
  const isDemo = !auth.user || auth.user.role === 'admin' || 
    (auth.user.admin_roles && auth.user.admin_roles.length > 0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [kpiData, alertsData] = await Promise.all([
        dataSource.kpis.getKPIs(),
        dataSource.kpis.getAlerts(),
      ]);
      setKpis(kpiData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAnalytics = (format: ExportFormat) => {
    setDownloading(true);
    try {
      exportPlatformAnalytics(kpis, format);
      const formatLabel = format === 'excel' ? 'Excel (.xlsx)' : 'CSV';
      toast({
        title: "Download Started",
        description: `Platform analytics report is downloading as ${formatLabel}`,
      });
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate analytics report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-neutral-900 dark:text-white">Loading admin dashboard...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For demo purposes, allow access even without auth
  // In production, this would verify admin privileges
  const hasAdminRole = auth.user?.admin_roles && auth.user.admin_roles.length > 0;
  const isAdmin = auth.user?.role === 'admin';
  const isDemoMode = !auth.user; // Demo mode when no auth

  const kpiCards = kpis ? [
    {
      title: "Active Students",
      value: kpis.activeStudents,
      change: "+12%",
      icon: Users,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      title: "Active Educators",
      value: kpis.activeEducators,
      change: "+8%",
      icon: GraduationCap,
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500"
    },
    {
      title: "Active Communities",
      value: kpis.activeCommunities,
      change: "+18%",
      icon: MessageSquare,
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500"
    },
    {
      title: "New Subscriptions",
      value: kpis.newSubscriptions,
      change: "+23%",
      icon: TrendingUp,
      bgColor: "bg-yellow-500/10",
      iconColor: "text-yellow-500"
    },
    {
      title: "Course Completions",
      value: kpis.courseCompletions,
      change: "+15%",
      icon: CheckCircle,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500"
    },
    {
      title: "Certificates Issued",
      value: kpis.certificatesIssued,
      change: "+18%",
      icon: Award,
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500"
    },
    {
      title: "Monthly Revenue",
      value: `$${kpis.monthlyRevenue.toLocaleString()}`,
      change: "+32%",
      icon: DollarSign,
      bgColor: "bg-pink-500/10",
      iconColor: "text-pink-500"
    }
  ] : [];

  const suggestedActions: SuggestedAction[] = [
    {
      icon: Users,
      title: "Manage User Accounts",
      description: "View, edit, and moderate user accounts across students, educators, and institutions.",
      ctaText: "View Users",
      onClick: () => setActiveTab('users'),
      variant: "default" as const,
    },
    {
      icon: Globe,
      title: "Monitor Platform Health",
      description: "Check system status, integration connections, and platform performance metrics.",
      ctaText: "System Status",
      onClick: () => setActiveTab('settings'),
    },
    {
      icon: FileText,
      title: "Review Content",
      description: "Moderate courses, communities, and user-generated content for quality and compliance.",
      ctaText: "Content Review",
      onClick: () => setActiveTab('courses'),
    },
    {
      icon: BadgeCheck,
      title: "Platform Settings",
      description: "Configure platform features, integrations, legal policies, and administrative controls.",
      ctaText: "Settings",
      onClick: () => setActiveTab('settings'),
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <DashboardHeader
          title="Platform Administration"
          description="Monitor platform performance, manage users, and oversee content"
          showBreadcrumb={true}
          badge={
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200" data-testid="badge-demo-view">
              Demo View
            </Badge>
          }
          actions={
            <div className="flex gap-2 sm:gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    disabled={downloading} 
                    variant="outline"
                    size="default"
                    className="px-3 sm:px-4"
                    data-testid="button-export-report"
                  >
                    {downloading ? (
                      <Download className="h-4 w-4 animate-bounce sm:mr-2" />
                    ) : (
                      <Download className="h-4 w-4 sm:mr-2" />
                    )}
                    <span className="hidden sm:inline">Export Report</span>
                    <ChevronDown className="ml-1 sm:ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleDownloadAnalytics('csv')}
                    data-testid="menu-item-export-csv"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Download as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDownloadAnalytics('excel')}
                    data-testid="menu-item-export-excel"
                  >
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Download as Excel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={fetchDashboardData} 
                disabled={loading}
                className="px-3 sm:px-4"
                data-testid="button-refresh-data"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin sm:mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 sm:mr-2" />
                )}
                <span className="hidden sm:inline">Refresh Data</span>
              </Button>
            </div>
          }
        />

        <div className="mt-6 sm:mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <TabsList className="inline-flex sm:grid sm:w-full sm:grid-cols-8 h-auto gap-1 bg-muted/50 p-1 rounded-lg min-w-max sm:min-w-0">
                <TabsTrigger value="overview" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-overview">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-users">
                  <Users className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Users</span>
                </TabsTrigger>
                <TabsTrigger value="courses" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-courses">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Courses</span>
                </TabsTrigger>
                <TabsTrigger value="communities" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-communities">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Communities</span>
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-products">
                  <Package className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Products</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-payments">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Payments</span>
                </TabsTrigger>
                <TabsTrigger value="institutions" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-institutions">
                  <Building2 className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Institutions</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 data-[state=active]:bg-background whitespace-nowrap" data-testid="tab-settings">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8" data-testid="content-overview">
              {/* KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {kpiCards.map((kpi) => (
                  <Card key={kpi.title} className="hover:shadow-md transition-shadow" data-testid={`kpi-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                          <kpi.icon className={`h-6 w-6 ${kpi.iconColor}`} />
                        </div>
                        <Badge variant="secondary" className="text-green-600 border-green-200 bg-green-50">
                          {kpi.change}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-1" data-testid={`value-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>{kpi.value}</div>
                      <p className="text-sm text-muted-foreground">
                        {kpi.title}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Alerts Section */}
              {alerts.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Alerts & Notifications</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {alerts.map((alert) => (
                      <Alert 
                        key={alert.id} 
                        variant={alert.type === 'error' ? 'destructive' : 'default'}
                        className={
                          alert.type === 'error' ? '' :
                          alert.type === 'warning' ? 'border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20' :
                          'border-blue-500/50 bg-blue-50 dark:bg-blue-950/20'
                        }
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center justify-between">
                          {alert.title}
                          {alert.count && (
                            <Badge variant={alert.type === 'error' ? 'destructive' : 'secondary'}>
                              {alert.count}
                            </Badge>
                          )}
                        </AlertTitle>
                        <AlertDescription>
                          {alert.description}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Integration Status */}
              {kpis && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Platform Integrations</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className={kpis.stripeConnected ? "border-green-500/50" : "border-red-500/50"}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Stripe Payments
                          </CardTitle>
                          <Badge variant={kpis.stripeConnected ? "default" : "destructive"} data-testid="badge-stripe-status">
                            {kpis.stripeConnected ? "Connected" : "Not Connected"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {kpis.stripeConnected 
                            ? `Platform fee: ${kpis.platformFeePercent}% | Total GMV: $${kpis.totalGMV.toLocaleString()}`
                            : "Connect Stripe to enable payments, subscriptions, and educator payouts"
                          }
                        </p>
                        <Button 
                          variant={kpis.stripeConnected ? "outline" : "default"} 
                          className="w-full" 
                          onClick={() => setActiveTab('payments')}
                          data-testid="button-manage-stripe"
                        >
                          {kpis.stripeConnected ? "Manage Stripe" : "Connect Stripe"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className={kpis.emailProviderConnected ? "border-green-500/50" : "border-yellow-500/50"}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email & CRM
                          </CardTitle>
                          <Badge variant={kpis.emailProviderConnected ? "default" : "secondary"} data-testid="badge-email-status">
                            {kpis.emailProviderConnected ? kpis.emailProvider : "Not Connected"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {kpis.emailProviderConnected
                            ? "Sending certificates, notifications, and marketing emails via " + kpis.emailProvider
                            : "Connect an email provider to send course updates, certificates, and notifications"
                          }
                        </p>
                        <Button 
                          variant={kpis.emailProviderConnected ? "outline" : "default"} 
                          className="w-full" 
                          onClick={() => setActiveTab('settings')}
                          data-testid="button-manage-email"
                        >
                          {kpis.emailProviderConnected ? "Manage Email" : "Connect Provider"}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <SuggestedActions 
                actions={suggestedActions}
                title="Admin Quick Actions"
                description="Manage your platform efficiently with these essential administrative tasks"
              />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Button variant="outline" className="justify-start h-auto py-4" data-testid="button-add-admin">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <UserPlus className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-left">Add Admin User</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4" data-testid="button-verified-badges">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <BadgeCheck className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-left">Verified Badges</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4" data-testid="button-issue-certificate">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-amber-500" />
                        </div>
                        <span className="text-left">Issue Certificate</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-4" data-testid="button-process-refund">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-purple-500" />
                        </div>
                        <span className="text-left">Process Refund</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform events and user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: Users, text: "New user registration: emily.rodriguez@example.com", time: "5 minutes ago", color: "text-blue-500" },
                      { icon: Award, text: "Certificate issued to John Doe for Business Infrastructure", time: "12 minutes ago", color: "text-amber-500" },
                      { icon: GraduationCap, text: "New course published: Advanced Marketing Strategies", time: "1 hour ago", color: "text-green-500" },
                      { icon: DollarSign, text: "Payment processed: $299.00 for Pro subscription", time: "2 hours ago", color: "text-purple-500" },
                    ].map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon className={`h-5 w-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('settings')} data-testid="button-view-audit-logs">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    View Audit Logs
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6" data-testid="content-users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    View, edit, and moderate user accounts across students, educators, and institutions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">User Management</p>
                    <p className="text-sm">Manage all platform users, roles, and permissions here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-6" data-testid="content-courses">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Management
                  </CardTitle>
                  <CardDescription>
                    Review, approve, and moderate courses across the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Course Management</p>
                    <p className="text-sm">Review and moderate all courses on the platform.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communities" className="space-y-6" data-testid="content-communities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Community Moderation
                  </CardTitle>
                  <CardDescription>
                    Moderate communities, review reported content, and manage community guidelines.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Community Moderation</p>
                    <p className="text-sm">Oversee community content and enforce guidelines.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6" data-testid="content-products">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Digital Products
                  </CardTitle>
                  <CardDescription>
                    Manage digital products, templates, and downloadable resources.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Digital Products</p>
                    <p className="text-sm">Review and manage all digital products on the platform.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6" data-testid="content-payments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payments & Transactions
                  </CardTitle>
                  <CardDescription>
                    View transactions, manage refunds, and track platform revenue.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Payments & Revenue</p>
                    <p className="text-sm">Track all transactions and manage payment settings.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="institutions" className="space-y-6" data-testid="content-institutions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Institution Management
                  </CardTitle>
                  <CardDescription>
                    Manage enterprise accounts, B2B partnerships, and institutional settings.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Enterprise Management</p>
                    <p className="text-sm">Manage institutional accounts and enterprise features.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6" data-testid="content-settings">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      AI Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure AI features and integrations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Bot className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Manage AI assistants and automation settings.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      Legal & Compliance
                    </CardTitle>
                    <CardDescription>
                      Manage terms, privacy policies, and legal documents.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Scale className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Update legal documents and compliance settings.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Audit Logs
                    </CardTitle>
                    <CardDescription>
                      Review system activity and admin actions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">View detailed logs of all platform activities.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
