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
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, AlertCircle, CreditCard } from 'lucide-react';
import { PlanSelectionModal } from '@/components/educator/PlanSelectionModal';
import { EmailConfirmation } from './EmailConfirmation';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(10, 'Password must be at least 10 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'educator']).default('student')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<string>('');
  
  // Payment fields state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [paymentError, setPaymentError] = useState('');
  
  const { signUp, auth } = useAuth();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'student'
    }
  });

  const selectedRole = watch('role');

  // Pre-fill role when selectedPlan is provided, reset when it's cleared
  useEffect(() => {
    if (selectedPlan) {
      setValue('role', selectedPlan.role);
    } else {
      // Reset to default role when no plan is selected
      setValue('role', 'student');
    }
  }, [selectedPlan, setValue]);
  
  // Reset payment fields when selectedPlan changes
  useEffect(() => {
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setPaymentError('');
  }, [selectedPlan]);

  const validatePaymentFields = (): boolean => {
    setPaymentError('');
    
    // Validate card number (13-16 digits only)
    if (!cardNumber || !/^\d{13,16}$/.test(cardNumber)) {
      setPaymentError('Please enter a valid card number (13-16 digits)');
      return false;
    }
    
    // Validate expiry format and realistic values
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      setPaymentError('Please enter expiry date in MM/YY format');
      return false;
    }
    
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) {
      setPaymentError('Invalid expiry month (must be 01-12)');
      return false;
    }
    
    // Validate CVC (3-4 digits only)
    if (!cvc || !/^\d{3,4}$/.test(cvc)) {
      setPaymentError('Please enter a valid CVC code (3-4 digits)');
      return false;
    }
    
    return true;
  };
  
  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log('Starting signup process...');
      
      // Check if this is a paid plan that requires payment first
      const isPaidPlan = selectedPlan && selectedPlan.price[selectedPlan.billingCycle] > 0;
      
      if (isPaidPlan) {
        console.log('Processing payment for paid plan:', selectedPlan.name);
        
        // Validate payment fields before processing
        if (!validatePaymentFields()) {
          console.log('Payment validation failed');
          return;
        }
        
        // TODO: Replace with actual Stripe payment processing
        // const { error: paymentError } = await processStripePayment({
        //   amount: selectedPlan.price[selectedPlan.billingCycle],
        //   billingCycle: selectedPlan.billingCycle,
        //   plan: selectedPlan.name,
        //   cardNumber,
        //   expiry,
        //   cvc
        // });
        // if (paymentError) {
        //   setPaymentError(paymentError.message);
        //   return;
        // }
        
        // Simulate payment processing (2 second delay)
        toast.info('Processing payment...', {
          description: 'Please wait while we securely process your payment.'
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random payment failures (10% chance for demo purposes)
        if (Math.random() < 0.1) {
          throw new Error('Payment declined. Please check your card details and try again.');
        }
        
        console.log('Payment successful, creating account...');
        toast.success('Payment successful!', {
          description: 'Now creating your account...'
        });
      }
      
      // After payment succeeds (or for free plans), create Supabase account
      await signUp(data.email, data.password, data.role, data.fullName);
      
      console.log('Signup completed, storing email and showing confirmation...');
      // Store email and role for confirmation screen
      setSignupEmail(data.email);
      setSignupRole(data.role);
      
      // Show plan selection modal for educators if no plan was pre-selected, otherwise show email confirmation
      if (data.role === 'educator' && !selectedPlan) {
        console.log('Showing educator plan modal');
        setShowPlanModal(true);
      } else {
        console.log('Showing email confirmation');
        setShowEmailConfirmation(true);
      }
    } catch (error: any) {
      // Check if this is a payment error or signup error
      if (error.message && error.message.includes('Payment')) {
        setPaymentError(error.message);
        toast.error('Payment failed', {
          description: error.message
        });
      } else {
        // Error is stored in auth.error by useAuth hook for signup errors
        console.log('Signup failed, error in auth.error:', auth.error);
        console.error('Signup error caught:', error);
      }
    }
  };

  const handlePlanSelected = (plan: string) => {
    setShowPlanModal(false);
    setShowEmailConfirmation(true);
  };

  const handleBackToSignup = () => {
    setShowEmailConfirmation(false);
    setSignupEmail('');
  };

  // Show email confirmation screen after successful signup
  if (showEmailConfirmation) {
    return <EmailConfirmation email={signupEmail} onBack={handleBackToSignup} />;
  }

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
          {auth.error && (
            <Alert variant="destructive" data-testid="alert-signup-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {auth.error}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="pl-10"
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

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
            <Label htmlFor="role">I want to join as a...</Label>
            <Select 
              defaultValue="student" 
              value={selectedRole}
              onValueChange={(value) => setValue('role', value as 'student' | 'educator')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Student</div>
                      <div className="text-sm text-muted-foreground">Learn and get certified ($29/mo)</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="educator">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Educator</div>
                      <div className="text-sm text-muted-foreground">Teach and earn (starting at $49/mo)</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Payment Section for Paid Plans */}
          {selectedPlan && selectedPlan.price[selectedPlan.billingCycle] > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="h-4 w-4" />
                <span>Payment Information</span>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <AlertDescription className="text-sm">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Payment will be processed securely via Stripe. Your account will be created after successful payment.
                </AlertDescription>
              </Alert>

              {paymentError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{paymentError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="font-mono"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  disabled={auth.loading}
                  maxLength={16}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    className="font-mono"
                    value={expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + '/' + val.slice(2, 4);
                      }
                      setExpiry(val);
                    }}
                    disabled={auth.loading}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    type="text"
                    placeholder="123"
                    className="font-mono"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                    disabled={auth.loading}
                    maxLength={4}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                You'll be charged ${selectedPlan.price[selectedPlan.billingCycle]} {selectedPlan.billingCycle === 'monthly' ? 'per month' : 'per year'}.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={auth.loading}
            variant="hero"
          >
            {auth.loading 
              ? 'Processing...' 
              : selectedPlan && selectedPlan.price[selectedPlan.billingCycle] > 0
                ? `Pay $${selectedPlan.price[selectedPlan.billingCycle]} & Create Account`
                : 'Create Account'
            }
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>

      <PlanSelectionModal 
        open={showPlanModal}
        onOpenChange={setShowPlanModal}
        onPlanSelected={handlePlanSelected}
      />
    </Card>
  );
};