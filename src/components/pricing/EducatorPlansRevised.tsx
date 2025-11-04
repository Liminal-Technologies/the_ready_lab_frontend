import { SubscriptionCard } from "./SubscriptionCard";

const educatorPlans = [
  {
    name: "Starter",
    price: 9.99,
    priceId: "price_starter",
    description: "Perfect for new educators",
    features: [
      "Up to 3 products",
      "2 communities",
      "8% platform fee",
      "Keep 92% of revenue",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    name: "Pro",
    price: 79.99,
    priceId: "price_pro",
    description: "For growing creators",
    popular: true,
    features: [
      "Up to 100 products",
      "5 communities",
      "Unlimited admins & members",
      "4-5% platform fee",
      "Keep up to 96% of revenue",
      "Advanced analytics",
      "Priority support",
      "Marketing tools",
    ],
  },
];

export default function EducatorPlansRevised() {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Educator & Creator Plans
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your teaching journey. Scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12 items-stretch">
          {educatorPlans.map((plan) => (
            <SubscriptionCard key={plan.name} {...plan} role="educator" />
          ))}
        </div>

        <div className="bg-card rounded-lg p-8 max-w-4xl mx-auto border">
          <h3 className="text-xl font-bold mb-4">
            All Educator Plans Include:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-sm">
              <li>✓ Stripe Connect payouts</li>
              <li>✓ Course builder tools</li>
              <li>✓ Student management</li>
              <li>✓ Certification issuance</li>
            </ul>
            <ul className="space-y-2 text-sm">
              <li>✓ Community features</li>
              <li>✓ Digital product marketplace</li>
              <li>✓ Live streaming</li>
              <li>✓ Revenue analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
