import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showUnconfirmedEmail, setShowUnconfirmedEmail] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, auth } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: unconfirmedEmail,
      });

      if (error) throw error;

      toast.success("Confirmation email sent!", {
        description: "Please check your inbox and click the confirmation link.",
      });
      setShowUnconfirmedEmail(false);
    } catch (error: any) {
      toast.error("Failed to resend email", {
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      setShowUnconfirmedEmail(false);
      await signIn(data.email, data.password);
      toast.success("Welcome back! 🎉", {
        description: "You've successfully signed in to The Ready Lab",
      });
    } catch (error: any) {
      // Check if it's an email confirmation error
      if (error.message?.includes('Email not confirmed') || 
          error.message?.includes('email_not_confirmed') ||
          error.message?.includes('not confirmed')) {
        setUnconfirmedEmail(data.email);
        setShowUnconfirmedEmail(true);
      } else {
        toast.error("Sign in failed", {
          description: error.message || "Please check your credentials and try again",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to continue your learning journey at The Ready Lab
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {showUnconfirmedEmail && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-2">
                <p>Please confirm your email address before signing in.</p>
                <Button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={isResending}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isResending ? "Sending..." : "Resend confirmation email"}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || auth.loading}
            variant="hero"
            data-testid="button-login"
          >
            {(isSubmitting || auth.loading) ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              to="/pricing" 
              className="text-primary hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};