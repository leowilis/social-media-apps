import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-24 text-center'>
      {icon && (
        <div className='mb-4 flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5'>
          {icon}
        </div>
      )}
      <h3 className='text-sm font-bold text-neutral-200'>{title}</h3>
      {description && (
        <p className='mt-1 max-w-sm text-xs leading-relaxed text-neutral-500'>
          {' '}
          {description}
        </p>
      )}

      {action && <div className='mt-6'>{action}</div>}
    </div>
  );
}
