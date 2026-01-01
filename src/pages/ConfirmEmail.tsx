import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash from the URL (Supabase sends the token in the hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (!accessToken || !refreshToken) {
          setStatus('error');
          setErrorMessage('Invalid or expired confirmation link.');
          // Clear the hash to clean up the URL
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }

        if (type !== 'signup') {
          setStatus('error');
          setErrorMessage('Invalid confirmation type. Please try signing up again.');
          return;
        }

        // Set the session using the tokens from the URL
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Email confirmation error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'Failed to confirm email');
          return;
        }

        if (data.session && data.user) {
          setStatus('success');
          // Store email for potential resend
          setUserEmail(data.user.email || '');
          
          // Clear the hash from URL
          window.history.replaceState(null, '', window.location.pathname);

          // Profile is created automatically by Supabase trigger (on_auth_user_created)

          // Fetch the user's role via API
          let userRole = 'student'; // Default to student

          try {
            const roleData = await api.userRoles.get(data.user.id);
            userRole = (roleData as any)?.role || 'student';
          } catch (roleError) {
            console.error('Error fetching role, defaulting to student:', roleError);
            // Continue with default role instead of failing
          }
          
          // Wait a moment then redirect to role-specific dashboard
          setTimeout(() => {
            const dashboardPath = userRole === 'educator' ? '/educator-dashboard' : '/student-dashboard';
            navigate(dashboardPath);
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage('Could not establish session. Please try logging in.');
        }
      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'An unexpected error occurred');
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  const handleResendConfirmation = async () => {
    if (!userEmail) {
      toast.error("Cannot resend - email address not found. Please sign up again.");
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      });

      if (error) throw error;

      toast.success("Confirmation email sent!", {
        description: "Please check your inbox for the new confirmation link.",
      });
    } catch (error: any) {
      toast.error("Failed to resend email", {
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            )}
            {status === 'success' && (
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirming your email...'}
            {status === 'success' && 'Email confirmed!'}
            {status === 'error' && 'Confirmation failed'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Please wait while we verify your email address'}
            {status === 'success' && 'Your account has been successfully activated. Redirecting you to your dashboard...'}
            {status === 'error' && errorMessage}
          </CardDescription>
        </CardHeader>
        {status === 'error' && (
          <CardContent className="space-y-3">
            {errorMessage.includes('expired') || errorMessage.includes('Invalid') ? (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Confirmation link expired or invalid</p>
                      <p className="text-sm text-muted-foreground">
                        Please go back to the homepage and sign up or log in
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full"
                  data-testid="button-go-home"
                >
                  Back to Home
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full"
                  data-testid="button-go-home"
                >
                  Go to Home
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full"
                  data-testid="button-try-login"
                >
                  Try logging in
                </Button>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
