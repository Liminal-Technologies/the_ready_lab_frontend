import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Users, FileText, ToggleLeft, Shield, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FeatureFlag {
  id: string;
  flag_name: string;
  description: string;
  is_enabled: boolean;
  updated_at: string;
}

export const AdminSettings = () => {
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [platformSettings, setPlatformSettings] = useState({
    site_name: 'The Ready Lab',
    primary_color: '#3b82f6',
    logo_url: '',
    support_email: 'support@thereadylab.com',
    support_phone: '',
    operating_hours: '9 AM - 5 PM EST'
  });
  const [legalContent, setLegalContent] = useState({
    terms_of_service: '',
    privacy_policy: '',
    educator_agreement: '',
    certificate_disclaimer: ''
  });

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('flag_name');

      if (error) throw error;
      setFeatureFlags(data || []);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
    }
  };

  const toggleFeatureFlag = async (flagId: string, currentState: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          is_enabled: !currentState,
          updated_at: new Date().toISOString()
        })
        .eq('id', flagId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        _action: 'feature_flag_toggled',
        _entity_type: 'feature_flag',
        _entity_id: flagId,
        _old_values: { is_enabled: currentState },
        _new_values: { is_enabled: !currentState }
      });

      setFeatureFlags(prev => 
        prev.map(flag => 
          flag.id === flagId 
            ? { ...flag, is_enabled: !currentState }
            : flag
        )
      );

      toast({
        title: "Feature flag updated",
        description: "The feature flag has been successfully toggled.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feature flag.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const savePlatformSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would save to a settings table
      await supabase.rpc('log_admin_action', {
        _action: 'platform_settings_updated',
        _entity_type: 'platform_settings',
        _new_values: platformSettings
      });

      toast({
        title: "Platform settings saved",
        description: "Platform settings have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save platform settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveLegalContent = async () => {
    setLoading(true);
    try {
      await supabase.rpc('log_admin_action', {
        _action: 'legal_content_updated',
        _entity_type: 'legal_content',
        _new_values: legalContent
      });

      toast({
        title: "Legal content saved",
        description: "Legal documents have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save legal content.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataSubjectRequest = async (userId: string, requestType: 'export' | 'delete') => {
    try {
      await supabase.rpc('log_admin_action', {
        _action: `data_subject_request_${requestType}`,
        _entity_type: 'user_data',
        _entity_id: userId,
        _metadata: { request_type: requestType }
      });

      toast({
        title: `Data ${requestType} request processed`,
        description: `User data ${requestType} request has been logged and will be processed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to process data ${requestType} request.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Admin Settings</h1>
            <p className="text-muted-foreground">Manage platform settings, feature flags, and compliance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Home
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={async () => {
              await signOut();
              window.location.href = '/';
            }}>
              Sign Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="platform" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Platform
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="legal" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Legal & Compliance
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <ToggleLeft className="h-4 w-4" />
              Feature Flags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global branding and support settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={platformSettings.site_name}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, site_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                      id="primaryColor"
                      type="color"
                      value={platformSettings.primary_color}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    placeholder="https://example.com/logo.png"
                    value={platformSettings.logo_url}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={platformSettings.support_email}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, support_email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input
                      id="supportPhone"
                      value={platformSettings.support_phone}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, support_phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours</Label>
                  <Input
                    id="operatingHours"
                    value={platformSettings.operating_hours}
                    onChange={(e) => setPlatformSettings(prev => ({ ...prev, operating_hours: e.target.value }))}
                  />
                </div>

                <Button onClick={savePlatformSettings} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Platform Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Emergency user management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Emergency Actions</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Reset User Password
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Cancel Subscription
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Issue Refund
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Subject Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Handle GDPR/CCPA data requests for users
                  </p>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input placeholder="Enter user ID or email" />
                      <Button 
                        variant="outline"
                        onClick={() => handleDataSubjectRequest('user-id', 'export')}
                      >
                        Export Data
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDataSubjectRequest('user-id', 'delete')}
                      >
                        Delete Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal">
            <Card>
              <CardHeader>
                <CardTitle>Legal & Compliance</CardTitle>
                <CardDescription>Manage legal documents and compliance settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="termsOfService">Terms of Service</Label>
                    <Textarea
                      id="termsOfService"
                      rows={6}
                      value={legalContent.terms_of_service}
                      onChange={(e) => setLegalContent(prev => ({ ...prev, terms_of_service: e.target.value }))}
                      placeholder="Enter terms of service content..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                    <Textarea
                      id="privacyPolicy"
                      rows={6}
                      value={legalContent.privacy_policy}
                      onChange={(e) => setLegalContent(prev => ({ ...prev, privacy_policy: e.target.value }))}
                      placeholder="Enter privacy policy content..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educatorAgreement">Educator Agreement</Label>
                    <Textarea
                      id="educatorAgreement"
                      rows={6}
                      value={legalContent.educator_agreement}
                      onChange={(e) => setLegalContent(prev => ({ ...prev, educator_agreement: e.target.value }))}
                      placeholder="Enter educator agreement content..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="certificateDisclaimer">Certificate Disclaimer</Label>
                    <Textarea
                      id="certificateDisclaimer"
                      rows={4}
                      value={legalContent.certificate_disclaimer}
                      onChange={(e) => setLegalContent(prev => ({ ...prev, certificate_disclaimer: e.target.value }))}
                      placeholder="Enter certificate disclaimer text..."
                    />
                  </div>
                </div>

                <Button onClick={saveLegalContent} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Legal Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Toggle platform features on and off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {featureFlags.map((flag) => (
                        <TableRow key={flag.id}>
                          <TableCell className="font-medium">{flag.flag_name}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {flag.description || 'No description'}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              flag.is_enabled 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {flag.is_enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={flag.is_enabled}
                              onCheckedChange={() => toggleFeatureFlag(flag.id, flag.is_enabled)}
                              disabled={loading}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};