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
import { toast } from 'sonner';
import { User, Lock } from 'lucide-react';

// Simplified schema for demo mode - just email/name
const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your name or email')
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const navigate = useNavigate();
  const mockAuth = useMockAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Demo mode login:', data.email);
      
      // Store demo user info
      localStorage.setItem('demoUserName', data.email);
      
      // Check if user previously chose a role, default to student
      const savedRole = localStorage.getItem('demoUserRole') || 'student';
      
      // Use mock authentication for instant login
      mockAuth.login(savedRole as 'student' | 'educator');
      
      // Show success toast
      toast.success('Welcome back! 🎉', {
        description: 'Logging you in...'
      });
      
      // Redirect to appropriate dashboard
      const dashboardPath = savedRole === 'educator' ? '/educator/dashboard' : '/dashboard';
      navigate(dashboardPath);
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: 'Please try again'
      });
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
          <div className="space-y-2">
            <Label htmlFor="email">Name or Email</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="text"
                placeholder="Enter your name or email"
                className="pl-10"
                data-testid="input-email"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <AlertDescription className="text-sm">
              <Lock className="h-3 w-3 inline mr-1" />
              Demo Mode: No password required. Enter any name to continue!
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            variant="hero"
            data-testid="button-login"
          >
            Continue →
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
      </CardContent>
    </Card>
  );
};