'use client';

import { IoEllipsisVertical, IoTrashOutline } from 'react-icons/io5';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PostMenuButtonProps {
  onDeleteClick: () => void;
  size?: 'sm' | 'md';
}

/**
 * PostMenuButton — Contextual menu button for post administrative ownership actions.
 * Modernized using standard shadcn tokens to eliminate raw backdrop layout clashing glitches.
 */
export function PostMenuButton({
  onDeleteClick,
  size = 'md',
}: PostMenuButtonProps) {
  const buttonSizeClass = size === 'sm' ? 'size-8' : 'size-9';
  const iconSizeClass = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <div className='relative shrink-0 select-none'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            aria-label='Open post option configuration menu'
            className={[
              'flex items-center justify-center rounded-full text-neutral-400 transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary-400 cursor-pointer active:scale-95',
              buttonSizeClass,
              size === 'md'
                ? 'border border-white/10 bg-black/60 backdrop-blur-md hover:bg-white/5 hover:text-white'
                : 'hover:bg-white/5 hover:text-white',
            ].join(' ')}
          >
            <IoEllipsisVertical className={iconSizeClass} aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align='end'
          sideOffset={6}
          className='min-w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-1 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100'
        >
          <DropdownMenuItem
            role='menuitem'
            onClick={onDeleteClick}
            className='flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold text-red-400 focus:bg-red-500/10 focus:text-red-400 outline-none cursor-pointer'
          >
            <IoTrashOutline className='size-4 shrink-0' aria-hidden='true' />
            <span>Delete Post</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
