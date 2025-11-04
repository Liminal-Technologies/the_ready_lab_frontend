import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink, DollarSign, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ConnectAccount {
  stripe_account_id: string;
  account_status: string;
  onboarding_completed: boolean;
  details_submitted: boolean;
  payouts_enabled: boolean;
  charges_enabled: boolean;
}

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  arrival_date: string | null;
  description: string | null;
  created_at: string;
}

export const PayoutManagement = () => {
  const [account, setAccount] = useState<ConnectAccount | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountResponse, payoutsResponse] = await Promise.all([
        supabase.from("stripe_connect_accounts").select("*").single(),
        supabase
          .from("stripe_payouts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (accountResponse.data) {
        setAccount(accountResponse.data);
      }

      if (payoutsResponse.data) {
        setPayouts(payoutsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching payout data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = async () => {
    setConnectLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-connect-account",
      );

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast({
          title: "Opening Stripe Connect",
          description:
            "Complete the onboarding process to start receiving payouts.",
        });
      }
    } catch (error) {
      console.error("Connect error:", error);
      toast({
        title: "Error",
        description: "Failed to start Connect onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnectLoading(false);
    }
  };

  const handleOpenDashboard = async () => {
    setDashboardLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "get-connect-dashboard",
      );

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast({
        title: "Error",
        description: "Failed to open Stripe dashboard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payout Account</CardTitle>
          <CardDescription>
            Connect your bank account to receive payouts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!account ? (
            <div className="text-center py-6">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Connect your bank account via Stripe to start receiving payouts
                from course sales
              </p>
              <Button
                onClick={handleConnectAccount}
                disabled={connectLoading}
                className="flex items-center gap-2"
              >
                {connectLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                Connect Bank Account
              </Button>
            </div>
          ) : (
            <>
              {!account.onboarding_completed && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Complete your onboarding to enable payouts
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Account Status
                  </p>
                  <Badge
                    variant={
                      account.account_status === "active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {account.account_status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payouts</p>
                  <Badge
                    variant={
                      account.payouts_enabled ? "default" : "destructive"
                    }
                  >
                    {account.payouts_enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleOpenDashboard}
                  disabled={dashboardLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {dashboardLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Open Stripe Dashboard
                </Button>
                {!account.onboarding_completed && (
                  <Button
                    onClick={handleConnectAccount}
                    disabled={connectLoading}
                  >
                    {connectLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Complete Onboarding"
                    )}
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>
            Track your earnings and payout status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payouts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Arrival</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell>
                      {new Date(payout.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {formatAmount(payout.amount, payout.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payout.status === "paid" ? "default" : "secondary"
                        }
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payout.arrival_date
                        ? new Date(payout.arrival_date).toLocaleDateString()
                        : "Pending"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payout.description || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No payout history found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
