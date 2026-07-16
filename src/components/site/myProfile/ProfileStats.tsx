'use client';

import { Separator } from '@/components/ui/separator';

interface ProfileStatsProps {
  post: number;
  followers: number;
  following: number;
  likes: number;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
}

export default function ProfileStats({
  post,
  followers,
  following,
  likes,
  onOpenFollowers,
  onOpenFollowing,
}: ProfileStatsProps) {
  const items = [
    {
      label: 'Post',
      value: post,
    },
    {
      label: 'Followers',
      value: followers,
      onClick: onOpenFollowers,
    },
    {
      label: 'Following',
      value: following,
      onClick: onOpenFollowing,
    },
    {
      label: 'Likes',
      value: likes,
    },
  ];

  return (
    <div className='flex'>
      {items.map((item, index) => (
        <div key={item.label} className='flex flex-1 items-center'>
          <button
            type='button'
            onClick={item.onClick}
            disabled={!item.onClick}
            className={`flex flex-1 flex-col items-center gap-2 py-2 ${
              item.onClick
                ? 'cursor-pointer transition-opacity hover:opacity-70'
                : 'cursor-default'
            }`}
          >
            <span className='text-base font-bold'>{item.value}</span>
            <span className='text-sm text-neutral-400'>{item.label}</span>
          </button>

          {index < items.length - 1 && (
            <Separator
              orientation='vertical'
              className='h-5 bg-primary-400/20'
            />
          )}
        </div>
      ))}
    </div>
  );
}
