import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Base

/**
 * Base shimmer block. Use this to compose any custom skeleton shape.
 */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden='true'
      className={cn('animate-pulse rounded-lg bg-white/[0.06]', className)}
    />
  );
}

// AUTH FORM SKELETON

interface AuthFormSkeletonProps {
  fields?: number;
}

/**
 * Full-page card skeleton for Login / Register.
 * Matches card dimensions exactly so there's no layout shift on load.
 */
export function AuthFormSkeleton({ fields = 2 }: AuthFormSkeletonProps) {
  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      <div className='relative z-10 grid min-h-screen place-items-center px-6 py-8'>
        <div className='grid w-full gap-6 rounded-3xl border border-neutral-900 bg-black/20 px-4 py-8 backdrop-blur-sm md:w-[446px] md:px-6 md:py-10'>
          {/* Logo + title */}
          <div className='grid gap-4'>
            <div className='flex items-center justify-center gap-3'>
              <Skeleton className='size-8 rounded-full bg-neutral-800' />
              <Skeleton className='h-6 w-24 bg-neutral-800' />
            </div>
            <Skeleton className='mx-auto h-6 w-36 bg-neutral-800' />
          </div>

          {/* Input fields */}
          <div className='grid gap-5'>
            {Array.from({ length: fields }).map((_, i) => (
              <div key={i} className='grid gap-1.5'>
                <Skeleton className='h-4 w-20 bg-neutral-800' />
                <Skeleton className='h-12 w-full rounded-xl bg-neutral-900' />
              </div>
            ))}
          </div>

          {/* Button */}
          <Skeleton className='h-11 w-full rounded-full bg-neutral-800 md:h-12' />

          {/* Footer text */}
          <Skeleton className='mx-auto h-4 w-48 bg-neutral-800' />
        </div>
      </div>
    </div>
  );
}

// NAVBAR SKELETON

/**
 * Navbar loading skeleton.
 * Prevents layout shift and hydration mismatch while auth state hydrates.
 */
export function NavbarSkeleton() {
  return (
    <header
      aria-hidden='true'
      className='fixed inset-x-0 top-0 z-40 flex w-full flex-col bg-black text-white'
    >
      {/* Desktop */}
      <div className='hidden h-20 items-center justify-between px-16 md:flex'>
        <div className='flex items-center gap-3 shrink-0'>
          <Skeleton className='size-8 rounded-full bg-neutral-900' />
          <Skeleton className='h-5 w-24 bg-neutral-900' />
        </div>
        <Skeleton className='h-12 w-full max-w-[490px] mx-8 rounded-full bg-neutral-900' />
        <div className='flex items-center gap-3 shrink-0'>
          <Skeleton className='size-12 rounded-full bg-neutral-900' />
          <Skeleton className='h-4 w-24 bg-neutral-900' />
        </div>
      </div>

      {/* Mobile */}
      <div className='flex h-16 items-center justify-between px-4 md:hidden'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-8 rounded-full bg-neutral-900' />
          <Skeleton className='h-5 w-24 bg-neutral-900' />
        </div>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-9 rounded-full bg-neutral-900' />
          <Skeleton className='size-9 rounded-full bg-neutral-900' />
        </div>
      </div>

      <Separator className='bg-[rgba(126,145,183,0.2)]' />
    </header>
  );
}

// USER ROW SKELETON

/**
 * Single user row skeleton (avatar + name + username).
 * Reused in search results, follower/following lists.
 */
export function UserRowSkeleton() {
  return (
    <div className='flex items-center gap-3 px-3 py-2.5' aria-hidden='true'>
      <Skeleton className='size-10 rounded-full shrink-0 bg-neutral-900' />
      <div className='flex flex-col gap-1.5 flex-1'>
        <Skeleton className='h-3.5 w-28 bg-neutral-900' />
        <Skeleton className='h-3 w-20 bg-neutral-900' />
      </div>
    </div>
  );
}

// PROFILE HEADER SKELETON

/**
 * Profile page header skeleton (avatar + name + bio + stats).
 */
