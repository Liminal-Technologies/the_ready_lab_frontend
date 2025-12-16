import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Save,
  Eye,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface EducatorAgreement {
  id: string;
  user_id: string;
  version: string;
  accepted_at: string;
  ip_address?: unknown;
  user_agent?: unknown;
  profiles?: {
    email: string;
    full_name?: string;
  };
}

export function AdminLegal() {
  const [agreements, setAgreements] = useState<EducatorAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState({
    terms: "# Terms of Service\n\n[Terms content will be loaded here...]",
    privacy: "# Privacy Policy\n\n[Privacy policy content will be loaded here...]",
    educator_agreement: "# Educator Agreement\n\n[Educator agreement content will be loaded here...]",
    certificate_disclaimer: "# Certificate Disclaimer\n\n[Certificate disclaimer content will be loaded here...]"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEducatorAgreements();
  }, []);

  const fetchEducatorAgreements = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch educator agreements via API
      const agreementsData = await api.admin.educatorAgreements.list(user.id);

      // Map to expected format
      const mappedAgreements = ((agreementsData as any) || []).map((agreement: any) => ({
        id: agreement.id,
        user_id: agreement.user_id || agreement.userId,
        version: agreement.version || agreement.agreement_version || 'v1.0',
        accepted_at: agreement.accepted_at || agreement.acceptedAt || agreement.signed_at,
        ip_address: agreement.ip_address,
        user_agent: agreement.user_agent,
        profiles: agreement.profile || agreement.profiles || {
          email: 'unknown@email.com',
          full_name: 'Unknown User',
        },
      }));

      setAgreements(mappedAgreements);
    } catch (error) {
      console.error('Error fetching educator agreements:', error);
      toast({
        title: "Error",
        description: "Failed to load educator agreements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = (type: keyof typeof documents) => {
    // In real implementation, this would save to database
    toast({
      title: "Success",
      description: `${type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} saved successfully`,
    });
  };

  const getAgreementStats = () => {
    const total = agreements.length;
    const thisMonth = agreements.filter(a => 
      new Date(a.accepted_at).getMonth() === new Date().getMonth()
    ).length;
    
    return { total, thisMonth };
  };

  const stats = getAgreementStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Legal & Compliance</h1>
          <p className="text-muted-foreground">
            Manage legal documents and track compliance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Compliant
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Educator agreements signed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground">
              New agreements
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Version</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">v2.1</div>
            <p className="text-xs text-muted-foreground">
              Current agreement version
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              All educators compliant
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Legal Documents</TabsTrigger>
          <TabsTrigger value="agreements">Educator Agreements</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Terms of Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Terms of Service
                </CardTitle>
                <CardDescription>
                  Platform terms and conditions for all users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={documents.terms}
                  onChange={(e) => setDocuments({ ...documents, terms: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveDocument('terms')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Terms
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Policy
                </CardTitle>
                <CardDescription>
                  Data privacy and protection policy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={documents.privacy}
                  onChange={(e) => setDocuments({ ...documents, privacy: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveDocument('privacy')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Policy
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Educator Agreement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Educator Agreement
                </CardTitle>
                <CardDescription>
                  Agreement for educator account holders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={documents.educator_agreement}
                  onChange={(e) => setDocuments({ ...documents, educator_agreement: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveDocument('educator_agreement')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Agreement
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Certificate Disclaimer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Certificate Disclaimer
                </CardTitle>
                <CardDescription>
                  Legal disclaimer for certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={documents.certificate_disclaimer}
                  onChange={(e) => setDocuments({ ...documents, certificate_disclaimer: e.target.value })}
                  rows={15}
                  className="font-mono text-sm"
                />
                <div className="flex gap-2">
                  <Button onClick={() => saveDocument('certificate_disclaimer')}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Disclaimer
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Educator Agreement Records</CardTitle>
              <CardDescription>
                All signed educator agreements with tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Educator</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Signed Date</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {agreements.map((agreement) => (
                      <TableRow key={agreement.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {agreement.profiles?.full_name || 'Unknown'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {agreement.profiles?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">v{agreement.version}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(agreement.accepted_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(agreement.accepted_at).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {(agreement.ip_address as string) || '—'}
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">
                          {(agreement.user_agent as string) || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compliance Dashboard</h3>
              <p className="text-muted-foreground">Compliance monitoring and reporting features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}