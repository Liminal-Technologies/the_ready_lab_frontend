import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const { auth, clearError } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
    }
  }, [isOpen, defaultMode]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      // Block accidental dismissals (ESC/outside click) if there's an error
      if (auth.error) {
        return;
      }
      clearError();
      onClose();
    }
  };

  // Explicit close button that works even with errors
  const handleExplicitClose = () => {
    clearError();
    onClose();
  };

  // Close modal and clear error when switching modes
  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    clearError();
    setMode(newMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-0">
        {/* Custom close button that always works */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50"
          onClick={handleExplicitClose}
          data-testid="button-close-modal"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        {mode === 'login' ? (
          <LoginForm onSwitchToSignup={() => handleSwitchMode('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => handleSwitchMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
};
