// ============================================
// SkillWeave SA — Payment Service
// Stripe integration with test/mock mode
// ============================================

export interface CheckoutSession {
  id: string;
  url: string;
  status: "pending" | "completed" | "failed";
  amount_cents: number;
  currency: string;
  module_id: string;
  module_title: string;
}

export interface PaymentService {
  createCheckoutSession(params: {
    userId: string;
    moduleId: string;
    moduleTitle: string;
    amountCents: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession>;

  verifyPayment(sessionId: string): Promise<{ paid: boolean; session: CheckoutSession }>;

  getPaymentHistory(userId: string): Promise<CheckoutSession[]>;
}

// ============================================
// Mock Payment Service (for demo / development)
// ============================================
class MockPaymentService implements PaymentService {
  private sessions: Map<string, CheckoutSession> = new Map();

  async createCheckoutSession(params: {
    userId: string;
    moduleId: string;
    moduleTitle: string;
    amountCents: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));

    const session: CheckoutSession = {
      id: `cs_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      url: `${params.successUrl}?session_id=cs_mock_success&module=${params.moduleId}`,
      status: "pending",
      amount_cents: params.amountCents,
      currency: "ZAR",
      module_id: params.moduleId,
      module_title: params.moduleTitle,
    };

    this.sessions.set(session.id, session);
    return session;
  }

  async verifyPayment(sessionId: string): Promise<{ paid: boolean; session: CheckoutSession }> {
    await new Promise((r) => setTimeout(r, 300));

    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        paid: true,
        session: {
          id: sessionId,
          url: "",
          status: "completed",
          amount_cents: 0,
          currency: "ZAR",
          module_id: "",
          module_title: "Mock Payment",
        },
      };
    }

    session.status = "completed";
    return { paid: true, session };
  }

  async getPaymentHistory(_userId: string): Promise<CheckoutSession[]> {
    await new Promise((r) => setTimeout(r, 200));
    return Array.from(this.sessions.values());
  }
}

// ============================================
// Stripe Payment Service (production)
// ============================================
class StripePaymentService implements PaymentService {
  async createCheckoutSession(params: {
    userId: string;
    moduleId: string;
    moduleTitle: string;
    amountCents: number;
    successUrl: string;
    cancelUrl: string;
  }): Promise<CheckoutSession> {
    // In production: call your /api/checkout endpoint which uses Stripe SDK
    const response = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) throw new Error("Failed to create checkout session");
    return response.json();
  }

  async verifyPayment(sessionId: string): Promise<{ paid: boolean; session: CheckoutSession }> {
    const response = await fetch(`/api/payments/verify?session_id=${sessionId}`);
    if (!response.ok) throw new Error("Failed to verify payment");
    return response.json();
  }

  async getPaymentHistory(userId: string): Promise<CheckoutSession[]> {
    const response = await fetch(`/api/payments/history?user_id=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch payment history");
    return response.json();
  }
}

// ============================================
// Factory
// ============================================
let _paymentService: PaymentService | null = null;

export function getPaymentService(): PaymentService {
  if (!_paymentService) {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (stripeKey && stripeKey.startsWith("pk_live")) {
      _paymentService = new StripePaymentService();
    } else {
      _paymentService = new MockPaymentService();
    }
  }
  return _paymentService;
}
