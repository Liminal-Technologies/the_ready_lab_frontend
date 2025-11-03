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
  Filter, 
  MoreHorizontal, 
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
  RefreshCw,
  Eye,
  Download,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

// Mock data - In real implementation, this would come from Stripe
const mockTransactions = [
  {
    id: "pi_1234567890",
    customer_email: "john@example.com",
    amount: 4900,
    currency: "usd",
    status: "succeeded",
    description: "Educator Pro Plan",
    created: "2024-01-15T10:30:00Z",
    payment_method: "card",
    last4: "4242"
  },
  {
    id: "pi_0987654321",
    customer_email: "sarah@example.com",
    amount: 12900,
    currency: "usd",
    status: "succeeded",
    description: "Educator Premium Plan",
    created: "2024-01-14T15:45:00Z",
    payment_method: "card",
    last4: "4444"
  }
];

const mockSubscriptions = [
  {
    id: "sub_1234567890",
    customer_email: "john@example.com",
    status: "active",
    plan: "Educator Pro",
    amount: 4900,
    interval: "month",
    current_period_start: "2024-01-15T00:00:00Z",
    current_period_end: "2024-02-15T00:00:00Z",
    created: "2024-01-15T10:30:00Z"
  }
];

export function AdminPayments() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const refreshStripeData = async () => {
    setLoading(true);
    // In real implementation, this would call Stripe API
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Payment data has been synced with Stripe",
      });
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      succeeded: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      past_due: "bg-orange-100 text-orange-800"
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Monitor transactions, subscriptions, and payouts
          </p>
        </div>
        <Button onClick={refreshStripeData} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Sync with Stripe
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,847</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +7 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,234</div>
            <p className="text-xs text-muted-foreground">
              To educators
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="payouts">Educator Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
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
                      placeholder="Search by email or transaction ID..."
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
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                All payment transactions processed through Stripe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-mono text-sm">
                          {transaction.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{transaction.customer_email}</div>
                            <div className="text-sm text-muted-foreground">
                              Card ending in {transaction.last4}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          {new Date(transaction.created).toLocaleDateString()}
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
                                View in Stripe
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              {transaction.status === 'succeeded' && (
                                <DropdownMenuItem>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Issue Refund
                                </DropdownMenuItem>
                              )}
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

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                All active educator subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subscription ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-mono text-sm">
                          {subscription.id}
                        </TableCell>
                        <TableCell>{subscription.customer_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{subscription.plan}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatAmount(subscription.amount)}/{subscription.interval}
                        </TableCell>
                        <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                        <TableCell>
                          {new Date(subscription.current_period_end).toLocaleDateString()}
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
                                View in Stripe
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Cancel Subscription
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

        <TabsContent value="refunds">
          <Card>
            <CardContent className="p-8 text-center">
              <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Refund Management</h3>
              <p className="text-muted-foreground">Refund processing features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Educator Payouts</h3>
              <p className="text-muted-foreground">Payout management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}