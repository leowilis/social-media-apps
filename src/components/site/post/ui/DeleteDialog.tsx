import { IoTrashOutline } from 'react-icons/io5';

interface DeleteDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** When true, shows a spinner on the Delete button and disables both buttons. */
  loading?: boolean;
}

/**
 * Reusable confirmation dialog for destructive actions.
 * Used for both post and comment deletion.
 */
export function DeleteDialog({
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
}: DeleteDialogProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm'
        onClick={onCancel}
      />

      {/* Modal */}
      <div className='fixed top-1/2 left-1/2 z-[999] w-[85vw] max-w-xs -translate-x-1/2 -translatte-y-1/2 overflow-hidden rounded-3xl border boder-white/10 bg-surface/95 shadow-2xl backdrop-blur-xl'>
        <div className='flex justify-center pt-6 pb-2'>
          <div className='flex items-center justify-center size-14 rounded-2xl border border-red-500/20 bg-red-500/10'>
            <IoTrashOutline className='size-7 text-red-400' />
          </div>
        </div>

        <div className='px-6 py-3 text-center'>
          <p className='text-base font-bold text-white mb-1'>{title}</p>
          <p className='text-sm text-neutral-500 leading-relaxed'>
            {description}
          </p>
        </div>

        <div className='flex gap-2.5 px-5 pb-5 pt-2'>
          <button
            onClick={onCancel}
            disabled={loading}
            className='flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white transition-all hover-bg-white/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className='flex flex-1 items-center justify-center rounded-2xl bg-red-500 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? (
              <div className='size-4 rounded-full border-2 border-white border-t-transparent animate-spin' />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
