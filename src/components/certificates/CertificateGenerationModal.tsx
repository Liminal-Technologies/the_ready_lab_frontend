import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, FileText, Upload, Mail, Share2, Loader2, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateGenerationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateId: string;
  courseName: string;
  studentName: string;
}

type GenerationStep = 'generating' | 'uploading' | 'emailing' | 'complete';

interface StepInfo {
  icon: React.ReactNode;
  label: string;
  description: string;
}

export function CertificateGenerationModal({
  open,
  onOpenChange,
  certificateId,
  courseName,
  studentName
}: CertificateGenerationModalProps) {
  const [currentStep, setCurrentStep] = useState<GenerationStep>('generating');
  const [progress, setProgress] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const steps: Record<GenerationStep, StepInfo> = {
    generating: {
      icon: <FileText className="h-6 w-6" />,
      label: 'Generating PDF',
      description: 'Creating your certificate with official seal...'
    },
    uploading: {
      icon: <Upload className="h-6 w-6" />,
      label: 'Uploading Certificate',
      description: 'Securely storing your certificate...'
    },
    emailing: {
      icon: <Mail className="h-6 w-6" />,
      label: 'Sending Email',
      description: 'Sending confirmation to your email...'
    },
    complete: {
      icon: <Check className="h-6 w-6" />,
      label: 'Complete!',
      description: 'Your certificate is ready'
    }
  };

  useEffect(() => {
    if (!open) {
      // Reset when modal closes
      setCurrentStep('generating');
      setProgress(0);
      setShowShareOptions(false);
      return;
    }

    // Simulate certificate generation progress
    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    const simulateProgress = () => {
      // Step 1: Generating (0-40%)
      setCurrentStep('generating');
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 40) {
            clearInterval(progressInterval);
            return 40;
          }
          return prev + 2;
        });
      }, 50);

      // Step 2: Uploading (40-70%) after 2 seconds
      stepTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        setCurrentStep('uploading');
        setProgress(40);
        
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 70) {
              clearInterval(progressInterval);
              return 70;
            }
            return prev + 2;
          });
        }, 40);

        // Step 3: Emailing (70-95%) after 3.5 seconds
        stepTimeout = setTimeout(() => {
          clearInterval(progressInterval);
          setCurrentStep('emailing');
          setProgress(70);
          
          progressInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 95) {
                clearInterval(progressInterval);
                return 95;
              }
              return prev + 2;
            });
          }, 35);

          // Step 4: Complete after 5 seconds
          stepTimeout = setTimeout(() => {
            clearInterval(progressInterval);
            setProgress(100);
            setCurrentStep('complete');
            
            // TODO: backend: trigger actual certificate generation
            // const response = await fetch(`/api/certifications/${certificateId}/download`)
          }, 1500);
        }, 1500);
      }, 2000);
    };

    simulateProgress();

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [open, certificateId]);

  const handleDownload = () => {
    // TODO: backend: download certificate from /api/certifications/:id/download
    // For now, show toast
    toast.success('Certificate downloaded!', {
      description: 'Your certificate has been saved to your downloads folder'
    });
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/verify/' + certificateId)}`;
    const shareText = `I just completed "${courseName}" and earned my certificate! 🎓 #TheFindLab #ProfessionalDevelopment #Certified`;
    
    // Pre-filled LinkedIn share (opens in new window)
    window.open(
      linkedInUrl + `&summary=${encodeURIComponent(shareText)}`,
      '_blank',
      'width=550,height=420'
    );
  };

  const handleCopyVerificationLink = () => {
    const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied!', {
      description: 'Share this link to verify your certificate'
    });
  };

  const step = steps[currentStep];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'complete' ? '🎉 Congratulations!' : 'Preparing Your Certificate'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'complete' 
              ? `You've successfully completed ${courseName}`
              : 'Please wait while we prepare your certificate'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step Indicator */}
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentStep === 'complete' 
                ? 'bg-green-500 text-white' 
                : 'bg-primary/10 text-primary'
            }`}>
              {currentStep === 'complete' ? (
                <Check className="h-6 w-6" />
              ) : (
                <Loader2 className="h-6 w-6 animate-spin" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{step.label}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Completion Actions */}
          {currentStep === 'complete' && (
            <div className="space-y-3 pt-4 border-t">
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                  <Check className="h-4 w-4" />
                  <span className="font-medium text-sm">Email Sent Successfully</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-500">
                  A copy of your certificate has been sent to your email address.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleDownload} 
                  variant="outline"
                  data-testid="button-download-certificate"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  variant="outline"
                  data-testid="button-share-certificate"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {showShareOptions && (
                <div className="space-y-2 pt-2 border-t">
                  <Button 
                    onClick={handleShareLinkedIn}
                    className="w-full bg-[#0077B5] hover:bg-[#006399] text-white"
                    data-testid="button-share-linkedin"
                  >
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    Share on LinkedIn
                  </Button>
                  <Button 
                    onClick={handleCopyVerificationLink}
                    variant="outline"
                    className="w-full"
                    data-testid="button-copy-verification"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Copy Verification Link
                  </Button>
                </div>
              )}

              <Button 
                onClick={() => onOpenChange(false)}
                className="w-full mt-2"
                data-testid="button-close-modal"
              >
                View Certificate
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
