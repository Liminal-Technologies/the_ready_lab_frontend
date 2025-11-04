import { BookOpen, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer
      id="contact"
      className="bg-neutral-900 text-white py-12 border-t border-neutral-800 transition-colors duration-200"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">The Ready Lab</span>
            </div>
            <p className="text-white/70">
              Empowering learners and educators with accessible, quality
              education.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/explore"
                  className="hover:text-primary transition-colors"
                >
                  Explore
                </a>
              </li>
              <li>
                <a
                  href="/courses"
                  className="hover:text-primary transition-colors"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="/resources"
                  className="hover:text-primary transition-colors"
                >
                  Resources
                </a>
              </li>
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
              <a
                href="/resources"
                className="hover:text-primary transition-colors"
              >
                Resources
              </a>
              <a href="/terms" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="/educator-agreement"
                className="hover:text-primary transition-colors"
              >
                Educator Agreement
              </a>
              <a
                href="#contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
