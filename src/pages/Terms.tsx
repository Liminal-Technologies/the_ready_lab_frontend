import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-terms">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: November 11, 2025</p>
          
          <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" data-testid="alert-placeholder">
            <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-300">
              <strong>Notice:</strong> This is placeholder content for demonstration purposes only. For official Terms of Service, please contact our legal team at legal@thereadylab.com.
            </AlertDescription>
          </Alert>

          <Card className="p-8 space-y-8">
            <section data-testid="section-scope">
              <h2 className="text-2xl font-bold mb-4">1. Scope & Acceptance</h2>
              <p className="text-muted-foreground mb-4">
                By accessing or using The Ready Lab platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>These terms apply to all users: students, educators, and institutions</li>
                <li>You must be at least 18 years old or have parental consent to use the Service</li>
                <li>We reserve the right to modify these terms at any time with notice</li>
              </ul>
            </section>

            <section data-testid="section-accounts">
              <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To access certain features, you must create an account and provide accurate information.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>One person or entity may not maintain more than one free account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              </ul>
            </section>

            <section data-testid="section-payments">
              <h2 className="text-2xl font-bold mb-4">3. Payments & Refunds</h2>
              <p className="text-muted-foreground mb-4">
                Certain features require payment. By purchasing, you agree to our payment terms.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>All fees are in USD unless otherwise stated</li>
                <li>Subscriptions renew automatically unless canceled</li>
                <li>Refunds are available within 30 days of purchase for eligible courses</li>
                <li>Digital products and completed courses are non-refundable</li>
                <li>Educator payouts are subject to our revenue-sharing agreement</li>
              </ul>
            </section>

            <section data-testid="section-intellectual-property">
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                Course content, platform design, and materials are protected by intellectual property laws.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Educators retain ownership of their original course content</li>
                <li>By uploading content, educators grant us a license to distribute and display it</li>
                <li>Students may not redistribute, resell, or share course materials</li>
                <li>The Ready Lab brand, logo, and platform code are our proprietary property</li>
              </ul>
            </section>

            <section data-testid="section-conduct">
              <h2 className="text-2xl font-bold mb-4">5. User Conduct & Community Guidelines</h2>
              <p className="text-muted-foreground mb-4">
                We maintain a safe, respectful learning environment. Prohibited activities include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Harassment, hate speech, or discriminatory behavior</li>
                <li>Sharing false, misleading, or plagiarized content</li>
                <li>Attempting to access unauthorized areas of the platform</li>
                <li>Spamming, phishing, or malicious activities</li>
                <li>Circumventing payment systems or abusing promotional offers</li>
              </ul>
            </section>

            <section data-testid="section-data">
              <h2 className="text-2xl font-bold mb-4">6. Data & Privacy</h2>
              <p className="text-muted-foreground mb-4">
                Your privacy is important to us. Please review our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for details on data collection and usage.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>We collect necessary information to provide the Service</li>
                <li>Course progress, certificates, and community activity are tracked</li>
                <li>We do not sell personal data to third parties</li>
                <li>You may request data export or deletion at any time</li>
              </ul>
            </section>

            <section data-testid="section-liability">
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                The Service is provided "as is" without warranties of any kind.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>We are not responsible for course quality or educator credentials</li>
                <li>We do not guarantee employment or funding outcomes</li>
                <li>Platform downtime or technical issues may occur</li>
                <li>Maximum liability is limited to fees paid in the last 12 months</li>
              </ul>
            </section>

            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">8. Support & Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service or to request official legal documentation, please contact:
              </p>
              <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Legal Department</strong><br />
                  The Ready Lab<br />
                  Email: <a href="mailto:legal@thereadylab.com" className="text-primary hover:underline">legal@thereadylab.com</a><br />
                  Support: <a href="mailto:hello@thereadylab.com" className="text-primary hover:underline">hello@thereadylab.com</a>
                </p>
              </div>
            </section>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
