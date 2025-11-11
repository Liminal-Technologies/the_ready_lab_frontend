import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const EducatorAgreement = () => {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-educator-agreement">Educator Agreement</h1>
          <p className="text-muted-foreground mb-8">Last Updated: November 11, 2025</p>
          
          <Alert className="mb-8 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" data-testid="alert-placeholder">
            <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-300">
              <strong>Notice:</strong> This is placeholder content for demonstration purposes only. For the official Educator Agreement, please contact educators@thereadylab.com.
            </AlertDescription>
          </Alert>

          <Card className="p-8 space-y-8">
            <section data-testid="section-intro">
              <h2 className="text-2xl font-bold mb-4">1. Educator Program Overview</h2>
              <p className="text-muted-foreground mb-4">
                This Educator Agreement ("Agreement") governs your participation as a course creator on The Ready Lab platform. By creating and publishing courses, you agree to these terms.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>This Agreement supplements our general Terms of Service and Privacy Policy</li>
                <li>You must be 18+ years old or represent an authorized entity</li>
                <li>You retain ownership of your course content while granting us distribution rights</li>
              </ul>
            </section>

            <section data-testid="section-account">
              <h2 className="text-2xl font-bold mb-4">2. Educator Account & Verification</h2>
              <p className="text-muted-foreground mb-4">
                To become an educator on our platform, you must meet the following requirements:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Create an educator account with accurate profile information</li>
                <li>Provide expertise credentials, work history, or relevant qualifications</li>
                <li>Complete identity verification and tax documentation (W-9 or W-8BEN)</li>
                <li>Set up payment information for receiving payouts</li>
                <li>Agree to conduct yourself professionally and ethically</li>
              </ul>
            </section>

            <section data-testid="section-content">
              <h2 className="text-2xl font-bold mb-4">3. Course Content Standards</h2>
              <p className="text-muted-foreground mb-4">
                All course content must meet our quality and legal standards:
              </p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">Content Requirements</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Original content created or licensed by you</li>
                <li>High-quality video, audio, and written materials</li>
                <li>Accurate, up-to-date information relevant to course topic</li>
                <li>Clear learning objectives and structured curriculum</li>
                <li>Accessible subtitles, transcripts, and supporting materials</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-4">Prohibited Content</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Plagiarized or copyrighted material without permission</li>
                <li>Misleading, fraudulent, or unsubstantiated claims</li>
                <li>Discriminatory, harmful, or illegal content</li>
                <li>Get-rich-quick schemes or pyramid marketing</li>
                <li>Content that violates third-party rights</li>
              </ul>
            </section>

            <section data-testid="section-revenue">
              <h2 className="text-2xl font-bold mb-4">4. Revenue Sharing & Payments</h2>
              <p className="text-muted-foreground mb-4">
                Educators earn revenue based on course sales and subscription access:
              </p>
              
              <h3 className="text-lg font-semibold mb-3 mt-4">Revenue Split</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Creator Plan (Free):</strong> 85% to educator, 15% platform fee</li>
                <li><strong>Pro Plan ($99/month):</strong> 95% to educator, 5% platform fee</li>
                <li>Fees calculated after payment processing costs (Stripe ~2.9% + $0.30)</li>
                <li>Bundle and promotional pricing may have adjusted revenue splits</li>
              </ul>

              <h3 className="text-lg font-semibold mb-3 mt-4">Payout Terms</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Monthly payouts on the 15th of each month via bank transfer or PayPal</li>
                <li>Minimum payout threshold: $50 USD</li>
                <li>30-day earnings hold for refund protection</li>
                <li>Educators responsible for applicable taxes and reporting</li>
              </ul>
            </section>

            <section data-testid="section-ip">
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property Rights</h2>
              <p className="text-muted-foreground mb-4">
                You retain ownership of your course content, but grant us specific licenses:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Your Rights:</strong> You own all original course materials and can use them elsewhere</li>
                <li><strong>Platform License:</strong> You grant us a worldwide, non-exclusive license to host, distribute, and market your content</li>
                <li><strong>Student Access:</strong> Students receive a personal, non-transferable license to view content</li>
                <li><strong>Modifications:</strong> You may update courses anytime; notify students of major changes</li>
                <li><strong>Removal:</strong> You may unpublish courses, but existing student enrollments must be honored</li>
              </ul>
            </section>

            <section data-testid="section-responsibilities">
              <h2 className="text-2xl font-bold mb-4">6. Educator Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                As an educator, you agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Respond to student questions within 48 hours (or clearly state response time)</li>
                <li>Maintain course quality and update outdated information</li>
                <li>Engage with your student community respectfully</li>
                <li>Honor certificates for students who complete requirements</li>
                <li>Deliver promised live events and Q&A sessions</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not circumvent the platform to conduct off-platform sales</li>
              </ul>
            </section>

            <section data-testid="section-termination">
              <h2 className="text-2xl font-bold mb-4">7. Termination & Account Suspension</h2>
              <p className="text-muted-foreground mb-4">
                Either party may terminate this Agreement under certain conditions:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You may unpublish courses and close your account anytime with 30 days notice</li>
                <li>We may suspend or terminate accounts for violations of this Agreement</li>
                <li>Students enrolled before termination retain access to purchased courses</li>
                <li>Earned revenue will be paid out within 60 days of termination</li>
                <li>Certain provisions (IP, confidentiality) survive termination</li>
              </ul>
            </section>

            <section data-testid="section-support">
              <h2 className="text-2xl font-bold mb-4">8. Educator Support & Resources</h2>
              <p className="text-muted-foreground mb-4">
                We provide tools and support to help you succeed:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Course Builder wizard with step-by-step guidance</li>
                <li>Analytics dashboard to track enrollments and revenue</li>
                <li>Marketing tools and promotional opportunities</li>
                <li>Live streaming capabilities for events and Q&As</li>
                <li>Educator community for collaboration and best practices</li>
                <li>Dedicated support at <a href="mailto:educators@thereadylab.com" className="text-primary hover:underline">educators@thereadylab.com</a></li>
              </ul>
            </section>

            <section data-testid="section-contact">
              <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about this Educator Agreement or to request official documentation, please contact:
              </p>
              <div className="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                <p className="text-muted-foreground">
                  <strong>Educator Relations Team</strong><br />
                  The Ready Lab<br />
                  Email: <a href="mailto:educators@thereadylab.com" className="text-primary hover:underline">educators@thereadylab.com</a><br />
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

export default EducatorAgreement;
