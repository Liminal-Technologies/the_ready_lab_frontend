import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
import { User, Shield, CreditCard, DollarSign, FileText, Download, Trash2, ExternalLink, Globe } from 'lucide-react';
import { BillingManagement } from './BillingManagement';
import { PayoutManagement } from './PayoutManagement';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export const EducatorSettings = () => {
  const { auth, signOut } = useAuth();
  const { toast } = useToast();
  const { preference, updatePreference } = useLanguagePreference();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: auth.user?.full_name || '',
    email: auth.user?.email || '',
    bio: '',
    expertise: '',
    website: '',
    social_links: ''
  });
  const [agreements, setAgreements] = useState<any[]>([]);

  useEffect(() => {
    fetchAgreements();
  }, []);

  const fetchAgreements = async () => {
    if (!auth.user?.id) return;

    try {
      const data = await api.admin.educatorAgreements.list(auth.user.id);
      setAgreements(data || []);
    } catch (error) {
      console.error('Error fetching agreements:', error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!auth.user?.id) return;

    setLoading(true);
    try {
      await api.profiles.update(auth.user.id, {
        full_name: profile.full_name,
        email: profile.email
      });

      toast({
        title: "Profile updated",
        description: "Your educator profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(auth.user?.email || '');
      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "destructive",
      });
    }
  };

  const handleStripeConnect = () => {
    toast({
      title: "Stripe Connect",
      description: "Stripe Connect onboarding will be available soon.",
    });
  };

  const handleDataExport = async () => {
    if (!auth.user?.id) return;

    try {
      const data = await api.profiles.get(auth.user.id);

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `educator-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      toast({
        title: "Data exported",
        description: "Your educator account data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Educator Settings</h1>
            <p className="text-muted-foreground">Manage your educator profile, billing, and payouts</p>
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

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Language
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payouts
            </TabsTrigger>
            <TabsTrigger value="agreements" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Agreements & Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Public Educator Profile</CardTitle>
                <CardDescription>Manage your public educator profile visible to students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Display Name</Label>
                    <Input
                      id="fullName"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell students about your background and expertise..."
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Areas of Expertise</Label>
                  <Input
                    id="expertise"
                    placeholder="e.g., React, TypeScript, UI/UX Design"
                    value={profile.expertise}
                    onChange={(e) => setProfile(prev => ({ ...prev, expertise: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={profile.website}
                      onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="social">Social Links</Label>
                    <Input
                      id="social"
                      placeholder="LinkedIn, Twitter, etc."
                      value={profile.social_links}
                      onChange={(e) => setProfile(prev => ({ ...prev, social_links: e.target.value }))}
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language Preferences
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for the platform and content display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="educator-preferred-language">Preferred Language</Label>
                    <Select 
                      value={preference.preferred_language} 
                      onValueChange={(value) => updatePreference({ preferred_language: value })}
                    >
                      <SelectTrigger id="educator-preferred-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español (Spanish)</SelectItem>
                        <SelectItem value="fr">🇫🇷 Français (French) - Coming Soon</SelectItem>
                        <SelectItem value="pt">🇧🇷 Português (Portuguese) - Coming Soon</SelectItem>
                        <SelectItem value="ar">🇸🇦 العربية (Arabic) - Coming Soon</SelectItem>
                        <SelectItem value="zh">🇨🇳 中文 (Mandarin) - Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This language will be used across your Dashboard, content management, and when viewing student content.
                    </p>
                  </div>

                  <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="educator-show-language-first" className="font-medium">
                        Show content in my language first
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, content will be filtered to show only your preferred language. 
                        When disabled, all content will be shown with language labels.
                      </p>
                    </div>
                    <Switch
                      id="educator-show-language-first"
                      checked={preference.show_content_in_language_first}
                      onCheckedChange={(checked) => 
                        updatePreference({ show_content_in_language_first: checked })
                      }
                    />
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip for Educators:</strong> When creating content, you can add translations 
                      in multiple languages. Students will see content in their preferred language automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <Button onClick={handlePasswordReset} variant="outline">
                    Send Password Reset Email
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication will be available in a future update
                  </p>
                  <Button disabled variant="outline">
                    Enable 2FA (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <BillingManagement />
          </TabsContent>

          <TabsContent value="payouts">
            <PayoutManagement />
          </TabsContent>

          <TabsContent value="agreements">
            <Card>
              <CardHeader>
                <CardTitle>Agreements & Data</CardTitle>
                <CardDescription>View agreements and manage your account data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Educator Agreement</h3>
                  {agreements.length > 0 ? (
                    <div className="space-y-2">
                      {agreements.map((agreement) => (
                        <div key={agreement.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">Version {agreement.version}</p>
                              <p className="text-xs text-muted-foreground">
                                Accepted on {new Date(agreement.accepted_at).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                IP: {agreement.ip_address as string || 'N/A'}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Agreement
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No agreements found</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Account Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Export your account data or request account deletion
                  </p>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleDataExport}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex items-center gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Educator Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your educator account
                            and remove all your uploaded courses, products, and data from our servers.
                            You will receive a confirmation email within 7 days to complete the deletion.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground">
                            Request Deletion
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};