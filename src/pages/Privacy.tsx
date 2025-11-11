import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-privacy">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: November 11, 2025</p>
          
          <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" data-testid="alert-placeholder">
            <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-300">
              <strong>Notice:</strong> This is placeholder content for demonstration purposes only. For our official Privacy Policy, please contact privacy@thereadylab.com.
            </AlertDescription>
          </Alert>

          <Card className="p-8 space-y-8">
            <section data-testid="section-intro">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                The Ready Lab ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>This policy applies to all users of The Ready Lab platform</li>
                <li>By using our Service, you consent to the data practices described here</li>
                <li>We comply with GDPR, CCPA, and other applicable privacy regulations</li>
              </ul>
            </section>

            <section data-testid="section-collection">
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect several types of information to provide and improve our Service:
              </p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">Personal Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Name, email address, and profile information</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Educational background and professional details (optional)</li>
                <li>Communication preferences and language settings</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-4">Usage Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Course progress, quiz results, and completion status</li>
                <li>Community posts, comments, and interactions</li>
                <li>Live event attendance and Q&A participation</li>
                <li>Learning style preferences and course bookmarks</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-4">Technical Information</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>IP address, browser type, and device information</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Page views, time spent, and navigation patterns</li>
              </ul>
            </section>

            <section data-testid="section-usage">
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our platform and services</li>
                <li>Process transactions and send transactional communications</li>
                <li>Personalize your learning experience and course recommendations</li>
                <li>Generate and verify certificates of completion</li>
                <li>Send educational content, updates, and promotional materials (with consent)</li>
                <li>Analyze usage patterns to improve platform performance</li>
                <li>Prevent fraud, security issues, and technical problems</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section data-testid="section-sharing">
              <h2 className="text-2xl font-bold mb-4">4. Information Sharing & Disclosure</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>With Educators:</strong> Course progress and completion data for courses you enroll in</li>
                <li><strong>Service Providers:</strong> Payment processors (Stripe), hosting services, analytics tools</li>
                <li><strong>Certificate Verification:</strong> Publicly verifiable certificate data (name, course, date)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
                <li><strong>With Your Consent:</strong> Any other sharing you explicitly authorize</li>
              </ul>
            </section>

            <section data-testid="section-security">
              <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Encryption of data in transit (HTTPS/TLS) and at rest</li>
                <li>Secure authentication with password hashing and optional 2FA</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls limiting employee access to personal data</li>
                <li>No storage of payment card details (handled by Stripe)</li>
              </ul>
              <p className="text-muted-foreground mt-4 italic">
                Note: No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section data-testid="section-rights">
              <h2 className="text-2xl font-bold mb-4">6. Your Privacy Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Objection:</strong> Object to certain data processing activities</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@thereadylab.com" className="text-primary hover:underline">privacy@thereadylab.com</a>.
              </p>
            </section>

            <section data-testid="section-cookies">
              <h2 className="text-2xl font-bold mb-4">7. Cookies & Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Essential Cookies:</strong> Required for authentication and core functionality</li>
                <li><strong>Preference Cookies:</strong> Remember your settings (language, theme, etc.)</li>
                <li><strong>Analytics Cookies:</strong> Understand usage patterns and improve features</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant content and measure campaign effectiveness</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You can control cookies through your browser settings. Note that disabling certain cookies may limit platform functionality.
              </p>
            </section>

            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground">
                For questions or concerns about this Privacy Policy or our data practices, please contact:
              </p>
              <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Privacy Officer</strong><br />
                  The Ready Lab<br />
                  Email: <a href="mailto:privacy@thereadylab.com" className="text-primary hover:underline">privacy@thereadylab.com</a><br />
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

export default Privacy;
