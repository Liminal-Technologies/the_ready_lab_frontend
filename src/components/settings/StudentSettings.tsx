import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLanguagePreference } from "@/hooks/useLanguagePreference";
import { supabase } from "@/integrations/supabase/client";
import {
  User,
  Shield,
  CreditCard,
  Award,
  Download,
  Trash2,
  Globe,
} from "lucide-react";
import { BillingManagement } from "./BillingManagement";
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
} from "@/components/ui/alert-dialog";

export const StudentSettings = () => {
  const { auth, signOut } = useAuth();
  const { toast } = useToast();
  const { t, language, setLanguage } = useLanguage();
  const { preference, updatePreference } = useLanguagePreference();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: auth.user?.full_name || "",
    email: auth.user?.email || "",
  });

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          email: profile.email,
        })
        .eq("id", auth.user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
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
      const { error } = await supabase.auth.resetPasswordForEmail(
        auth.user?.email || "",
      );
      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description:
          "Check your email for instructions to reset your password.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email.",
        variant: "destructive",
      });
    }
  };

  const handleDataExport = async () => {
    try {
      // Export user data
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", auth.user?.id)
        .single();

      if (error) throw error;

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trl-data-${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      toast({
        title: "Data exported",
        description: "Your account data has been downloaded.",
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
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("settings.title")}
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and security settings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              {t("header.home")}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
            >
              {t("header.dashboard")}
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
            >
              {t("header.signOut")}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("settings.profile")}
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("settings.language")}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {t("settings.security")}
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("settings.billing")}
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              {t("settings.data")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.full_name}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          full_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? "Updating..." : t("settings.save")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t("settings.language")}
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for the platform and content
                  display
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferred-language">
                      Preferred Language
                    </Label>
                    <Select
                      value={preference.preferred_language}
                      onValueChange={(value) =>
                        updatePreference({ preferred_language: value })
                      }
                    >
                      <SelectTrigger id="preferred-language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border z-50">
                        <SelectItem value="en">🇺🇸 English</SelectItem>
                        <SelectItem value="es">🇪🇸 Español (Spanish)</SelectItem>
                        <SelectItem value="fr">
                          🇫🇷 Français (French) - Coming Soon
                        </SelectItem>
                        <SelectItem value="pt">
                          🇧🇷 Português (Portuguese) - Coming Soon
                        </SelectItem>
                        <SelectItem value="ar">
                          🇸🇦 العربية (Arabic) - Coming Soon
                        </SelectItem>
                        <SelectItem value="zh">
                          🇨🇳 中文 (Mandarin) - Coming Soon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This language will be used across Dashboard, Explore,
                      Courses, Communities, and Certificates.
                    </p>
                  </div>

                  <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <Label
                        htmlFor="show-language-first"
                        className="font-medium"
                      >
                        Show content in my language first
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, content will be filtered to show only your
                        preferred language. When disabled, all content will be
                        shown with language labels.
                      </p>
                    </div>
                    <Switch
                      id="show-language-first"
                      checked={preference.show_content_in_language_first}
                      onCheckedChange={(checked) =>
                        updatePreference({
                          show_content_in_language_first: checked,
                        })
                      }
                    />
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Interface language can be changed
                      using the language selector in the header. This setting
                      controls content language preferences for courses,
                      communities, and certificates.
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
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Reset your password by sending a reset link to your email
                  </p>
                  <Button onClick={handlePasswordReset} variant="outline">
                    Send Password Reset Email
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication will be available in a future
                    update
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

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Certificates & Data</CardTitle>
                <CardDescription>
                  Download certificates and manage your account data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Earned Certificates</h3>
                  <p className="text-sm text-muted-foreground">
                    Download and share your earned certificates
                  </p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    View Certificates
                  </Button>
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
                        <Button
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from
                            our servers. You will receive a confirmation email
                            within 7 days to complete the deletion.
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
