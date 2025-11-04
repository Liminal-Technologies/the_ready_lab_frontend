import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Award, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface KPIData {
  activeStudents: number;
  activeEducators: number;
  newSubscriptions: number;
  courseCompletions: number;
  certificatesIssued: number;
  monthlyRevenue: number;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  count?: number;
}

export function AdminOverview() {
  const [kpis, setKpis] = useState<KPIData>({
    activeStudents: 0,
    activeEducators: 0,
    newSubscriptions: 0,
    courseCompletions: 0,
    certificatesIssued: 0,
    monthlyRevenue: 0
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch KPI data
      const [
        studentsResult,
        educatorsResult,
        enrollmentsResult,
        certificatesResult,
        productsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id').eq('role', 'student').eq('subscription_status', 'active'),
        supabase.from('profiles').select('id').eq('role', 'educator'),
        supabase.from('enrollments').select('id').eq('status', 'active'),
        supabase.from('certifications').select('id').eq('status', 'issued'),
        supabase.from('digital_products').select('id').eq('status', 'pending')
      ]);

      // Count completions this month
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: completions } = await supabase
        .from('enrollments')
        .select('id')
        .eq('status', 'completed')
        .gte('completion_date', thirtyDaysAgo.toISOString());

      const { data: newSubs } = await supabase
        .from('profiles')
        .select('id')
        .in('subscription_status', ['active', 'trial'])
        .gte('created_at', thirtyDaysAgo.toISOString());

      setKpis({
        activeStudents: studentsResult.data?.length || 0,
        activeEducators: educatorsResult.data?.length || 0,
        newSubscriptions: newSubs?.length || 0,
        courseCompletions: completions?.length || 0,
        certificatesIssued: certificatesResult.data?.length || 0,
        monthlyRevenue: 12450 // Mock data - would integrate with Stripe
      });

      // Generate alerts
      const alertsData: Alert[] = [];
      
      if (productsResult.data && productsResult.data.length > 0) {
        alertsData.push({
          id: 'pending-products',
          type: 'warning',
          title: 'Pending Product Approvals',
          description: 'Digital products waiting for review',
          count: productsResult.data.length
        });
      }

      // Mock additional alerts
      alertsData.push(
        {
          id: 'failed-payments',
          type: 'error',
          title: 'Failed Payments',
          description: 'Payment failures requiring attention',
          count: 3
        }
      );

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

  const kpiCards = [
    {
      title: "Active Students",
      value: kpis.activeStudents,
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Educators",
      value: kpis.activeEducators,
      change: "+8%",
      icon: GraduationCap,
      color: "text-green-600"
    },
    {
      title: "New Subscriptions",
      value: kpis.newSubscriptions,
      change: "+23%",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Course Completions",
      value: kpis.courseCompletions,
      change: "+15%",
      icon: CheckCircle,
      color: "text-emerald-600"
    },
    {
      title: "Certificates Issued",
      value: kpis.certificatesIssued,
      change: "+18%",
      icon: Award,
      color: "text-amber-600"
    },
    {
      title: "Monthly Revenue",
      value: `$${kpis.monthlyRevenue.toLocaleString()}`,
      change: "+32%",
      icon: DollarSign,
      color: "text-green-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground">
            Welcome to The Ready Lab admin dashboard
          </p>
        </div>
        <Button onClick={fetchDashboardData} disabled={loading}>
          {loading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
          Refresh Data
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{kpi.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} className={
              alert.type === 'error' ? 'border-red-200 bg-red-50' :
              alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
              'border-blue-200 bg-blue-50'
            }>
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Add Admin User
            </Button>
            <Button variant="outline" className="justify-start">
              <GraduationCap className="mr-2 h-4 w-4" />
              Manage Verified Badges
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="mr-2 h-4 w-4" />
              Issue Certificate
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Process Refund
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}