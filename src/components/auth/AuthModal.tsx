import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuth } from '@/hooks/useAuth';

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
      // Don't allow closing if there's an auth error
      if (auth.error) {
        return;
      }
      // Clear any auth errors when modal closes successfully
      clearError();
      onClose();
    }
  };

  // Close modal and clear error when switching modes
  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    clearError();
    setMode(newMode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 border-0">
        {mode === 'login' ? (
          <LoginForm onSwitchToSignup={() => handleSwitchMode('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => handleSwitchMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  );
};
