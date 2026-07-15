'use client';

import { memo } from 'react';
import Link from 'next/link';
import { IoEllipsisVertical, IoTrashOutline } from 'react-icons/io5';

import dayjs from '@/lib/dayjs';
import type { Comment } from '@/lib/api/comment';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  onDelete: (id: number) => void;
}

function CommentItem({ comment, currentUserId, onDelete }: CommentItemProps) {
  const isOwner = currentUserId === comment.author.id;

  return (
    <article
      role='article'
      className='group relative flex gap-3 border-b border-neutral-900 py-4'
    >
      <Link
        href={`/profile/${comment.author.username}`}
        className='shrink-0 select-none'
      >
        <Avatar className='size-9 ring-1 ring-primary-400/20 ring-offset-1 ring-offset-[#0e0e13] md:size-13'>
          <AvatarImage
            src={comment.author.avatarUrl ?? ''}
            alt={`${comment.author.name} profile`}
          />

          <AvatarFallback className='bg-[#1a1a2e] text-xs text-primary-400'>
            {comment.author.name.trim().charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className='min-w-0 flex-1'>
        <Link href={`/profile/${comment.author.username}`}>
          <p className='mb-1 text-sm font-bold text-white transition-colors hover:text-primary-400'>
            {comment.author.name}
          </p>

          <p className='mb-2 text-xs text-neutral-500'>
            {dayjs(comment.createdAt).fromNow()}
          </p>
        </Link>

        <p className='break-words text-sm leading-relaxed text-neutral-300 whitespace-pre-line'>
          {comment.text}
        </p>
      </div>

      {isOwner && (
        <div className='shrink-0 self-start pt-0.5'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Open comment administrative options menu'
                className='size-7 rounded-lg text-neutral-500 hover:bg-white/5 hover:text-white transition-all cursor-pointer'
              >
                <IoEllipsisVertical className='size-3.5' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='end'
              className='w-32 rounded-xl border border-white/10 bg-[#0d0d14] p-1 shadow-2xl backdrop-blur-md'
            >
              <DropdownMenuItem
                onClick={() => onDelete(comment.id)}
                className='flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer outline-none'
              >
                <IoTrashOutline
                  className='size-3.5 shrink-0'
                  aria-hidden='true'
                />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </article>
  );
}

export default memo(CommentItem);
