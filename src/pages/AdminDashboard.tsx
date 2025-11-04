import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import {
  Users,
  DollarSign,
  BookOpen,
  Shield,
  Building,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

export const AdminDashboard = () => {
  const [users] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "student",
      status: "active",
      subscriptionStatus: "active",
      joinDate: "2024-01-15",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      role: "educator",
      status: "active",
      subscriptionStatus: "pro",
      joinDate: "2024-02-03",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@example.com",
      role: "educator",
      status: "pending",
      subscriptionStatus: "basic",
      joinDate: "2024-03-10",
      lastActive: "3 days ago",
    },
  ]);

  const [analytics] = useState({
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 127850,
    pendingApprovals: 23,
    monthlyGrowth: {
      users: 12.5,
      revenue: 18.3,
      subscriptions: 8.7,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-primary text-primary-foreground";
      case "educator":
        return "bg-accent text-accent-foreground";
      case "student":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Banner */}
          <div className="bg-primary rounded-2xl p-8 mb-8 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Control Panel</h1>
                <p className="text-lg opacity-90 mb-4">
                  Manage users, educators, and platform operations.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>
                      {analytics.totalUsers.toLocaleString()} total users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      ${analytics.totalRevenue.toLocaleString()} revenue
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{analytics.pendingApprovals} pending approvals</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="h-16 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {analytics.totalUsers.toLocaleString()}
                </div>
                <p className="text-sm text-success">
                  +{analytics.monthlyGrowth.users}% this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {analytics.activeSubscriptions}
                </div>
                <p className="text-sm text-success">
                  +{analytics.monthlyGrowth.subscriptions}% this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  ${analytics.totalRevenue.toLocaleString()}
                </div>
                <p className="text-sm text-success">
                  +{analytics.monthlyGrowth.revenue}% this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {analytics.pendingApprovals}
                </div>
                <p className="text-sm text-muted-foreground">
                  Educator applications
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="educators">Educators</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="institutional">Institutional</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {users.map((user) => (
                  <Card
                    key={user.id}
                    className="group hover:shadow-medium transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {user.status}
                              </Badge>
                              {user.subscriptionStatus && (
                                <Badge variant="outline">
                                  {user.subscriptionStatus}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div>
                            <div>Joined: {user.joinDate}</div>
                            <div>Last active: {user.lastActive}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="educators" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Educator Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline">Approve All</Button>
                  <Button variant="hero">Invite Educator</Button>
                </div>
              </div>

              <div className="grid gap-6">
                <Card className="border-warning/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-warning" />
                      Pending Educator Applications
                    </CardTitle>
                    <CardDescription>
                      Review and approve new educator applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users
                        .filter(
                          (u) =>
                            u.role === "educator" && u.status === "pending",
                        )
                        .map((educator) => (
                          <div
                            key={educator.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {educator.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <h4 className="font-medium">{educator.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {educator.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                              <Button variant="outline" size="sm">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button variant="outline" size="sm">
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Payment & Subscriptions</h2>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Student Subscriptions ($29/mo)</span>
                        <span className="font-semibold">647 active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Educator Basic ($49/mo)</span>
                        <span className="font-semibold">134 active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Educator Pro ($129/mo)</span>
                        <span className="font-semibold">89 active</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Educator Premium ($349/mo)</span>
                        <span className="font-semibold">22 active</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Monthly Subscriptions</span>
                        <span className="font-semibold text-success">
                          $47,230
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Certification Purchases</span>
                        <span className="font-semibold text-success">
                          $23,450
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Course Sales</span>
                        <span className="font-semibold text-success">
                          $57,170
                        </span>
                      </div>
                      <hr />
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>Total Monthly Revenue</span>
                        <span className="text-success">$127,850</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="institutional" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Institutional Licensing</h2>
                <Button variant="hero">
                  <Building className="h-4 w-4 mr-2" />
                  Add Institution
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>White-Label Portal</CardTitle>
                  <CardDescription>
                    Manage institutional partnerships and bulk user accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Building className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Institutional Licensing Portal
                    </h3>
                    <p className="mb-4">
                      Manage 100-500 user licenses for educational institutions
                      and corporations
                    </p>
                    <div className="space-y-2 text-sm">
                      <p>• White-label dashboard for institutions</p>
                      <p>• Bulk user management (100-500 seats)</p>
                      <p>• Custom branding and content</p>
                      <p>• Advanced analytics and reporting</p>
                    </div>
                    <Button variant="hero" className="mt-6">
                      Configure Institutional Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};
