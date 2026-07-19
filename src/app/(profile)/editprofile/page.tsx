'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import LoadingState from '@/components/common/LoadingState';
import { useEditProfile } from '@/hooks/profile/useEditProfile';
import { DesktopHeader } from './components/DesktopHeader';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileForm } from './components/ProfileForm';

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    form,
    avatarPreview,
    isLoading,
    isSaving,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  } = useEditProfile();

  const avatarSrc = avatarPreview ?? form.avatarUrl ?? '';
  const avatarFallback = form.name?.charAt(0).toUpperCase() ?? '?';

  if (isLoading) {
    return <LoadingState text='Loading profile...' />;
  }

  return (
    <div className='min-h-screen bg-black px-4 py-6 text-white select-none md:mx-auto md:max-w-2xl'>
      <DesktopHeader onBack={router.back} />

      <div className='w-full pt-2 md:flex md:items-start md:gap-10'>
        <ProfileAvatar
          avatarSrc={avatarSrc}
          avatarFallback={avatarFallback}
          fileInputRef={fileInputRef}
          onAvatarChange={handleAvatarChange}
        />

        <ProfileForm
          form={form}
          isSaving={isSaving}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
