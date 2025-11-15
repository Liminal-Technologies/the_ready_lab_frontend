import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface EmailConfirmationProps {
  email: string;
  onBack: () => void;
}

export const EmailConfirmation = ({ email, onBack }: EmailConfirmationProps) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownInterval = useRef<NodeJS.Timeout | null>(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, []);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) {
      toast.error(`Please wait ${resendCooldown} seconds before resending`);
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) throw error;

      toast.success("Email sent! Check your inbox for the confirmation link.");

      // Set 60-second cooldown
      setResendCooldown(60);
      
      // Clear existing interval if any
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
      
      cooldownInterval.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            if (cooldownInterval.current) {
              clearInterval(cooldownInterval.current);
              cooldownInterval.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend confirmation email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription className="text-base">
          We've sent a confirmation link to
        </CardDescription>
        <p className="font-medium text-foreground mt-1">{email}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Click the confirmation link</p>
              <p className="text-sm text-muted-foreground">
                Open the email and click the confirmation link to activate your account
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
            <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Check your spam folder</p>
              <p className="text-sm text-muted-foreground">
                Sometimes confirmation emails end up in spam or junk folders
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
            variant="outline"
            className="w-full"
            data-testid="button-resend-email"
          >
            {isResending ? (
              "Sending..."
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              "Resend confirmation email"
            )}
          </Button>

          <Button
            onClick={onBack}
            variant="ghost"
            className="w-full"
            data-testid="button-back-to-signup"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
