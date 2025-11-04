import { Button } from "@/components/ui/button";
import { Award, Users, ArrowRight } from "lucide-react";

const FinalCTASection = () => {
  return (
    <section className="py-16 lg:py-24 bg-yellow-500 text-white border-t border-yellow-600 transition-colors duration-200">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Get Certified. Get Funded. Get Ready.
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95">
          Join thousands who've transformed their ideas into funded ventures
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            <Award className="h-5 w-5 mr-2" />
            Start Learning
          </Button>
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            <Users className="h-5 w-5 mr-2" />
            Join Community
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm">
          <span>✓ 14-day free trial</span>
          <span>✓ No credit card required</span>
          <span>✓ Cancel anytime</span>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
