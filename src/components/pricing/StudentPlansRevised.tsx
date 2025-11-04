import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function StudentPlansRevised() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">For Students</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Join for free and start learning today. No credit card required.
          </p>
          <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Free course access</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Community participation</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />
              <span>Progress tracking</span>
            </div>
          </div>
          <Button size="lg" className="px-8">
            Sign Up Free
          </Button>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-6">
            Pay Only for What You Need
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="p-6 border border-border rounded-lg bg-card">
              <h4 className="font-semibold mb-2">Premium Courses</h4>
              <p className="text-sm text-muted-foreground">
                Access specialized content from expert educators
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg bg-card">
              <h4 className="font-semibold mb-2">Certifications</h4>
              <p className="text-sm text-muted-foreground">
                Earn verified credentials to advance your career
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg bg-card">
              <h4 className="font-semibold mb-2">Private Communities</h4>
              <p className="text-sm text-muted-foreground">
                Join exclusive groups and network with peers
              </p>
            </div>
            <div className="p-6 border border-border rounded-lg bg-card">
              <h4 className="font-semibold mb-2">Live Events</h4>
              <p className="text-sm text-muted-foreground">
                Attend workshops, webinars, and Q&A sessions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
