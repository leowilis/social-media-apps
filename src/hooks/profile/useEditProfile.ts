import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/lib/axios';

// Types

interface ProfileForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string | null;
}

// Query Key

const ME_QUERY_KEY = ['me', 'profile'] as const;

// Fetcher

const fetchMe = async (): Promise<ProfileForm> => {
  const res = await api.get('/me');
  const p = res.data.data?.profile ?? res.data.data;
  return {
    name: p.name ?? '',
    username: p.username ?? '',
    email: p.email ?? '',
    phone: p.phone ?? '',
    bio: p.bio ?? '',
    avatarUrl: p.avatarUrl ?? null,
  };
};

// Hook

/**
 * Manages edit profile form state, avatar preview, and PATCH /me submission.
 * Invalidates the `me` query on success so Navbar and profile reflect changes.
 */
export function useEditProfile() {
  const router = useRouter();
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Sync form when query data arrives
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setError('');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('username', form.username);
      formData.append('bio', form.bio);
      formData.append('phone', form.phone);
      if (avatarFile) formData.append('avatar', avatarFile);

      await api.patch('/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.push('/myProfile');
      }, 1500);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(msg ?? 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    form,
    avatarPreview,
    isLoading,
    isSaving,
    success,
    error,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  };
}
