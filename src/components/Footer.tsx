import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logoImage from "@assets/ready-lab-logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-neutral-900 dark:bg-black text-white py-12 border-t border-neutral-800 dark:border-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4">
        {/* FAQ Section */}
        <div className="mb-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border border-white/20 rounded-lg px-6 bg-white/5" data-testid="accordion-faq-1">
              <AccordionTrigger className="text-left hover:no-underline py-4" data-testid="trigger-faq-1">
                What is The Ready Lab?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4" data-testid="content-faq-1">
                The Ready Lab is a comprehensive Learning Management System designed for entrepreneurs, educators, and institutions. We provide courses, certifications, community features, and digital products to help you build sustainable, fundable businesses.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border border-white/20 rounded-lg px-6 bg-white/5" data-testid="accordion-faq-2">
              <AccordionTrigger className="text-left hover:no-underline py-4" data-testid="trigger-faq-2">
                How much does it cost?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4" data-testid="content-faq-2">
                We offer flexible pricing for students, educators, and institutions. Students can access free courses or subscribe to Premium ($29/month) or Pro ($49/month) plans. Educators and institutions have separate pricing tiers. Visit our <a href="/pricing" className="text-primary hover:underline">Pricing page</a> for details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border border-white/20 rounded-lg px-6 bg-white/5" data-testid="accordion-faq-3">
              <AccordionTrigger className="text-left hover:no-underline py-4" data-testid="trigger-faq-3">
                Do I get a certificate after completing a course?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4" data-testid="content-faq-3">
                Yes! Upon completing a course, you'll receive a digital certificate that can be downloaded, shared on LinkedIn, and verified by employers or institutions. All certificates include a unique verification ID.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border border-white/20 rounded-lg px-6 bg-white/5" data-testid="accordion-faq-4">
              <AccordionTrigger className="text-left hover:no-underline py-4" data-testid="trigger-faq-4">
                Can I create and sell my own courses?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4" data-testid="content-faq-4">
                Absolutely! Educators can create courses using our Course Builder tool, set their own pricing, and earn revenue through our platform. We offer Creator ($0/month with 15% fee) and Pro ($99/month with 5% fee) plans for educators.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border border-white/20 rounded-lg px-6 bg-white/5" data-testid="accordion-faq-5">
              <AccordionTrigger className="text-left hover:no-underline py-4" data-testid="trigger-faq-5">
                What learning styles do you support?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4" data-testid="content-faq-5">
                We support all four major learning styles: Visual (video tutorials), Auditory (audio lessons and Q&As), Reading/Writing (guides and worksheets), and Kinesthetic (hands-on toolkits and simulations). Filter courses by your preferred learning style!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border border-white/20 rounded-lg px-6 bg-white/5" data-testid="accordion-faq-6">
              <AccordionTrigger className="text-left hover:no-underline py-4" data-testid="trigger-faq-6">
                Is there a mobile app?
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4" data-testid="content-faq-6">
                Our platform is fully responsive and optimized for mobile browsers. You can access all features including courses, community, live events, and certificates from any device.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <img src={logoImage} alt="The Ready Lab" className="h-12 w-auto" />
            <p className="text-white/70">
              Empowering learners and educators with accessible, quality education.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/70">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/explore" className="hover:text-primary transition-colors">Explore</a></li>
              <li><a href="/courses" className="hover:text-primary transition-colors">Courses</a></li>
              <li><a href="/resources" className="hover:text-primary transition-colors">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@thereadylab.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/70 text-sm">
            <p>&copy; 2025 The Ready Lab. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/resources" className="hover:text-primary transition-colors">Resources</a>
              <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
              <a href="/educator-agreement" className="hover:text-primary transition-colors">Educator Agreement</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;