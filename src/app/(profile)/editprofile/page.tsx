'use client';

import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IoCheckmarkCircle, IoCloseCircle, IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { useEditProfile } from '../../../hooks/profile/useEditProfile';

export default function EditProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    form,
    avatarPreview,
    isLoading,
    isSaving,
    success,
    error,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  } = useEditProfile();

  const avatarSrc = avatarPreview ?? form.avatarUrl ?? '';
  const avatarFallback = form.name?.[0]?.toUpperCase() ?? '';

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <div className='size-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen bg-black text-white px-4 py-6 md:max-w-2xl md:mx-auto'>
      {success && (
        <div className='fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg'>
          <IoCheckmarkCircle className='size-5' />
          Profile Successfully Updated
        </div>
      )}

      {error && (
        <div className='fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg'>
          <IoCloseCircle className='size-5' />
          {error}
        </div>
      )}

      {/* Header — desktop only */}
      <div className='hidden md:flex items-center gap-3 mb-8'>
        <button
          onClick={() => router.back()}
          className='text-white hover:text-neutral-400 transition-colors'
        >
          <IoArrowBack className='size-5' />
        </button>
        <span className='text-lg font-bold md:text-2xl'>Edit Profile</span>
      </div>

      {/* Desktop: side by side layout */}
      <div className='md:flex md:gap-10 md:items-start'>
        {/* Avatar — left side on desktop */}
        <div className='flex flex-col items-center gap-5 mb-6 md:mb-0 md:shrink-0'>
          <Avatar className='size-20 border border-[rgba(126,145,183,0.32)] md:size-28'>
            <AvatarImage src={avatarSrc} alt={form.name} />
            <AvatarFallback className='text-2xl font-bold bg-neutral-800'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className='border border-neutral-900 rounded-full px-7 py-2'>
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              className='text-sm font-semibold text-neutral-25 hover:text-primary-300 transition-colors'
            >
              Change Photo
            </button>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleAvatarChange}
          />
        </div>

        {/* Form  */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 md:flex-1'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='name' className='text-sm font-bold text-neutral-50'>
              Name
            </Label>
            {/* Name */}
            <Input
              id='name'
              value={form.name ?? ''}
              onChange={handleChange}
              className='h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
            />
          </div>

          {/* Username */}
          <div className='flex flex-col gap-1'>
            <Label
              htmlFor='username'
              className='text-sm font-bold text-neutral-50'
            >
              Username
            </Label>
            <Input
              id='username'
              value={form.username ?? ''}
              onChange={handleChange}
              className='h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
            />
          </div>

          {/* Email */}
          <div className='flex flex-col gap-1'>
            <Label
              htmlFor='email'
              className='text-sm font-bold text-neutral-50'
            >
              Email
            </Label>
            <Input
              id='email'
              value={form.email ?? ''}
              onChange={handleChange}
              disabled
              className='h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-900 text-neutral-500 focus-visible:ring-0 cursor-not-allowed'
            />
          </div>

          {/* Number Phone */}
          <div className='flex flex-col gap-1'>
            <Label
              htmlFor='phone'
              className='text-sm font-bold text-neutral-50'
            >
              Number Phone
            </Label>
            <Input
              id='phone'
              value={form.phone ?? ''}
              onChange={handleChange}
              className='h-13 rounded-xl font-semibold border border-neutral-900 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0'
            />
          </div>

          {/* Bio */}
          <div className='flex flex-col gap-1'>
            <Label htmlFor='bio' className='text-sm font-bold text-neutral-50'>
              Bio
            </Label>
            <Textarea
              id='bio'
              value={form.bio ?? ''}
              onChange={handleChange}
              rows={3}
              placeholder='Tell something about yourself...'
              className='h-30 rounded-xl border border-neutral-900 bg-neutral-900 text-white placeholder:text-neutral-500 focus-visible:border-purple-500 focus-visible:ring-0 resize-none'
            />
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isSaving}
            className='h-13 rounded-full bg-primary-300 hover:bg-purple-700 font-bold text-white disabled:opacity-60 mt-2'
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
