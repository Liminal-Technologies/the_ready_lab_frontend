import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Copy, CheckCircle2, ArrowLeft, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { format } from 'date-fns';

interface CertificateData {
  id: string;
  studentName: string;
  courseTitle: string;
  dateIssued: string;
  serialNumber: string;
  qrCodeUrl: string;
}

export default function CertificateView() {
  const { certificateId } = useParams<{ certificateId: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificate();
  }, [certificateId]);

  const loadCertificate = async () => {
    // Mock certificate data - in production, fetch from API
    const mockCertificate: CertificateData = {
      id: certificateId || '1',
      studentName: 'Alex Johnson',
      courseTitle: 'Advanced React Development & Best Practices',
      dateIssued: new Date().toISOString(),
      serialNumber: `TRL-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://thereadylab.com/verify/' + certificateId,
    };

    setCertificate(mockCertificate);
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    window.print();
    toast({
      title: "Certificate downloaded!",
      description: "Your certificate has been saved as PDF",
    });
  };

  const handleShareLinkedIn = () => {
    if (!certificate) return;
    
    const linkedInText = `I'm excited to share that I've completed ${certificate.courseTitle} on The Ready Lab! 🎓`;
    const verificationUrl = `https://thereadylab.com/verify/${certificate.serialNumber}`;
    
    toast({
      title: "Share to LinkedIn",
      description: linkedInText,
      duration: 5000,
    });
  };

  const handleCopyVerificationLink = () => {
    if (!certificate) return;
    
    const verificationUrl = `https://thereadylab.com/verify/${certificate.serialNumber}`;
    navigator.clipboard.writeText(verificationUrl);
    
    toast({
      title: "Link copied!",
      description: "Verification link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading certificate...</div>
        </main>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Certificate Not Found</h2>
            <Button onClick={() => navigate('/certificates')}>View My Certificates</Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background print:bg-white">
        <div className="no-print">
          <Header />
        </div>

        <main className="container mx-auto px-4 py-8 print:py-0">
          <div className="no-print mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/certificates')}
              className="mb-4"
              data-testid="button-back-to-certificates"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Certificates
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/student-view')}
              className="mb-4"
              data-testid="button-close-certificate"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Certificate Preview */}
            <Card className="relative overflow-hidden mb-8 print:shadow-none print:border-8 print:border-primary/20">
              {/* Decorative Corner Elements */}
              <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-primary/20 print:border-primary/30" />
              <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-primary/20 print:border-primary/30" />
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-primary/20 print:border-primary/30" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-primary/20 print:border-primary/30" />

              <div className="relative p-16 print:p-20">
                {/* Verification Badge - Top Right */}
                <div className="absolute top-6 right-6 no-print">
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Verified Certificate
                  </Badge>
                </div>

                <div className="text-center space-y-8">
                  {/* Logo/Header */}
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary print:text-5xl">
                      The Ready Lab
                    </h1>
                    <div className="h-1 w-32 bg-primary mx-auto" />
                  </div>

                  {/* Certificate Title */}
                  <div className="space-y-4">
                    <h2 className="text-3xl font-serif text-muted-foreground print:text-4xl">
                      Certificate of Completion
                    </h2>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                      This is to certify that
                    </p>
                  </div>

                  {/* Student Name */}
                  <div className="py-6 border-b-2 border-primary/20">
                    <h3 className="text-5xl font-serif font-bold text-primary print:text-6xl">
                      {certificate.studentName}
                    </h3>
                  </div>

                  {/* Course Title */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                      has successfully completed
                    </p>
                    <h4 className="text-2xl font-bold text-foreground print:text-3xl">
                      {certificate.courseTitle}
                    </h4>
                  </div>

                  {/* Date and Serial */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        Date Issued
                      </p>
                      <p className="text-lg font-semibold">
                        {format(new Date(certificate.dateIssued), 'MMMM d, yyyy')}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                        Certificate ID
                      </p>
                      <p className="text-lg font-mono font-semibold">
                        {certificate.serialNumber}
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="pt-8 no-print">
                    <img
                      src={certificate.qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32 mx-auto border-4 border-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Scan to verify certificate
                    </p>
                  </div>

                  {/* Print QR Code */}
                  <div className="hidden print:block pt-8">
                    <img
                      src={certificate.qrCodeUrl}
                      alt="QR Code"
                      className="w-32 h-32 mx-auto border-4 border-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Scan to verify certificate at thereadylab.com/verify
                    </p>
                  </div>

                  {/* Signature Line */}
                  <div className="pt-12 print:pt-16">
                    <div className="w-64 mx-auto border-t-2 border-muted pt-2">
                      <p className="text-sm font-semibold">The Ready Lab</p>
                      <p className="text-xs text-muted-foreground">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <Button
                onClick={handleDownloadPDF}
                className="flex-1"
                size="lg"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleShareLinkedIn}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share to LinkedIn
              </Button>
              <Button
                onClick={handleCopyVerificationLink}
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy Verification Link
              </Button>
            </div>

            {/* Verification Info */}
            <Card className="mt-8 p-6 no-print">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Certificate Verification
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This certificate can be verified at any time by scanning the QR code or visiting:
              </p>
              <code className="text-xs bg-muted px-3 py-2 rounded block">
                https://thereadylab.com/verify/{certificate.serialNumber}
              </code>
            </Card>
          </div>
        </main>

        <div className="no-print">
          <Footer />
        </div>
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          @page {
            size: A4 landscape;
            margin: 0;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:border-8 {
            border-width: 8px !important;
          }
          
          .print\\:border-primary\\/30 {
            border-color: hsl(var(--primary) / 0.3) !important;
          }
          
          .print\\:p-20 {
            padding: 5rem !important;
          }
          
          .print\\:text-5xl {
            font-size: 3rem !important;
            line-height: 1 !important;
          }
          
          .print\\:text-4xl {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
          }
          
          .print\\:text-6xl {
            font-size: 3.75rem !important;
            line-height: 1 !important;
          }
          
          .print\\:text-3xl {
            font-size: 1.875rem !important;
            line-height: 2.25rem !important;
          }
          
          .print\\:pt-16 {
            padding-top: 4rem !important;
          }
          
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </>
  );
}
