import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CertificateDisplay } from "./CertificateDisplay";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const CertificateModal = ({
  open,
  onOpenChange,
  ...certificateProps
}: CertificateModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Your Certificate</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-80px)] px-6 pb-6">
          <CertificateDisplay {...certificateProps} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
