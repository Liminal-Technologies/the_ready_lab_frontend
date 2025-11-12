// TODO: Replace with real Stripe integration
// ENV: VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..." (not exposed in code)

export interface StripeAccount {
  id: string;
  connected: boolean;
  accountStatus: 'active' | 'pending' | 'restricted' | 'disabled';
  email?: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}

export interface CheckoutSession {
  id: string;
  url: string;
  status: 'open' | 'complete' | 'expired';
}

class StripeStubService {
  private mockAccount: StripeAccount | null = null;

  /**
   * Simulates Stripe Connect account creation/connection
   * TODO: Implement real OAuth flow with Stripe Connect
   */
  async connectAccount(email: string): Promise<StripeAccount> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    this.mockAccount = {
      id: `acct_${Math.random().toString(36).substring(7)}`,
      connected: true,
      accountStatus: 'active',
      email,
      chargesEnabled: true,
      payoutsEnabled: true,
      detailsSubmitted: true,
    };

    return this.mockAccount;
  }

  /**
   * Gets current Stripe account status
   * TODO: Call real Stripe API: stripe.accounts.retrieve()
   */
  async getAccountStatus(): Promise<StripeAccount | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockAccount;
  }

  /**
   * Disconnects Stripe account
   * TODO: Implement real account disconnection
   */
  async disconnectAccount(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.mockAccount = null;
  }

  /**
   * Creates a checkout session for course purchase
   * TODO: Implement real Stripe Checkout session creation
   * @see https://stripe.com/docs/api/checkout/sessions/create
   */
  async createCheckoutSession(params: {
    priceAmount: number;
    courseName: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const sessionId = `cs_test_${Math.random().toString(36).substring(7)}`;
    
    return {
      id: sessionId,
      url: `https://checkout.stripe.com/c/pay/${sessionId}`,
      status: 'open',
    };
  }

  /**
   * Calculates platform fees and educator payout
   * Platform fee: 15% (configurable in admin settings)
   * Stripe processing: ~2.9% + $0.30
   */
  calculateFees(price: number, platformFeePercent: number = 15): {
    price: number;
    platformFee: number;
    stripeFee: number;
    educatorShare: number;
  } {
    const platformFee = price * (platformFeePercent / 100);
    const stripeFee = price * 0.029 + 0.30;
    const educatorShare = price - platformFee - stripeFee;

    return {
      price,
      platformFee: Math.round(platformFee * 100) / 100,
      stripeFee: Math.round(stripeFee * 100) / 100,
      educatorShare: Math.round(educatorShare * 100) / 100,
    };
  }
}

export const StripeStub = new StripeStubService();
