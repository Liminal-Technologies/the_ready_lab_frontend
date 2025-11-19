import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DemoBanner() {
  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-sm text-blue-700 dark:text-blue-300">
        <strong>Demo Mode:</strong> This is a demonstration environment. No real accounts, payments, or data are required.
      </AlertDescription>
    </Alert>
  );
}
