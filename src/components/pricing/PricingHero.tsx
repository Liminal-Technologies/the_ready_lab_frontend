import { Button } from "@/components/ui/button";

const PricingHero = () => {
  return (
    <section className="pt-24 pb-16 px-4 text-center bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
          Always Free to Learn
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Join for free and start learning today. Pay only for premium courses,
          certifications, communities, and events.
        </p>

        <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
          Whether you're building your business, teaching your expertise, or
          scaling your institution — The Ready Lab has flexible options for
          everyone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="w-full sm:w-auto">
            Start Free Trial
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Join as Educator
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Book Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingHero;
