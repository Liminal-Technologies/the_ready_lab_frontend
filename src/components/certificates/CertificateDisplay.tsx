import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Share2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface CertificateDisplayProps {
  certificateId: string;
  trackTitle: string;
  userName: string;
  issuedAt: string;
  serial: string;
  pdfUrl?: string;
  shareUrl?: string;
  certType: 'completion' | 'certified';
  disclaimerText?: string;
}

export const CertificateDisplay = ({
  trackTitle,
  userName,
  issuedAt,
  serial,
  pdfUrl,
  shareUrl,
  certType,
  disclaimerText,
}: CertificateDisplayProps) => {
  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      // Could add toast notification here
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-primary/5" />
      
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Certificate of {certType === 'completion' ? 'Completion' : 'Achievement'}</CardTitle>
              <CardDescription>Serial: {serial}</CardDescription>
            </div>
          </div>
          {certType === 'certified' && (
            <Badge variant="default">Certified</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="border-l-4 border-primary pl-4 py-2">
          <p className="text-sm text-muted-foreground mb-1">This certifies that</p>
          <h3 className="text-xl font-bold">{userName}</h3>
          <p className="text-sm text-muted-foreground mt-2">has successfully completed</p>
          <h4 className="text-lg font-semibold text-primary">{trackTitle}</h4>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Issued on {format(new Date(issuedAt), 'MMMM d, yyyy')}</span>
        </div>

        {disclaimerText && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground italic">
              {disclaimerText}
            </p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button onClick={handleDownload} disabled={!pdfUrl} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleShare} variant="outline" disabled={!shareUrl}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {shareUrl && (
            <Button variant="outline" size="icon" asChild>
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
