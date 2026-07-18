'use client';

import { useCallback, useState } from 'react';
import { api } from '@/lib/axios';
import { useToast } from '@/hooks/common/useToast';
import type { User } from '@/types/user';

export type ModalType = 'followers' | 'following' | null;

export interface ModalUser {
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

// Normalize API response into a flat user array.
const extractUsers = (raw: User[] | FollowResponse | null): User[] => {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw;
  }

  return raw.followers ?? raw.following ?? raw.users ?? [];
};

// Transform API user into modal user model.
const toModalUser = (user: User): ModalUser => ({
  id: user.id,
  name: user.name,
  username: user.username,
  avatar: user.avatarUrl ?? '',
});

// Handles followers/following modal state and lazy data fetching.
export function useMyProfileModal(username?: string) {
  const toast = useToast();
  const [modal, setModal] = useState<ModalType>(null);
  const [modalUsers, setModalUsers] = useState<ModalUser[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback(
    async (type: Exclude<ModalType, null>) => {
      if (!username) return;

      setModal(type);
      setModalUsers([]);
      setModalLoading(true);

      try {
        const res = await api.get<{ data: User[] | FollowResponse }>(
          `/users/${username}/${type}`,
        );

        setModalUsers(extractUsers(res.data.data).map(toModalUser));
      } catch {
        toast.error(`Failed to load ${type}.`);
        setModalUsers([]);
      } finally {
        setModalLoading(false);
      }
    },
    [username, toast],
  );

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return {
    modal,
    modalUsers,
    modalLoading,
    openModal,
    closeModal,
  };
}
