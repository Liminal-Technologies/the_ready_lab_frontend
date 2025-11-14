import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertCircle,
  CheckCircle,
  Mail,
  Users,
  XCircle,
  MoreVertical,
  Send,
  Settings as SettingsIcon,
  RefreshCw,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminDataSource } from "@/hooks/useAdminDataSource";
import { useMockAuth } from "@/hooks/useMockAuth";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmailCrmStub, EmailProvider } from "@/mocks/EmailCrmStub";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Collaborator {
  id: string;
  email: string;
  fullName: string;
  role: string;
  status: 'active' | 'pending';
  addedAt: string;
}

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [emailProviderConnected, setEmailProviderConnected] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<EmailProvider | ''>('');
  const [currentProvider, setCurrentProvider] = useState<EmailProvider | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: '',
    permissions: {
      viewAnalytics: false,
      manageUsers: false,
      manageContent: false,
      managePayments: false,
    },
  });
  
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

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      const [collaboratorsData, emailConfig] = await Promise.all([
        dataSource.settings.getCollaborators(),
        Promise.resolve(EmailCrmStub.getProviderConfig()),
      ]);

      setCollaborators(collaboratorsData);
      
      if (emailConfig?.connected) {
        setEmailProviderConnected(true);
        setCurrentProvider(emailConfig.provider);
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

  const handleConnectProvider = async () => {
    if (!selectedProvider) {
      toast({
        title: "Error",
        description: "Please select a provider",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    try {
      await EmailCrmStub.connectProvider(selectedProvider, { apiKey });
      
      setEmailProviderConnected(true);
      setCurrentProvider(selectedProvider);
      setConnectModalOpen(false);
      setSelectedProvider('');
      setApiKey('');
      
      toast({
        title: "Provider Connected Successfully",
        description: `${selectedProvider} has been connected. Email notifications are now enabled.`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect email provider. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnectProvider = () => {
    setConfirmDialog({
      open: true,
      title: 'Disconnect Email Provider?',
      description: 'This will disable all email notifications including course updates, certificates, and user communications. Type "DISCONNECT" to confirm.',
      variant: 'danger',
      requireTypedConfirmation: 'DISCONNECT',
      action: async () => {
        await EmailCrmStub.disconnectProvider();
        setEmailProviderConnected(false);
        setCurrentProvider(null);
        toast({
          title: "Provider Disconnected",
          description: "Email provider has been disconnected. Notifications are now disabled.",
        });
      },
    });
  };

  const handleTestEmail = async () => {
    try {
      await EmailCrmStub.sendTestEmail("admin@thereadylab.com");
      toast({
        title: "Test Email Sent",
        description: "A test email has been sent successfully. Check your inbox to verify the integration.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test email. Please check your configuration.",
        variant: "destructive",
      });
    }
  };

  const handleInviteCollaborator = async () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await dataSource.settings.inviteCollaborator(inviteForm.email, inviteForm.role as any);
      
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${inviteForm.email}`,
      });
      
      setInviteModalOpen(false);
      setInviteForm({
        email: '',
        role: '',
        permissions: {
          viewAnalytics: false,
          manageUsers: false,
          manageContent: false,
          managePayments: false,
        },
      });
      
      loadSettings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCollaborator = (collaborator: Collaborator) => {
    setConfirmDialog({
      open: true,
      title: 'Remove Collaborator?',
      description: `Are you sure you want to remove ${collaborator.fullName} (${collaborator.email}) from the team? This action cannot be undone.`,
      variant: 'danger',
      action: async () => {
        toast({
          title: "Collaborator Removed",
          description: `${collaborator.fullName} has been removed from the team.`,
        });
        loadSettings();
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Platform Settings</h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">
            Manage integrations and team access
          </p>
        </div>
      </div>

      {!isDemo && !loading && (
        <Alert variant="destructive" data-testid="alert-demo-mode">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Mode Required</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Platform settings features are currently only available in demo mode. Please enable demo mode to explore this functionality.</span>
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* Email & CRM Integration Section */}
        <Card data-testid="card-email-crm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email & CRM Provider
            </CardTitle>
            <CardDescription>
              Connect an email/CRM provider to send notifications and sync user data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" data-testid="icon-loading" />
              </div>
            ) : emailProviderConnected && currentProvider ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-6 w-6 text-green-600" data-testid="icon-provider-connected" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" data-testid="text-provider-name">{currentProvider}</span>
                      <Badge className="bg-green-500" data-testid="badge-provider-connected">Connected</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Email notifications are active
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="p-3 border rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-2">Field Mappings</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>First Name →</span>
                        <code className="text-xs bg-background px-2 py-0.5 rounded">firstName</code>
                      </div>
                      <div className="flex justify-between">
                        <span>Email →</span>
                        <code className="text-xs bg-background px-2 py-0.5 rounded">email</code>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleTestEmail}
                      data-testid="button-test-email"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Test Email
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleDisconnectProvider}
                      data-testid="button-disconnect-provider"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-select">Select Provider</Label>
                  <Select value={selectedProvider} onValueChange={(value: EmailProvider) => setSelectedProvider(value)}>
                    <SelectTrigger id="provider-select" data-testid="select-provider">
                      <SelectValue placeholder="Choose email/CRM provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Resend">Resend</SelectItem>
                      <SelectItem value="Mailchimp">Mailchimp</SelectItem>
                      <SelectItem value="HubSpot">HubSpot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={() => setConnectModalOpen(true)}
                  disabled={!selectedProvider}
                  className="w-full"
                  data-testid="button-open-connect-modal"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Connect Provider
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Collaborators Section */}
        <Card data-testid="card-collaborators">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team & Collaborators
                </CardTitle>
                <CardDescription>
                  Manage team members with admin access
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setInviteModalOpen(true)}
                data-testid="button-open-invite-modal"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead data-testid="table-header-name">Name</TableHead>
                      <TableHead data-testid="table-header-email">Email</TableHead>
                      <TableHead data-testid="table-header-role">Role</TableHead>
                      <TableHead data-testid="table-header-status">Status</TableHead>
                      <TableHead data-testid="table-header-actions">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborators.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No collaborators yet. Invite team members to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      collaborators.map((collaborator) => (
                        <TableRow key={collaborator.id} data-testid={`row-collaborator-${collaborator.id}`}>
                          <TableCell className="font-medium" data-testid={`text-name-${collaborator.id}`}>
                            {collaborator.fullName}
                          </TableCell>
                          <TableCell data-testid={`text-email-${collaborator.id}`}>
                            {collaborator.email}
                          </TableCell>
                          <TableCell data-testid={`text-role-${collaborator.id}`}>
                            <Badge variant="outline">
                              {collaborator.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </Badge>
                          </TableCell>
                          <TableCell data-testid={`badge-status-${collaborator.id}`}>
                            <Badge variant={collaborator.status === 'active' ? 'default' : 'secondary'}>
                              {collaborator.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  data-testid={`button-actions-${collaborator.id}`}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem data-testid={`action-view-${collaborator.id}`}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`action-change-role-${collaborator.id}`}>
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleRemoveCollaborator(collaborator)}
                                  data-testid={`action-remove-${collaborator.id}`}
                                >
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Connect Provider Modal */}
      <Dialog open={connectModalOpen} onOpenChange={setConnectModalOpen}>
        <DialogContent data-testid="modal-connect-provider">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configure {selectedProvider}
            </DialogTitle>
            <DialogDescription>
              Enter your API credentials to connect {selectedProvider}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                data-testid="input-api-key"
              />
              <p className="text-xs text-muted-foreground">
                Find your API key in your {selectedProvider} account settings
              </p>
            </div>

            <div className="p-3 border rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-2">Field Mapping Preview</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>First Name →</span>
                  <code className="text-xs bg-background px-2 py-0.5 rounded">firstName</code>
                </div>
                <div className="flex justify-between">
                  <span>Email →</span>
                  <code className="text-xs bg-background px-2 py-0.5 rounded">email</code>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConnectModalOpen(false);
                setApiKey('');
              }}
              data-testid="button-cancel-connect"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnectProvider}
              data-testid="button-save-configuration"
            >
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Collaborator Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent data-testid="modal-invite-collaborator">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Collaborator
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join your admin team
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                data-testid="input-invite-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select 
                value={inviteForm.role} 
                onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
              >
                <SelectTrigger id="invite-role" data-testid="select-invite-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="content_admin">Content Admin</SelectItem>
                  <SelectItem value="finance_admin">Finance Admin</SelectItem>
                  <SelectItem value="community_admin">Community Admin</SelectItem>
                  <SelectItem value="support_agent">Support Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-analytics"
                    checked={inviteForm.permissions.viewAnalytics}
                    onCheckedChange={(checked) => 
                      setInviteForm({ 
                        ...inviteForm, 
                        permissions: { ...inviteForm.permissions, viewAnalytics: checked as boolean } 
                      })
                    }
                    data-testid="checkbox-perm-analytics"
                  />
                  <Label htmlFor="perm-analytics" className="font-normal">
                    View Analytics
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-users"
                    checked={inviteForm.permissions.manageUsers}
                    onCheckedChange={(checked) => 
                      setInviteForm({ 
                        ...inviteForm, 
                        permissions: { ...inviteForm.permissions, manageUsers: checked as boolean } 
                      })
                    }
                    data-testid="checkbox-perm-users"
                  />
                  <Label htmlFor="perm-users" className="font-normal">
                    Manage Users
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-content"
                    checked={inviteForm.permissions.manageContent}
                    onCheckedChange={(checked) => 
                      setInviteForm({ 
                        ...inviteForm, 
                        permissions: { ...inviteForm.permissions, manageContent: checked as boolean } 
                      })
                    }
                    data-testid="checkbox-perm-content"
                  />
                  <Label htmlFor="perm-content" className="font-normal">
                    Manage Content
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="perm-payments"
                    checked={inviteForm.permissions.managePayments}
                    onCheckedChange={(checked) => 
                      setInviteForm({ 
                        ...inviteForm, 
                        permissions: { ...inviteForm.permissions, managePayments: checked as boolean } 
                      })
                    }
                    data-testid="checkbox-perm-payments"
                  />
                  <Label htmlFor="perm-payments" className="font-normal">
                    Manage Payments
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setInviteModalOpen(false);
                setInviteForm({
                  email: '',
                  role: '',
                  permissions: {
                    viewAnalytics: false,
                    manageUsers: false,
                    manageContent: false,
                    managePayments: false,
                  },
                });
              }}
              data-testid="button-cancel-invite"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInviteCollaborator}
              data-testid="button-send-invitation"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
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
