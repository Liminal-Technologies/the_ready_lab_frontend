import { CreditCard, Users, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentOptions = () => {
  const paymentMethods = [
    {
      icon: Award,
      title: "Free Access",
      description: "Many courses and tools available at no cost to get you started",
      color: "free"
    },
    {
      icon: CreditCard,
      title: "One-time Payments", 
      description: "Pay once for immediate access to all course materials",
      color: "blue"
    },
    {
      icon: CreditCard,
      title: "Installment Plans",
      description: (
        <>
          Pay in full or split into 4–6 payments through{" "}
          <span className="text-success font-medium">Klarna, Afterpay, or Affirm</span>
        </>
      ),
      color: "blue"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "border-primary/20 bg-primary/5 text-primary-foreground",
      free: "border-muted/20 bg-muted/5 text-foreground"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-primary text-primary-foreground",
      free: "bg-muted text-foreground"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">PAYMENT OPTIONS</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Flexible Payments for Real Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free courses available, plus flexible payment options for premium content and certifications.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {paymentMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card key={index} className={`border-2 ${getColorClasses(method.color)} transition-all duration-300 hover:shadow-lg`}>
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${getIconColorClasses(method.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{method.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-sm leading-relaxed">
                    {method.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PaymentOptions;