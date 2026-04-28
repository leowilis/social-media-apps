interface SpinnerProps {
  /** Size class, e.g. "size-6". Defaults to "size-6". */
  size?: string;
}

/** Reusable loading spinner. */
export function Spinner({ size = "size-6" }: SpinnerProps) {
  return (
    <div
      className={`${size} rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin`}
    />
  );
}

/** Full-page centered spinner. */
export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e0e13]">
      <Spinner />
    </div>
  );
}