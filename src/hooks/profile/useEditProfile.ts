'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { api } from '@/lib/axios';
import { useToast } from '@/hooks/common/useToast';

// Types
interface ProfileForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string | null;
}

// Constants
const ME_QUERY_KEY = ['me', 'profile'] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Fetcher
const fetchMe = async (): Promise<ProfileForm> => {
  const res = await api.get('/me');

  const profile = res.data.data?.profile ?? res.data.data;

  return {
    name: profile.name ?? '',
    username: profile.username ?? '',
    email: profile.email ?? '',
    phone: profile.phone ?? '',
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? null,
  };
};

// Hook
export function useEditProfile() {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5,
  });

  const [form, setForm] = useState<ProfileForm>({
    name: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    avatarUrl: null,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync profile
  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  // Cleanup object url
  useEffect(() => {
    if (!avatarPreview) return;

    return () => {
      URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Maximum image size is 5 MB.');
      return;
    }
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('username', form.username.trim());
      formData.append('phone', form.phone.trim());
      formData.append('bio', form.bio.trim());

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      await api.patch('/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await queryClient.invalidateQueries({
        queryKey: ME_QUERY_KEY,
      });

      toast.success('Profile updated successfully.');
      router.push('/myProfile');
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;

      toast.error(message ?? 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    avatarPreview,
    isLoading,
    isSaving,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  };
}
