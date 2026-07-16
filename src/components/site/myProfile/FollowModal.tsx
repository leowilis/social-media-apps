'use client';

import FollowModalHeader from './FollowModalHeader';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import FollowUserItem from './FollowUseItem';
import { useEffect } from 'react';

export interface ModalUser {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

interface FollowModalProps {
  title: string;
  users: ModalUser[];
  loading: boolean;
  onClose: () => void;
}

export default function FollowModal({
  title,
  users,
  loading,
  onClose,
}: FollowModalProps) {
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal-title'
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm select-none'
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className='flex max-h-[70vh] w-full max-w-[400px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-background'>
        <FollowModalHeader title={title} onClose={onClose} />

        <div className='flex-1 overflow-y-auto px-4 py-1 no-scrollbar'>
          {loading ? (
            <LoadingState text={`Loading ${title.toLowerCase()}...`} />
          ) : users.length === 0 ? (
            <EmptyState
              title='No users found'
              description={`This user does not have any active ${title.toLowerCase()} connections yet.`}
            />
          ) : (
            <ul role='list' className='space-y-0.5 py-2'>
              {users.map((user) => (
                <FollowUserItem key={user.id} user={user} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
