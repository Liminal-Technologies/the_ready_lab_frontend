import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useMockAuth } from '@/hooks/useMockAuth';
import { toast } from 'sonner';
import { Lock, User, GraduationCap } from 'lucide-react';

// Simplified schema for demo mode - just name and role
const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  role: z.enum(['student', 'educator']).default('student')
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SelectedPlan {
  name: string;
  price: { monthly: number; annual: number };
  role: 'student' | 'educator';
  billingCycle: 'monthly' | 'annual';
}

interface SignupFormProps {
  onSwitchToLogin: () => void;
  selectedPlan?: SelectedPlan | null;
}

export const SignupForm = ({ onSwitchToLogin, selectedPlan }: SignupFormProps) => {
  const navigate = useNavigate();
  const mockAuth = useMockAuth();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'student'
    }
  });

  const selectedRole = watch('role');

  // Pre-fill role when selectedPlan is provided
  useEffect(() => {
    if (selectedPlan) {
      setValue('role', selectedPlan.role);
    } else {
      setValue('role', 'student');
    }
  }, [selectedPlan, setValue]);
  
  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log('Demo mode signup:', data.fullName, 'as', data.role);
      
      // Store user info in localStorage for demo
      localStorage.setItem('demoUserName', data.fullName);
      localStorage.setItem('demoUserRole', data.role);
      
      // Use mock authentication for instant demo login
      mockAuth.login(data.role as 'student' | 'educator');
      
      // Show success toast
      toast.success('Welcome to The Ready Lab! 🎉', {
        description: `Let's personalize your experience, ${data.fullName.split(' ')[0]}`
      });
      
      // Redirect to onboarding for personalization
      navigate('/onboarding');
      
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Signup failed', {
        description: 'Please try again'
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Join The Ready Lab</CardTitle>
        <CardDescription>
          Create your account and start building your fundable business
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedPlan && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{selectedPlan.name} Plan</h3>
                <p className="text-sm text-muted-foreground capitalize">{selectedPlan.role} Account</p>
              </div>
              <div className="text-right">
                {selectedPlan.price[selectedPlan.billingCycle] > 0 ? (
                  <>
                    <div className="text-2xl font-bold">
                      ${selectedPlan.price[selectedPlan.billingCycle]}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      /{selectedPlan.billingCycle === 'monthly' ? 'month' : 'year'}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-green-600">Free</div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="pl-10"
                data-testid="input-fullname"
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">I want to join as a...</Label>
            <Select 
              defaultValue="student" 
              value={selectedRole}
              onValueChange={(value) => setValue('role', value as 'student' | 'educator')}
            >
              <SelectTrigger data-testid="select-role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student" data-testid="select-role-student">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-sm text-muted-foreground">Learn and get certified</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="educator" data-testid="select-role-educator">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Educator</div>
                      <div className="text-sm text-muted-foreground">Teach and earn</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <AlertDescription className="text-sm">
              <Lock className="h-3 w-3 inline mr-1" />
              Demo Mode: No passwords or payment required. Click to start exploring!
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            variant="hero"
            data-testid="button-signup"
          >
            Start Your Journey →
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
              data-testid="button-switch-to-login"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};