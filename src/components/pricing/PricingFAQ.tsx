import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PricingFAQ = () => {
  const faqs = [
    {
      question: "Can I switch between plans?",
      answer:
        "Yes! You can upgrade or downgrade anytime. Changes take effect immediately and billing is prorated.",
    },
    {
      question: "Do certifications expire?",
      answer:
        "No — certifications are lifetime-valid and include a digital badge that you can share on LinkedIn and other professional platforms.",
    },
    {
      question: "Can I sell both digital products and courses as an educator?",
      answer:
        "Yes, Creator plans support courses, templates, digital downloads, and memberships. You have full flexibility in what you offer.",
    },
    {
      question: "What if I'm not ready to teach yet?",
      answer:
        "Start with our free creator trial — you can grow at your own pace. Use the time to explore our tools and build your first content.",
    },
    {
      question: "Are there any setup fees or hidden costs?",
      answer:
        "No setup fees! Our pricing is transparent. The only costs are your monthly subscription and the platform fees for sales (which vary by plan).",
    },
    {
      question: "How do refunds work?",
      answer:
        "We offer a 14-day free trial for all plans. After that, you can cancel anytime but refunds are handled case-by-case based on usage.",
    },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Got Questions? We've Got Answers
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about our pricing and plans
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-lg px-6 py-2 bg-card"
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold text-foreground">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default PricingFAQ;
