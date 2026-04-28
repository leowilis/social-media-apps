/**
 * Skeleton placeholder for a single PostCard.
 * Used in PostList while feed data is loading.
 */
export function PostCardSkeleton() {
  return (
    <div className="flex flex-col w-full animate-pulse">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="size-10 rounded-full bg-neutral-800" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 rounded bg-neutral-800" />
          <div className="h-2.5 w-16 rounded bg-neutral-800" />
        </div>
      </div>
      <div className="w-full aspect-square rounded-3xl bg-neutral-800" />
      <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
        <div className="h-3 w-32 rounded bg-neutral-800" />
        <div className="h-3 w-full rounded bg-neutral-800" />
      </div>
      <div className="h-px w-full bg-[rgba(126,145,183,0.1)]" />
    </div>
  );
}