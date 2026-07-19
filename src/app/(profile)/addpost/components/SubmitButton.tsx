'use client';

import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  disabled: boolean;
  isPending: boolean;
  onSubmit: () => void;
}

export function SubmitButton({
  disabled,
  isPending,
  onSubmit,
}: SubmitButtonProps) {
  return (
    <Button
      type='button'
      disabled={disabled}
      onClick={onSubmit}
      className='h-12 rounded-full bg-primary-300 font-bold text-white hover:bg-purple-700 disabled:opacity-50'
    >
      {isPending ? 'Sharing...' : 'Share'}
    </Button>
  );
}
