interface ErrorStateProps {
  message?: string;
  /** Callback for the retry button. If omitted, button is not shown. */
  onRetry?: () => void;
}

/**
 * Reusable error state UI.
 * Used when a query fails and the user can optionally retry.
 */
export function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-6">
      <p className="text-neutral-400 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-full text-sm font-semibold bg-[rgba(124,92,252,0.15)] text-[#a78bff] border border-[rgba(124,92,252,0.2)]"
        >
          Try again
        </button>
      )}
    </div>
  );
}