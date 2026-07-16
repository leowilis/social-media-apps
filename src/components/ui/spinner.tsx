interface SpinnerProps {
  size?: string;
}

/** Reusable loading spinner. */
export function Spinner({ size = 'size-6' }: SpinnerProps) {
  return (
    <div
      role='status'
      aria-label='Loading'
      className={`${size} animate-spin rounded-full border-2 border-current border-t-transparent`}
    />
  );
}

/** Full-page centered spinner. */
export function PageSpinner() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-[#0e0e13]'>
      <Spinner />
    </div>
  );
}
