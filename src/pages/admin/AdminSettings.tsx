import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save,
  Palette,
  Mail,
  Flag,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeatureFlag {
  id: string;
  flag_name: string;
  description: string;
  is_enabled: boolean;
  updated_at: string;
  updated_by?: string;
}

export function AdminSettings() {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newFlag, setNewFlag] = useState({ flag_name: "", description: "" });
  const [brandingSettings, setBrandingSettings] = useState({
    site_name: "The Ready Lab",
    site_description: "Professional learning platform for educators",
    primary_color: "#6366f1",
    logo_url: "",
    favicon_url: ""
  });
  const [emailSettings, setEmailSettings] = useState({
    smtp_host: "",
    smtp_port: "587",
    smtp_user: "",
    smtp_password: "",
    from_email: "noreply@thereadylab.com",
    from_name: "The Ready Lab"
  });
  const [supportSettings, setSupportSettings] = useState({
    support_email: "support@thereadylab.com",
    support_phone: "+1 (555) 123-4567",
    support_hours: "Mon-Fri 9AM-5PM EST"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('flag_name');

      if (error) throw error;
      setFeatureFlags(data || []);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatureFlag = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ 
          is_enabled: !currentValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await supabase.rpc('log_admin_action', {
        _action: currentValue ? 'disable_feature_flag' : 'enable_feature_flag',
        _entity_type: 'feature_flag',
        _entity_id: id
      });

      toast({
        title: "Success",
        description: `Feature flag ${currentValue ? 'disabled' : 'enabled'}`,
      });

      fetchFeatureFlags();
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive",
      });
    }
  };

  const createFeatureFlag = async () => {
    if (!newFlag.flag_name || !newFlag.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('feature_flags')
        .insert({
          flag_name: newFlag.flag_name,
          description: newFlag.description,
          is_enabled: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Feature flag created successfully",
      });

      setNewFlag({ flag_name: "", description: "" });
      fetchFeatureFlags();
    } catch (error) {
      console.error('Error creating feature flag:', error);
      toast({
        title: "Error",
        description: "Failed to create feature flag",
        variant: "destructive",
      });
    }
  };

  const saveBrandingSettings = () => {
    toast({
      title: "Success",
      description: "Branding settings saved successfully",
    });
  };

  const saveEmailSettings = () => {
    toast({
      title: "Success",
      description: "Email settings saved successfully",
    });
  };

  const saveSupportSettings = () => {
    toast({
      title: "Success",
      description: "Support settings saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Settings & Feature Flags</h1>
          <p className="text-muted-foreground">
            Configure platform settings and manage feature flags
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          Admin Controls
        </Badge>
      </div>

      <Tabs defaultValue="feature-flags" className="space-y-6">
        <TabsList>
          <TabsTrigger value="feature-flags">Feature Flags</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="feature-flags" className="space-y-6">
          {/* Create Feature Flag */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Feature Flag
              </CardTitle>
              <CardDescription>
                Add new feature flags to control platform functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flag-name">Flag Name</Label>
                  <Input
                    id="flag-name"
                    placeholder="e.g., verified_educators"
                    value={newFlag.flag_name}
                    onChange={(e) => setNewFlag({ ...newFlag, flag_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flag-description">Description</Label>
                  <Input
                    id="flag-description"
                    placeholder="Brief description of the feature"
                    value={newFlag.description}
                    onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={createFeatureFlag}>
                <Save className="mr-2 h-4 w-4" />
                Create Flag
              </Button>
            </CardContent>
          </Card>

          {/* Feature Flags Table */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags ({featureFlags.length})</CardTitle>
              <CardDescription>
                Control which features are enabled on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flag Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {featureFlags.map((flag) => (
                      <TableRow key={flag.id}>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {flag.flag_name}
                          </code>
                        </TableCell>
                        <TableCell>{flag.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={flag.is_enabled}
                              onCheckedChange={() => toggleFeatureFlag(flag.id, flag.is_enabled)}
                            />
                            <Badge variant={flag.is_enabled ? "default" : "secondary"}>
                              {flag.is_enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(flag.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Branding Settings
              </CardTitle>
              <CardDescription>
                Customize the platform's visual identity and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input
                    id="site-name"
                    value={brandingSettings.site_name}
                    onChange={(e) => setBrandingSettings({ 
                      ...brandingSettings, 
                      site_name: e.target.value 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={brandingSettings.primary_color}
                      onChange={(e) => setBrandingSettings({ 
                        ...brandingSettings, 
                        primary_color: e.target.value 
                      })}
                      className="w-20"
                    />
                    <Input
                      value={brandingSettings.primary_color}
                      onChange={(e) => setBrandingSettings({ 
                        ...brandingSettings, 
                        primary_color: e.target.value 
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={brandingSettings.site_description}
                  onChange={(e) => setBrandingSettings({ 
                    ...brandingSettings, 
                    site_description: e.target.value 
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo-url">Logo URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="logo-url"
                      placeholder="https://example.com/logo.png"
                      value={brandingSettings.logo_url}
                      onChange={(e) => setBrandingSettings({ 
                        ...brandingSettings, 
                        logo_url: e.target.value 
                      })}
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon-url">Favicon URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="favicon-url"
                      placeholder="https://example.com/favicon.ico"
                      value={brandingSettings.favicon_url}
                      onChange={(e) => setBrandingSettings({ 
                        ...brandingSettings, 
                        favicon_url: e.target.value 
                      })}
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={saveBrandingSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Branding Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for platform emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                    value={emailSettings.smtp_host}
                    onChange={(e) => setEmailSettings({ 
                      ...emailSettings, 
                      smtp_host: e.target.value 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    value={emailSettings.smtp_port}
                    onChange={(e) => setEmailSettings({ 
                      ...emailSettings, 
                      smtp_port: e.target.value 
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input
                    id="smtp-user"
                    value={emailSettings.smtp_user}
                    onChange={(e) => setEmailSettings({ 
                      ...emailSettings, 
                      smtp_user: e.target.value 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={emailSettings.smtp_password}
                    onChange={(e) => setEmailSettings({ 
                      ...emailSettings, 
                      smtp_password: e.target.value 
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    value={emailSettings.from_email}
                    onChange={(e) => setEmailSettings({ 
                      ...emailSettings, 
                      from_email: e.target.value 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name</Label>
                  <Input
                    id="from-name"
                    value={emailSettings.from_name}
                    onChange={(e) => setEmailSettings({ 
                      ...emailSettings, 
                      from_name: e.target.value 
                    })}
                  />
                </div>
              </div>

              <Button onClick={saveEmailSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Support Contact Settings
              </CardTitle>
              <CardDescription>
                Configure support contact information displayed to users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={supportSettings.support_email}
                  onChange={(e) => setSupportSettings({ 
                    ...supportSettings, 
                    support_email: e.target.value 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input
                  id="support-phone"
                  value={supportSettings.support_phone}
                  onChange={(e) => setSupportSettings({ 
                    ...supportSettings, 
                    support_phone: e.target.value 
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-hours">Support Hours</Label>
                <Input
                  id="support-hours"
                  placeholder="Mon-Fri 9AM-5PM EST"
                  value={supportSettings.support_hours}
                  onChange={(e) => setSupportSettings({ 
                    ...supportSettings, 
                    support_hours: e.target.value 
                  })}
                />
              </div>

              <Button onClick={saveSupportSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Support Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}