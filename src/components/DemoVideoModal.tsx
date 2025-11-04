import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal = ({ isOpen, onClose }: DemoVideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-black border-0">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full bg-white/10 hover:bg-white/20 p-2 transition-colors"
          aria-label="Close video"
        >
          <X className="h-5 w-5 text-white" />
        </button>
        
        <div className="relative w-full pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="The Ready Lab Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
