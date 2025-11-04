import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Ecudum-style Subscribe CTA Section redesigned  
const FinalCTASection = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubscribe = () => {
    if (email && agreed) {
      console.log("Subscribe:", email);
      // Handle subscription logic
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: CTA Content with ghost text */}
            <div>
              <div className="relative mb-8">
                {/* Ghost text */}
                <h2 
                  className="absolute -top-6 left-0 text-7xl md:text-8xl font-bold leading-none select-none pointer-events-none"
                  style={{ color: 'hsl(0 0% 96%)', opacity: 0.5 }}
                  aria-hidden="true"
                >
                  upcoming
                </h2>
                
                {/* Main headline */}
                <h2 className="relative text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-black dark:text-white">
                  Stay tuned for our{" "}
                  <span 
                    className="block mt-2"
                    style={{ color: 'hsl(0 0% 94%)' }}
                  >
                    upcoming full launch
                  </span>
                </h2>
              </div>

              <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Our full launch is just around the corner, bringing a wealth of new courses and features to enhance your learning journey. Stay tuned to explore our expanded offerings and{" "}
                <span className="text-neutral-400 dark:text-neutral-500">
                  don't forget to request your desired courses to shape our future curriculum according to your interests and needs!
                </span>
              </p>
            </div>

            {/* Right: Subscribe form */}
            <div className="space-y-4">
              <Input 
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl border-neutral-300 dark:border-neutral-600 px-4 text-base"
                data-testid="input-email-subscribe"
              />
              
              <Select>
                <SelectTrigger 
                  className="w-full h-12 rounded-xl border-neutral-300 dark:border-neutral-600 px-4"
                  data-testid="select-course-type"
                >
                  <SelectValue placeholder="What kind of course you want to launch next?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funding">Funding Readiness</SelectItem>
                  <SelectItem value="infrastructure">Business Infrastructure</SelectItem>
                  <SelectItem value="branding">Branding & Marketing</SelectItem>
                  <SelectItem value="ai">AI for Entrepreneurs</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-start gap-2">
                <Checkbox 
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked === true)}
                  className="mt-1"
                  data-testid="checkbox-terms"
                />
                <label 
                  htmlFor="terms"
                  className="text-sm text-neutral-600 dark:text-neutral-300 cursor-pointer"
                >
                  I have read and agree to term asd privacy.
                </label>
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={!email || !agreed}
                size="lg"
                className="w-full h-12 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: 'hsl(45 100% 51%)',
                  color: 'hsl(0 0% 0%)',
                  border: 'none'
                }}
                data-testid="button-subscribe"
              >
                Request and subscribe
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-6">
                <span>✓ 14-day free trial</span>
                <span>✓ No credit card required</span>
                <span>✓ Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;