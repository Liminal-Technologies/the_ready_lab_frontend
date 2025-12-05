import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { SuggestedActions, SuggestedAction } from "@/components/dashboard/SuggestedActions";
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  UserPlus,
  BadgeCheck,
  FileText,
  ChevronRight,
  Globe,
  Mail,
  Download
} from "lucide-react";
import { exportPlatformAnalytics } from "@/utils/exportAnalytics";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAdminDataSource } from "@/hooks/useAdminDataSource";
import type { KPIData, Alert as AdminAlert } from "@/services/AdminDataService";

export function AdminOverview() {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const dataSource = useAdminDataSource();

  const handleDownloadAnalytics = () => {
    setDownloading(true);
    try {
      exportPlatformAnalytics(kpis);
      toast({
        title: "Download Started",
        description: "Platform analytics report is downloading as CSV",
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Use service layer instead of direct Supabase calls
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
      icon: Users,
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
      ctaLink: "/admin/users",
      variant: "default" as const,
    },
    {
      icon: Globe,
      title: "Monitor Platform Health",
      description: "Check system status, integration connections, and platform performance metrics.",
      ctaText: "System Status",
      ctaLink: "#",
    },
    {
      icon: FileText,
      title: "Review Content",
      description: "Moderate courses, communities, and user-generated content for quality and compliance.",
      ctaText: "Content Review",
      ctaLink: "/admin/courses",
    },
    {
      icon: BadgeCheck,
      title: "Platform Settings",
      description: "Configure platform features, integrations, legal policies, and administrative controls.",
      ctaText: "Settings",
      ctaLink: "/admin/settings",
      variant: "secondary" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 p-6 space-y-8">
      <PageBreadcrumb />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-neutral-900 dark:text-white">Admin Overview</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Monitor platform performance and manage key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleDownloadAnalytics} 
            disabled={downloading} 
            variant="default"
            data-testid="button-download-analytics"
          >
            {downloading ? (
              <Download className="mr-2 h-4 w-4 animate-bounce" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Analytics
          </Button>
          <Button onClick={fetchDashboardData} disabled={loading} variant="outline">
            {loading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Integration Status */}
      {kpis && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">Platform Integrations</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Stripe Integration Status */}
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
                <Link to="/admin/payments">
                  <Button variant={kpis.stripeConnected ? "outline" : "default"} className="w-full" data-testid="button-manage-stripe">
                    {kpis.stripeConnected ? "Manage Stripe" : "Connect Stripe"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Email/CRM Integration Status */}
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
                <Link to="/admin/settings">
                  <Button variant={kpis.emailProviderConnected ? "outline" : "default"} className="w-full" data-testid="button-manage-email">
                    {kpis.emailProviderConnected ? "Manage Email" : "Connect Provider"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

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
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-left">Add Admin User</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <BadgeCheck className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-left">Verified Badges</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-left">Issue Certificate</span>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4">
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
          <Button variant="outline" className="w-full mt-4">
            <FileText className="mr-2 h-4 w-4" />
            View Audit Logs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
