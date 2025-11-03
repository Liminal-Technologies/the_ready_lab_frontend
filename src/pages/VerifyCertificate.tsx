import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

interface CertificateVerification {
  isValid: boolean;
  studentName?: string;
  courseTitle?: string;
  dateIssued?: string;
  serialNumber: string;
  qrCodeUrl?: string;
}

export default function VerifyCertificate() {
  const { serial } = useParams<{ serial: string }>();
  const [verification, setVerification] = useState<CertificateVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyCertificate();
  }, [serial]);

  const verifyCertificate = async () => {
    if (!serial) {
      setLoading(false);
      return;
    }

    // Mock verification logic - validates pattern TRL-XXXX-XXXX
    const serialPattern = /^TRL-[A-Z0-9]{4}-[A-Z0-9]{4}$/i;
    const isValid = serialPattern.test(serial);

    if (isValid) {
      // Mock valid certificate data
      const mockCertificate: CertificateVerification = {
        isValid: true,
        studentName: 'Alex Johnson',
        courseTitle: 'Advanced React Development & Best Practices',
        dateIssued: new Date('2024-01-15').toISOString(),
        serialNumber: serial,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://thereadylab.com/verify/${serial}`,
      };
      setVerification(mockCertificate);
    } else {
      // Invalid certificate
      setVerification({
        isValid: false,
        serialNumber: serial,
      });
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Verifying certificate...</div>
        </main>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">No Certificate Found</h2>
            <p className="text-muted-foreground">
              Please check the verification link and try again.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Verification Header */}
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
            <p className="text-muted-foreground">
              Verify the authenticity of certificates issued by The Ready Lab
            </p>
          </div>

          {/* Verification Result */}
          {verification.isValid ? (
            <Card className="relative overflow-hidden">
              {/* Success Banner */}
              <div className="bg-green-500/10 border-b border-green-500/20 p-6 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  Valid Certificate ✓
                </h2>
                <Badge className="bg-green-500 hover:bg-green-600 text-white">
                  Verified by The Ready Lab
                </Badge>
              </div>

              {/* Certificate Details */}
              <div className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      Certificate Holder
                    </p>
                    <h3 className="text-3xl font-bold text-primary">
                      {verification.studentName}
                    </h3>
                  </div>

                  <div className="py-4">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      Course Completed
                    </p>
                    <h4 className="text-xl font-semibold">
                      {verification.courseTitle}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                        Date Issued
                      </p>
                      <p className="text-lg font-medium">
                        {verification.dateIssued && format(new Date(verification.dateIssued), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                        Certificate ID
                      </p>
                      <p className="text-lg font-mono font-medium">
                        {verification.serialNumber}
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  {verification.qrCodeUrl && (
                    <div className="pt-6">
                      <img
                        src={verification.qrCodeUrl}
                        alt="Certificate QR Code"
                        className="w-40 h-40 mx-auto border-4 border-muted rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Authentication Message */}
                <div className="bg-muted/50 p-6 rounded-lg border border-muted">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Certificate Authenticity</h4>
                      <p className="text-sm text-muted-foreground">
                        This certificate is authentic and was issued by The Ready Lab.
                        It confirms that the certificate holder has successfully completed
                        the specified course requirements.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Verification Details */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Certificate verified on {format(new Date(), 'MMMM d, yyyy')} at {format(new Date(), 'h:mm a')}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="relative overflow-hidden">
              {/* Error Banner */}
              <div className="bg-destructive/10 border-b border-destructive/20 p-6 text-center">
                <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-destructive mb-2">
                  Invalid Certificate ✗
                </h2>
                <Badge variant="destructive">
                  Verification Failed
                </Badge>
              </div>

              {/* Error Details */}
              <div className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-lg text-muted-foreground">
                    This certificate could not be verified
                  </p>
                  
                  <div className="bg-muted/50 p-6 rounded-lg border border-muted">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                      Serial Number Entered
                    </p>
                    <p className="text-lg font-mono font-medium">
                      {verification.serialNumber}
                    </p>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-semibold mb-3">Possible Reasons:</h4>
                    <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                      <li className="flex gap-2">
                        <span className="text-destructive">•</span>
                        The certificate serial number may have been entered incorrectly
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">•</span>
                        The certificate may have been revoked or expired
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">•</span>
                        The certificate may not have been issued by The Ready Lab
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/50 p-6 rounded-lg border border-muted mt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                      <div className="text-left">
                        <h4 className="font-semibold mb-2">Need Help?</h4>
                        <p className="text-sm text-muted-foreground">
                          If you believe this is an error, please contact The Ready Lab support
                          with the certificate serial number for assistance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Attempt Details */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Verification attempted on {format(new Date(), 'MMMM d, yyyy')} at {format(new Date(), 'h:mm a')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              All certificates issued by The Ready Lab can be verified using this page.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For questions about certificate verification, please contact{' '}
              <a href="mailto:support@thereadylab.com" className="text-primary hover:underline">
                support@thereadylab.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
