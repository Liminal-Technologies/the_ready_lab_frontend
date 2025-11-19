import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Lock } from 'lucide-react';

interface FakeStripeCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  price: number;
  onPaymentSuccess: (paymentMethod: string) => void;
}

export function FakeStripeCheckoutModal({
  open,
  onOpenChange,
  courseTitle,
  price,
  onPaymentSuccess,
}: FakeStripeCheckoutModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const handlePayment = async (method: string) => {
    setIsProcessing(true);
    setSelectedPaymentMethod(method);
    
    // TODO: backend - Process actual payment via Stripe
    // const response = await fetch('/api/stripe/create-checkout', {
    //   method: 'POST',
    //   body: JSON.stringify({ courseId, paymentMethod: method })
    // });
    
    // Demo mode: Instant payment processing with brief UX feedback (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsProcessing(false);
    onOpenChange(false);
    onPaymentSuccess(method);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Enrollment</DialogTitle>
          <DialogDescription>
            Secure payment powered by Stripe
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div className="bg-accent/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Course</span>
                <span className="font-medium line-clamp-1 max-w-[250px]">{courseTitle}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${price}</span>
              </div>
            </div>
          </div>

          {/* Card Payment Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Credit or Debit Card</h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  data-testid="input-card-number"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                    data-testid="input-expiry"
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={3}
                    data-testid="input-cvc"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={() => handlePayment('Credit Card')}
              disabled={isProcessing}
              data-testid="button-pay-card"
            >
              {isProcessing && selectedPaymentMethod === 'Credit Card' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Pay ${price}
                </>
              )}
            </Button>
          </div>

          {/* Buy Now, Pay Later Options */}
          <div className="space-y-3">
            <Separator />
            <p className="text-sm font-medium text-center text-muted-foreground">
              Or pay in installments
            </p>

            <div className="grid gap-2">
              {/* Klarna */}
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handlePayment('Klarna')}
                disabled={isProcessing}
                data-testid="button-pay-klarna"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-pink-100 dark:bg-pink-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: '#FFB3C7' }}>Klarna</span>
                  </div>
                  <span className="text-sm">4 interest-free payments of ${(price / 4).toFixed(2)}</span>
                </div>
                {isProcessing && selectedPaymentMethod === 'Klarna' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>

              {/* Afterpay */}
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handlePayment('Afterpay')}
                disabled={isProcessing}
                data-testid="button-pay-afterpay"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-teal-100 dark:bg-teal-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: '#B2FCE4' }}>Afterpay</span>
                  </div>
                  <span className="text-sm">4 payments every 2 weeks</span>
                </div>
                {isProcessing && selectedPaymentMethod === 'Afterpay' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>

              {/* Affirm */}
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => handlePayment('Affirm')}
                disabled={isProcessing}
                data-testid="button-pay-affirm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-12 h-6 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
                    <span className="text-xs font-bold" style={{ color: '#0FA0EA' }}>Affirm</span>
                  </div>
                  <span className="text-sm">Monthly financing available</span>
                </div>
                {isProcessing && selectedPaymentMethod === 'Affirm' && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secured by Stripe • SSL Encrypted</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
