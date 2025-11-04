import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface EducatorAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgreementAccepted: () => void;
}

const EDUCATOR_AGREEMENT_TEXT = `
EDUCATOR AGREEMENT

Welcome to The Ready Lab Educator Program! By subscribing to an Educator plan, you agree to the following terms:

1. CONTENT QUALITY
- You commit to creating high-quality, educational content
- All content must be original or properly licensed
- Content should be accurate, well-structured, and valuable to learners

2. COMMUNITY STANDARDS
- Maintain professional conduct in all interactions
- Respect intellectual property rights
- Follow platform guidelines and policies

3. COMPLIANCE
- Ensure all content complies with applicable laws and regulations
- Provide appropriate disclaimers where necessary
- Respect user privacy and data protection requirements

4. PLATFORM POLICIES
- The Ready Lab reserves the right to review and moderate content
- Violations of quality standards may result in content removal
- Repeated violations may result in account suspension

5. AUTOMATIC APPROVAL
- As a paid subscriber, you can immediately create and publish content
- Post-publication moderation may apply for quality control
- We trust our educator community to maintain high standards

By accepting this agreement, you acknowledge that you have read, understood, and agree to be bound by these terms.

Last updated: January 2025
Version: 1.0
`;

export function EducatorAgreementModal({ open, onOpenChange, onAgreementAccepted }: EducatorAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { auth } = useAuth();

  const handleAccept = async () => {
    if (!agreed) return;

    setLoading(true);
    try {
      // Get user's IP address and user agent
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      
      const { error } = await supabase
        .from('educator_agreements')
        .insert({
          user_id: auth.user!.id,
          agreement_text: EDUCATOR_AGREEMENT_TEXT,
          ip_address: ip,
          user_agent: navigator.userAgent,
          version: '1.0'
        });

      if (error) throw error;

      toast({
        title: "Agreement Accepted",
        description: "Thank you for accepting the Educator Agreement. You can now create courses and content!",
      });

      onAgreementAccepted();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving agreement:', error);
      toast({
        title: "Error",
        description: "Failed to save agreement. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Educator Agreement</DialogTitle>
        </DialogHeader>
        
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Please review and accept the Educator Agreement to complete your subscription upgrade.
          </AlertDescription>
        </Alert>

        <ScrollArea className="flex-1 my-4 border rounded-md p-4">
          <div className="whitespace-pre-wrap text-sm">
            {EDUCATOR_AGREEMENT_TEXT}
          </div>
        </ScrollArea>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="agree" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label 
              htmlFor="agree" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I have read and agree to the Educator Agreement
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!agreed || loading}
          >
            {loading ? "Accepting..." : "Accept & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}