export function ProfileHeaderSkeleton() {
  return (
    <div className='flex flex-col gap-4 px-4 py-6' aria-hidden='true'>
      <div className='flex items-center gap-4'>
        <Skeleton className='size-20 rounded-full shrink-0 bg-neutral-900' />
        <div className='flex flex-col gap-2 flex-1'>
          <Skeleton className='h-5 w-32 bg-neutral-900' />
          <Skeleton className='h-3.5 w-24 bg-neutral-900' />
          <Skeleton className='h-3 w-full bg-neutral-900 mt-1' />
        </div>
      </div>
      {/* Stats */}
      <div className='flex gap-6 mt-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex flex-col items-center gap-1'>
            <Skeleton className='h-5 w-8 bg-neutral-900' />
            <Skeleton className='h-3 w-14 bg-neutral-900' />
          </div>
        ))}
      </div>
    </div>
  );
}

// POST CARD SKELETON

/**
 * Single post card skeleton (author row + image + actions + caption).
 */
export function PostCardSkeleton() {
  return (
    <div className='flex flex-col gap-3' aria-hidden='true'>
      {/* Author */}
      <div className='flex items-center gap-3 px-4 pt-4'>
        <Skeleton className='size-10 rounded-full shrink-0 bg-neutral-900' />
        <div className='flex flex-col gap-1.5'>
          <Skeleton className='h-3.5 w-28 bg-neutral-900' />
          <Skeleton className='h-3 w-16 bg-neutral-900' />
        </div>
      </div>
      {/* Image */}
      <Skeleton className='w-full aspect-square rounded-none bg-neutral-900' />
      {/* Actions */}
      <div className='flex gap-4 px-4'>
        <Skeleton className='h-5 w-12 bg-neutral-900' />
        <Skeleton className='h-5 w-12 bg-neutral-900' />
      </div>
      {/* Caption */}
      <div className='flex flex-col gap-1.5 px-4 pb-4'>
        <Skeleton className='h-3 w-full bg-neutral-900' />
        <Skeleton className='h-3 w-3/4 bg-neutral-900' />
      </div>
    </div>
  );
}

// FEED SKELETON

interface FeedSkeletonProps {
  /** @default 3 */
  count?: number;
}

/**
 * Full feed skeleton — stacks multiple PostCardSkeleton.
 */
export function FeedSkeleton({ count = 3 }: FeedSkeletonProps) {
  return (
    <div
      className='flex flex-col divide-y divide-white/[0.04]'
      aria-hidden='true'
    >
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

// SEARCH RESULTS SKELETON

interface SearchResultsSkeletonProps {
  /** @default 5 */
  count?: number;
}

/**
 * Skeleton for the search results list.
 * Renders multiple UserRowSkeleton.
 */
export function SearchResultsSkeleton({
  count = 5,
}: SearchResultsSkeletonProps) {
  return (
    <div className='px-2 py-2 space-y-0.5' aria-hidden='true'>
      {Array.from({ length: count }).map((_, i) => (
        <UserRowSkeleton key={i} />
      ))}
    </div>
  );
}

// POST DETAIL SKELETON

/**
 * Skeleton for the post detail page (desktop: image + side panel).
 */
export function PostDetailSkeleton() {
  return (
    <div
      className='hidden md:flex w-[1100px] max-w-[95vw] h-[700px] max-h-[92vh] rounded-2xl overflow-hidden bg-[#0e0e13] border border-white/[0.08]'
      aria-hidden='true'
    >
      {/* Left — image */}
      <Skeleton className='w-[580px] shrink-0 rounded-none bg-neutral-900' />
      {/* Right — meta */}
      <div className='flex flex-col flex-1 p-4 gap-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-9 rounded-full bg-neutral-900' />
          <div className='flex flex-col gap-1.5'>
            <Skeleton className='h-3.5 w-24 bg-neutral-900' />
            <Skeleton className='h-3 w-16 bg-neutral-900' />
          </div>
        </div>
        <Skeleton className='h-3 w-full bg-neutral-900' />
        <Skeleton className='h-3 w-2/3 bg-neutral-900' />
        <div className='flex gap-3 mt-1'>
          <Skeleton className='h-5 w-12 bg-neutral-900' />
          <Skeleton className='h-5 w-12 bg-neutral-900' />
        </div>
        <div className='flex-1 mt-2 flex flex-col gap-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <UserRowSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
