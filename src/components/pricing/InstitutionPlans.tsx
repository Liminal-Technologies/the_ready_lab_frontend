import { Building2, ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InstitutionPlans = () => {

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-accent" />
            <span className="text-accent font-semibold uppercase tracking-wider text-sm">CUSTOM SOLUTIONS FOR INSTITUTIONS</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            For Institutions Who Want to Scale Impact
          </h2>
          <p className="text-muted-foreground mb-4">
            Transform your organization with custom learning solutions and white-label platforms
          </p>
        </div>

        <Card className="border-2 border-accent/20 bg-white hover:shadow-lg transition-all duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-accent mb-2">Enterprise Solutions</CardTitle>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Contact Sales Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="text-center py-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Get Custom Enterprise Solutions
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Contact our sales team to discuss your organization's specific needs, 
                  custom features, white-label options, and pricing tailored to your requirements.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-accent" />
                  <span>sales@thereadylab.co</span>
                </div>
                <div className="hidden sm:block text-border">|</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent" />
                  <span>Schedule a call</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default InstitutionPlans;