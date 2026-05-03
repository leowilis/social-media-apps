import { useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'sonner';
import type { User } from '@/types/user';

// Types

type ModalType = 'followers' | 'following' | null;

interface ModalUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface FollowResponse {
  followers?: User[];
  following?: User[];
  users?: User[];
}

// Helper

const extractUsers = (raw: User[] | FollowResponse | null): User[] => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return raw.followers ?? raw.following ?? raw.users ?? [];
};

const toModalUser = (u: User): ModalUser => ({
  id: u.id,
  name: u.name,
  username: u.username,
  avatar: u.avatarUrl ?? '',
});

// Hook

/**
 * Manages followers/following modal state for a user profile.
 * Fetches the list lazily when the modal is opened.
 */
export function useMyProfileModal(username?: string) {
  const [modal, setModal] = useState<ModalType>(null);
  const [modalUsers, setModalUsers] = useState<ModalUser[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback(
    async (type: 'followers' | 'following') => {
      if (!username) return;
      setModal(type);
      setModalUsers([]);
      setModalLoading(true);
      try {
        const res = await api.get<{ data: User[] | FollowResponse }>(
          `/users/${username}/${type}`,
        );
        setModalUsers(extractUsers(res.data?.data).map(toModalUser));
      } catch {
        toast.error(`Failed to load list ${type}`);
        setModalUsers([]);
      } finally {
        setModalLoading(false);
      }
    },
    [username],
  );

  const closeModal = useCallback(() => setModal(null), []);

  return { modal, modalUsers, modalLoading, openModal, closeModal };
}
