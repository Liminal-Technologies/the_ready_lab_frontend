import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminDataSource } from "@/hooks/useAdminDataSource";
import { useMockAuth } from "@/hooks/useMockAuth";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { StripeStub } from "@/mocks/StripeStub";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export function AdminPayments() {
  const [loading, setLoading] = useState(true);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [stripeEmail, setStripeEmail] = useState("");
  const [platformFeePercent, setPlatformFeePercent] = useState(15);
  const [payoutSchedule, setPayoutSchedule] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [minPayoutAmount, setMinPayoutAmount] = useState(50);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => Promise<void>;
    variant?: 'danger' | 'warning';
    requireTypedConfirmation?: string;
  }>({
    open: false,
    title: '',
    description: '',
    action: async () => {},
  });
  const { toast } = useToast();
  const { isDemo, toggleDemo } = useMockAuth();
  const dataSource = useAdminDataSource();

  // Mock revenue data for chart (last 6 months)
  const revenueData = [
    { month: 'Jun', gmv: 8500 },
    { month: 'Jul', gmv: 12300 },
    { month: 'Aug', gmv: 15800 },
    { month: 'Sep', gmv: 18200 },
    { month: 'Oct', gmv: 22100 },
    { month: 'Nov', gmv: 28400 },
  ];

  const chartConfig = {
    gmv: {
      label: "GMV",
      color: "hsl(var(--primary))",
    },
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await dataSource.settings.getPlatformSettings();
      setPlatformFeePercent(settings.platformFeePercent);
      setPayoutSchedule(settings.payoutSchedule);
      setMinPayoutAmount(settings.minPayoutAmount);
      
      // Check Stripe connection status
      const stripeStatus = await StripeStub.getAccountStatus();
      if (stripeStatus) {
        setStripeConnected(stripeStatus.connected);
        setStripeEmail(stripeStatus.email || "");
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load platform settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      // Simulate Stripe OAuth connection
      const mockEmail = "admin@thereadylab.com";
      await StripeStub.connectAccount(mockEmail);
      
      setStripeConnected(true);
      setStripeEmail(mockEmail);
      setConnectModalOpen(false);
      
      toast({
        title: "Stripe Connected Successfully",
        description: "Your Stripe account has been connected. Platform payments are now enabled.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect Stripe account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectStripe = () => {
    setConfirmDialog({
      open: true,
      title: 'Disconnect Stripe Account?',
      description: 'This will disable all platform payments and educator payouts. Students will not be able to purchase courses until you reconnect. Type "DISCONNECT" to confirm.',
      variant: 'danger',
      requireTypedConfirmation: 'DISCONNECT',
      action: async () => {
        await StripeStub.disconnectAccount();
        setStripeConnected(false);
        setStripeEmail("");
        toast({
          title: "Stripe Disconnected",
          description: "Your Stripe account has been disconnected. Platform payments are now disabled.",
        });
      },
    });
  };

  const handleSaveSettings = async () => {
    try {
      await dataSource.settings.updatePlatformSettings({
        platformFeePercent,
        payoutSchedule,
        minPayoutAmount,
      });
      
      toast({
        title: "Settings Saved",
        description: "Platform fee configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock KPI calculations
  const totalGMV = revenueData.reduce((sum, d) => sum + d.gmv, 0);
  const platformRevenue = Math.round(totalGMV * (platformFeePercent / 100));
  const pendingPayouts = 4234;
  const activeEducatorsWithStripe = 12;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Payment Management</h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Manage Stripe integration and platform fees
          </p>
        </div>
      </div>

      {/* Demo Mode Alert */}
      {!isDemo && !loading && (
        <Alert variant="destructive" data-testid="alert-demo-mode">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Payment management features are currently only available in demo mode. Please enable demo mode to explore this functionality.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDemo}
              className="ml-4"
              data-testid="button-enable-demo"
            >
              Enable Demo Mode
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-kpi-gmv">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GMV</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-gmv">
              ${totalGMV.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 6 months
            </p>
          </CardContent>
        </Card>
        <Card data-testid="card-kpi-revenue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-platform-revenue">
              ${platformRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {platformFeePercent}% platform fee
            </p>
          </CardContent>
        </Card>
        <Card data-testid="card-kpi-payouts">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-payouts">
              ${pendingPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              To educators
            </p>
          </CardContent>
        </Card>
        <Card data-testid="card-kpi-educators">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Educators with Stripe</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-educators">
              {activeEducatorsWithStripe}
            </div>
            <p className="text-xs text-muted-foreground">
              Connected accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stripe Connection Section */}
      <Card data-testid="card-stripe-connection">
        <CardHeader>
          <CardTitle>Stripe Connection</CardTitle>
          <CardDescription>
            Connect your Stripe account to enable platform payments and educator payouts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          ) : stripeConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-6 w-6 text-green-600" data-testid="icon-stripe-connected" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Connected</span>
                    <Badge className="bg-green-500" data-testid="badge-stripe-connected">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1" data-testid="text-stripe-email">
                    {stripeEmail}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDisconnectStripe}
                  data-testid="button-disconnect-stripe"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <p className="text-sm font-medium mt-2">Charges Enabled</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <p className="text-sm font-medium mt-2">Payouts Enabled</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✓</div>
                  <p className="text-sm font-medium mt-2">Details Submitted</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Stripe Not Connected</h3>
              <p className="text-muted-foreground mb-6">
                Connect your Stripe account to start accepting payments and processing educator payouts
              </p>
              <Button
                size="lg"
                onClick={() => setConnectModalOpen(true)}
                data-testid="button-connect-stripe"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Stripe Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Platform Fee Configuration */}
      <Card data-testid="card-fee-configuration">
        <CardHeader>
          <CardTitle>Platform Fee Configuration</CardTitle>
          <CardDescription>
            Configure platform fees and payout settings for educator revenue sharing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform-fee">Platform Fee Percentage</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="platform-fee"
                  type="number"
                  min="0"
                  max="100"
                  value={platformFeePercent}
                  onChange={(e) => setPlatformFeePercent(Number(e.target.value))}
                  data-testid="input-platform-fee"
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Percentage of each transaction charged as platform fee (default: 15%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout-schedule">Payout Schedule</Label>
              <Select value={payoutSchedule} onValueChange={(value: any) => setPayoutSchedule(value)}>
                <SelectTrigger id="payout-schedule" data-testid="select-payout-schedule">
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often educators receive payouts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-payout">Minimum Payout Amount</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="min-payout"
                  type="number"
                  min="0"
                  value={minPayoutAmount}
                  onChange={(e) => setMinPayoutAmount(Number(e.target.value))}
                  data-testid="input-min-payout"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum balance required before processing payout
              </p>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleSaveSettings}
                className="w-full"
                data-testid="button-save-settings"
              >
                Save Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card data-testid="card-revenue-chart">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Gross Merchandise Value (GMV) - Last 6 Months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={revenueData} accessibilityLayer>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="gmv"
                fill="var(--color-gmv)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Stripe Connection Modal */}
      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogContent data-testid="modal-connect-stripe">
          <DialogHeader>
            <DialogTitle>Connect Your Stripe Account</DialogTitle>
            <DialogDescription>
              Connect your Stripe account to enable platform payments and educator payouts.
              By connecting, you authorize The Ready Lab to:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Process payments on your behalf</p>
                <p className="text-sm text-muted-foreground">Accept course purchases and subscriptions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Manage educator payouts</p>
                <p className="text-sm text-muted-foreground">Distribute revenue to connected educator accounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Access transaction data</p>
                <p className="text-sm text-muted-foreground">View payment history and analytics</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConnectModalOpen(false)}
              data-testid="button-cancel-connect"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnectStripe}
              className="bg-[#635bff] hover:bg-[#4f46e5]"
              data-testid="button-confirm-connect"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Connect with Stripe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disconnect Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.action}
        variant={confirmDialog.variant}
        requireTypedConfirmation={confirmDialog.requireTypedConfirmation}
      />
    </div>
  );
}
