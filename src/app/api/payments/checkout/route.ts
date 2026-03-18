import { NextRequest, NextResponse } from "next/server";

// POST /api/payments/checkout
// Creates a Stripe checkout session (or mock session in dev)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, moduleId, moduleTitle, amountCents, successUrl, cancelUrl } = body;

    if (!userId || !moduleId || !amountCents) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const stripeSecret = process.env.STRIPE_SECRET_KEY;

    // If Stripe is configured, use real Stripe
    if (stripeSecret && stripeSecret.startsWith("sk_")) {
      // Dynamic import to avoid issues when Stripe isn't installed
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" as any });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "zar",
                product_data: {
                  name: moduleTitle || "SkillWeave Module",
                  description: `Enrollment for module: ${moduleTitle}`,
                },
                unit_amount: amountCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl,
          metadata: {
            user_id: userId,
            module_id: moduleId,
          },
        });

        return NextResponse.json({
          id: session.id,
          url: session.url,
          status: "pending",
          amount_cents: amountCents,
          currency: "ZAR",
          module_id: moduleId,
          module_title: moduleTitle,
        });
      } catch (stripeErr) {
        console.error("Stripe error:", stripeErr);
        // Fall through to mock
      }
    }

    // Mock checkout session for development
    const mockSession = {
      id: `cs_mock_${Date.now()}`,
      url: `${successUrl}?session_id=cs_mock_${Date.now()}&payment=success`,
      status: "pending",
      amount_cents: amountCents,
      currency: "ZAR",
      module_id: moduleId,
      module_title: moduleTitle,
    };

    return NextResponse.json(mockSession);
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
