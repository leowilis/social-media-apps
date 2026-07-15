import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  text?: string;
}

export default function LoadingState({
  text = 'Loading...',
}: LoadingStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-24'>
      <Loader2 className='size-6 animate-spin text-primary' />
      <p className='mt-3 text-sm text-neutral-400'>{text}</p>
    </div>
  );
}
