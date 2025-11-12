import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  requireTypedConfirmation?: string; // If provided, user must type this exact string to confirm
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  requireTypedConfirmation,
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const [typedValue, setTypedValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isConfirmDisabled = requireTypedConfirmation 
    ? typedValue !== requireTypedConfirmation 
    : false;

  const handleConfirm = async () => {
    if (isConfirmDisabled || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onConfirm();
      setTypedValue('');
      onOpenChange(false);
    } catch (error) {
      console.error('Confirmation action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setTypedValue('');
    onOpenChange(false);
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'danger':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      default:
        return '';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`border-2 ${getBorderColor()}`}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className={`h-6 w-6 ${getIconColor()}`} />
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requireTypedConfirmation && (
          <div className="space-y-2 py-4">
            <Label htmlFor="confirm-input" className="text-sm font-medium">
              Type <span className="font-mono font-bold">{requireTypedConfirmation}</span> to confirm:
            </Label>
            <Input
              id="confirm-input"
              value={typedValue}
              onChange={(e) => setTypedValue(e.target.value)}
              placeholder={requireTypedConfirmation}
              className="font-mono"
              disabled={isProcessing || isLoading}
              data-testid="confirm-dialog-input"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isProcessing || isLoading}
            data-testid="confirm-dialog-cancel"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isProcessing || isLoading}
            className={
              variant === 'danger' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : variant === 'warning'
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                : ''
            }
            data-testid="confirm-dialog-confirm"
          >
            {isProcessing || isLoading ? 'Processing...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
