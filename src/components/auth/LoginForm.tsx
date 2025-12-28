import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMockAuth } from '@/hooks/useMockAuth';
import { authApi } from '@/services/api';
import { toast } from 'sonner';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

// Schema for real login with password
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Schema for demo mode - just email/name
const demoSchema = z.object({
  email: z.string().min(1, 'Please enter your name or email'),
  password: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const navigate = useNavigate();
  const mockAuth = useMockAuth();
  const [isDemo, setIsDemo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(isDemo ? demoSchema : loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      if (isDemo) {
        // Demo mode login (no password required)
        console.log('Demo mode login:', data.email);

        // Store demo user info
        localStorage.setItem('demoUserName', data.email);

        // Check if user previously chose a role, default to student
        const savedRole = localStorage.getItem('demoUserRole') || 'student';

        // Use mock authentication for instant login
        mockAuth.login(savedRole as 'student' | 'educator');

        toast.success('Welcome to Demo Mode!', {
          description: 'Exploring The Ready Lab...'
        });

        // Redirect to appropriate dashboard
        const dashboardPath = savedRole === 'educator' ? '/educator/dashboard' : '/dashboard';
        navigate(dashboardPath);
      } else {
        // Real login with API
        const response = await authApi.login(data.email, data.password);

        toast.success('Welcome back!', {
          description: `Signed in as ${response.user.fullName || response.user.email}`
        });

        // Redirect based on role
        const dashboardPath = response.user.role === 'educator'
          ? '/educator/dashboard'
          : response.user.role === 'admin'
            ? '/admin'
            : '/dashboard';

        navigate(dashboardPath);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsDemo(!isDemo);
    reset(); // Clear form when switching modes
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type={isDemo ? "text" : "email"}
                placeholder={isDemo ? "Enter any name to continue" : "your@email.com"}
                className="pl-10"
                data-testid="input-email"
                disabled={isLoading}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {!isDemo && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  data-testid="input-password"
                  disabled={isLoading}
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
          )}

          {isDemo && (
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <AlertDescription className="text-sm">
                <Lock className="h-3 w-3 inline mr-1" />
                Demo Mode: No password required. Enter any name to explore!
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            variant="hero"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              isDemo ? "Continue to Demo" : "Sign In"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={toggleMode}
            disabled={isLoading}
            data-testid="button-toggle-mode"
          >
            {isDemo ? "Sign in with Account" : "Try Demo Mode"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-primary hover:underline font-medium"
              data-testid="button-switch-to-signup"
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Test credentials hint */}
        {!isDemo && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
            <p className="font-medium mb-1">Test Account:</p>
            <p>Email: student@test.com</p>
            <p>Password: student123</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
