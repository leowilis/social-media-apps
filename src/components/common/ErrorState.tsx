import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  retryLabel = 'Try Again',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      <div className='mb-4 flex size-16 items-center justify-center rounded-2xl border border-red-500/15 bg-red-500/10'>
        <AlertCircle className='size-7 text-red-500' />
      </div>
      <h3 className='text-sm font-bold text-white'>{title}</h3>
      <p className='mt-1 text-xs text-neutral-500'>{description}</p>
      {onRetry && (
        <Button onClick={onRetry} className='mt-5 rounded-full'>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
