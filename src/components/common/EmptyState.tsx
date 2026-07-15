import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      {icon && (
        <div
          className='mb-4 flex size-16 items-center justify-center rounded-2xl'
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {icon}
        </div>
      )}
      <h3 className='text-sm font-bold text-neutral-200'>{title}</h3>
      {description && (
        <p className='mt-1 text-xs text-neutral-500'>{description}</p>
      )}
    </div>
  );
}
