import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  MoreHorizontal, 
  Building2,
  Users,
  CreditCard,
  Download,
  Eye,
  Edit,
  Settings,
  BarChart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Institution {
  id: string;
  name: string;
  domain?: string;
  seat_limit: number;
  seats_used: number;
  status: string;
  payment_status: string;
  admin_contact_email?: string;
  created_at: string;
  trial_ends_at?: string;
}

export function AdminInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    filterInstitutions();
  }, [institutions, searchTerm, statusFilter]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInstitutions(data || []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast({
        title: "Error",
        description: "Failed to load institutions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterInstitutions = () => {
    let filtered = institutions;

    if (searchTerm) {
      filtered = filtered.filter(institution => 
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.admin_contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(institution => institution.status === statusFilter);
    }

    setFilteredInstitutions(filtered);
  };

  const exportInstitutionData = (institutionId: string) => {
    // In real implementation, this would generate a CSV with institution data
    toast({
      title: "Export Started",
      description: "Institution data export is being prepared...",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      trial: "bg-blue-100 text-blue-800",
      expired: "bg-red-100 text-red-800",
      suspended: "bg-orange-100 text-orange-800"
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      trial: "bg-blue-100 text-blue-800"
    };
    return (
      <Badge className={colors[paymentStatus as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
    );
  };

  const getSeatUtilization = (used: number, limit: number) => {
    const percentage = (used / limit) * 100;
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{used}/{limit}</span>
        <div className="w-16 h-2 bg-gray-200 rounded-full">
          <div 
            className={`h-2 rounded-full ${percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Institution Management</h1>
          <p className="text-muted-foreground">
            Manage enterprise accounts and seat bundles
          </p>
          <Badge variant="secondary" className="mt-2">PILOT FEATURE</Badge>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Institution
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutions.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Seats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {institutions.reduce((sum, i) => sum + i.seats_used, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              /{institutions.reduce((sum, i) => sum + i.seat_limit, 0)} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,500</div>
            <p className="text-xs text-muted-foreground">
              From enterprise plans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trial Institutions</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {institutions.filter(i => i.payment_status === 'trial').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need conversion
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="institutions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
          <TabsTrigger value="reports">Usage Reports</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="institutions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search institutions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Institutions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
              <CardDescription>
                All enterprise accounts and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Trial Ends</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstitutions.map((institution) => (
                      <TableRow key={institution.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{institution.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {institution.domain && `@${institution.domain}`}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {institution.admin_contact_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getSeatUtilization(institution.seats_used, institution.seat_limit)}
                        </TableCell>
                        <TableCell>{getStatusBadge(institution.status)}</TableCell>
                        <TableCell>{getPaymentBadge(institution.payment_status)}</TableCell>
                        <TableCell>
                          {institution.trial_ends_at ? (
                            <div className="text-sm">
                              {new Date(institution.trial_ends_at).toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(institution.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Institution
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Members
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart className="mr-2 h-4 w-4" />
                                Usage Report
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => exportInstitutionData(institution.id)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Usage Reports</h3>
              <p className="text-muted-foreground">Detailed usage analytics and reporting features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Billing Management</h3>
              <p className="text-muted-foreground">Enterprise billing and invoicing features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}