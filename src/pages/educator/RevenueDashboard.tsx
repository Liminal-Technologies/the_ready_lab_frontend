import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, DollarSign, TrendingUp, CreditCard, 
  Download, Calendar, CheckCircle2, Clock 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  date: string;
  student: string;
  course: string;
  amount: number;
  status: 'paid' | 'pending';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2025-11-18', student: 'Emma Davis', course: 'Grant Writing Mastery', amount: 199, status: 'paid' },
  { id: '2', date: '2025-11-17', student: 'Michael Chen', course: 'Business Plan Fundamentals', amount: 149, status: 'paid' },
  { id: '3', date: '2025-11-16', student: 'Sarah Johnson', course: 'Financial Planning', amount: 67, status: 'paid' },
  { id: '4', date: '2025-11-15', student: 'James Wilson', course: 'Pitch Deck Workshop', amount: 199, status: 'paid' },
  { id: '5', date: '2025-11-14', student: 'Olivia Martinez', course: 'Grant Writing Mastery', amount: 199, status: 'paid' },
  { id: '6', date: '2025-11-13', student: 'Liam Brown', course: 'Business Plan Fundamentals', amount: 149, status: 'pending' },
  { id: '7', date: '2025-11-12', student: 'Sophia Garcia', course: 'Financial Planning', amount: 67, status: 'paid' },
  { id: '8', date: '2025-11-11', student: 'Noah Anderson', course: 'Pitch Deck Workshop', amount: 199, status: 'paid' },
];

const RevenueDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stripeConnected, setStripeConnected] = useState(true); // Mock as connected

  const thisMonthRevenue = 12450;
  const lastMonthRevenue = 9870;
  const allTimeRevenue = 67890;
  const pendingPayout = 3200;

  const handleConnectStripe = () => {
    toast({
      title: "Stripe Connected! 🎉",
      description: "Your Stripe account has been connected successfully",
    });
    setStripeConnected(true);
  };

  const handleExportCSV = () => {
    toast({
      title: "Export started",
      description: "Your transaction history is being exported to CSV",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/educator/dashboard')}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Revenue & Payouts</h1>
              <p className="text-muted-foreground">
                Track your earnings and manage payout settings
              </p>
            </div>
            {!stripeConnected && (
              <Button onClick={handleConnectStripe} data-testid="button-connect-stripe">
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Stripe Account
              </Button>
            )}
          </div>

          {!stripeConnected ? (
            <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <CardHeader>
                <CardTitle className="text-yellow-800 dark:text-yellow-200">
                  Connect your Stripe account to receive payouts
                </CardTitle>
                <CardDescription className="text-yellow-700 dark:text-yellow-300">
                  You need to connect a Stripe account to receive payments from students. This only takes a few minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleConnectStripe} data-testid="button-connect-stripe-card">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Connect Stripe Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${thisMonthRevenue.toLocaleString()}</div>
                    <div className="text-xs text-green-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +26% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Last Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${lastMonthRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">October 2025</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      All-Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">${allTimeRevenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">Since Jan 2025</div>
                  </CardContent>
                </Card>

                <Card className="border-primary">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Pending Payout
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">${pendingPayout.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mt-1">Releases Nov 25</div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="payouts" data-testid="tab-payouts">Payout Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Revenue Breakdown by Course */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Course</CardTitle>
                      <CardDescription>This month's breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { course: 'Business Plan Fundamentals', revenue: 4200, color: 'bg-blue-500' },
                        { course: 'Grant Writing Mastery', revenue: 3800, color: 'bg-purple-500' },
                        { course: 'Financial Planning', revenue: 2450, color: 'bg-green-500' },
                        { course: 'Pitch Deck Workshop', revenue: 2000, color: 'bg-orange-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.course}</span>
                            <span className="font-bold">${item.revenue.toLocaleString()}</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} transition-all`}
                              style={{ width: `${(item.revenue / thisMonthRevenue) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Monthly Revenue Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-between gap-2">
                        {[
                          { month: 'Jun', amount: 6200 },
                          { month: 'Jul', amount: 7400 },
                          { month: 'Aug', amount: 8100 },
                          { month: 'Sep', amount: 8900 },
                          { month: 'Oct', amount: 9870 },
                          { month: 'Nov', amount: 12450 },
                        ].map((item, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <div className="text-xs font-medium text-muted-foreground mb-1">
                              ${(item.amount / 1000).toFixed(1)}k
                            </div>
                            <div 
                              className="w-full bg-primary rounded-t transition-all hover:opacity-80 relative group"
                              style={{ height: `${(item.amount / 12450) * 100}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-popover text-popover-foreground px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
                                  ${item.amount.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Transaction History</CardTitle>
                          <CardDescription>{MOCK_TRANSACTIONS.length} transactions</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleExportCSV} data-testid="button-export-csv">
                          <Download className="mr-2 h-4 w-4" />
                          Export CSV
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-5 gap-4 pb-3 border-b font-medium text-sm">
                          <div>Date</div>
                          <div>Student</div>
                          <div>Course</div>
                          <div>Amount</div>
                          <div>Status</div>
                        </div>

                        {MOCK_TRANSACTIONS.map((transaction) => (
                          <div 
                            key={transaction.id} 
                            className="grid grid-cols-5 gap-4 py-3 border-b hover:bg-muted/50 rounded transition-colors"
                            data-testid={`transaction-${transaction.id}`}
                          >
                            <div className="text-sm">{transaction.date}</div>
                            <div className="text-sm font-medium">{transaction.student}</div>
                            <div className="text-sm text-muted-foreground">{transaction.course}</div>
                            <div className="text-sm font-bold">${transaction.amount}</div>
                            <div>
                              {transaction.status === 'paid' ? (
                                <Badge variant="secondary" className="bg-green-500 text-white">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Paid
                                </Badge>
                              ) : (
                                <Badge variant="secondary">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="payouts" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Stripe Account</CardTitle>
                      <CardDescription>Connected payment account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="font-medium">Stripe Account Connected</div>
                            <div className="text-sm text-muted-foreground">Account ID: acct_1234567890</div>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500 text-white">Active</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payout Schedule</CardTitle>
                      <CardDescription>Automatic payout settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Frequency</span>
                          <Badge>Weekly (Every Friday)</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Next Payout</span>
                          <span className="font-medium">November 25, 2025</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Payout Amount</span>
                          <span className="font-bold text-primary">${pendingPayout.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Bank Account</span>
                          <span className="text-muted-foreground">•••• 4242 (Bank of America)</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <Button variant="outline" className="w-full" data-testid="button-change-schedule">
                          Change Payout Schedule
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 text-center">
                          Change to daily, weekly, or monthly payouts
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payout History</CardTitle>
                      <CardDescription>Recent completed payouts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { date: 'Nov 18, 2025', amount: 2850, status: 'Completed' },
                          { date: 'Nov 11, 2025', amount: 3100, status: 'Completed' },
                          { date: 'Nov 4, 2025', amount: 2670, status: 'Completed' },
                        ].map((payout, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                            <div>
                              <div className="font-medium">{payout.date}</div>
                              <div className="text-sm text-muted-foreground">{payout.status}</div>
                            </div>
                            <div className="font-bold">${payout.amount.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RevenueDashboard;
