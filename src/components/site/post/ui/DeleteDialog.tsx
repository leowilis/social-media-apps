import { IoTrashOutline } from "react-icons/io5";

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
      <div className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999] w-[85vw] max-w-xs rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(160deg, rgba(20,20,32,0.99) 0%, rgba(10,10,18,1) 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
        }}
      >
        <div className="flex justify-center pt-6 pb-2">
          <div
            className="flex items-center justify-center size-14 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <IoTrashOutline className="size-7 text-red-400" />
          </div>
        </div>

        <div className="px-6 py-3 text-center">
          <p className="text-base font-bold text-white mb-1">{title}</p>
          <p className="text-sm text-neutral-500 leading-relaxed">{description}</p>
        </div>

        <div className="flex gap-2.5 px-5 pb-5 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)", boxShadow: "0 4px 16px rgba(239,68,68,0.35)" }}
          >
            {loading
              ? <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              : "Delete"
            }
          </button>
        </div>
      </div>
    </>
  );
}