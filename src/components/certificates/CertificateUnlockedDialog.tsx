import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, PartyPopper, Download, Share2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CertificateGenerationModal } from './CertificateGenerationModal';

interface CertificateUnlockedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  studentName: string;
  certificateId?: string;
}

export function CertificateUnlockedDialog({
  open,
  onOpenChange,
  courseName,
  studentName,
  certificateId = 'temp-' + Date.now(),
}: CertificateUnlockedDialogProps) {
  const navigate = useNavigate();
  const [showGenerationModal, setShowGenerationModal] = useState(false);

  const handleViewCertificate = () => {
    onOpenChange(false);
    setShowGenerationModal(true);
  };

  const handleGoToDashboard = () => {
    onOpenChange(false);
    navigate('/dashboard');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                <Award className="h-10 w-10 text-white" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              🎉 Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              You've completed <span className="font-semibold text-foreground">{courseName}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Achievement Card */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <div className="text-center space-y-3">
                <PartyPopper className="h-8 w-8 text-primary mx-auto" />
                <h3 className="text-lg font-bold">Certificate Unlocked!</h3>
                <p className="text-sm text-muted-foreground">
                  You've earned your official certificate of completion. 
                  This achievement is now part of your professional portfolio.
                </p>
              </div>
            </Card>

            {/* What's Next Section */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase">What's Next?</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Download className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Download your certificate and add it to your resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <Share2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Share your achievement on LinkedIn and other networks</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Join our community to connect with fellow graduates</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleViewCertificate}
                data-testid="button-view-certificate"
              >
                <Award className="h-4 w-4 mr-2" />
                View Certificate
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoToDashboard}
                data-testid="button-go-dashboard"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Generation Modal */}
      <CertificateGenerationModal
        open={showGenerationModal}
        onOpenChange={setShowGenerationModal}
        certificateId={certificateId}
        courseName={courseName}
        studentName={studentName}
      />
    </>
  );
}
