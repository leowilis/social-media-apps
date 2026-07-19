'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileAvatarProps {
  avatarSrc: string;
  avatarFallback: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileAvatar({
  avatarSrc,
  avatarFallback,
  fileInputRef,
  onAvatarChange,
}: ProfileAvatarProps) {
  return (
    <div className='flex flex-col items-center gap-5 mb-6 md:mb-0 md:shrink-0'>
      <Avatar className='size-20 border border-[rgba(126,145,183,0.32)] md:size-28'>
        <AvatarImage src={avatarSrc} alt='Profile Avatar' />
        <AvatarFallback className='bg-neutral-800 text-2xl font-bold'>
          {avatarFallback}
        </AvatarFallback>
      </Avatar>

      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        className='rounded-full border border-neutral-900 px-7 py-2 text-sm font-semibold text-neutral-100 transition-colors hover:text-primary-300'
      >
        Change Photo
      </button>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={onAvatarChange}
      />
    </div>
  );
}
