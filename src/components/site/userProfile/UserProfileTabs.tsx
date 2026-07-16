'use client';

import { Heart, LayoutGrid } from 'lucide-react';

export type UserProfileTab = 'posts' | 'likes';

interface UserProfileTabsProps {
  activeTab: UserProfileTab;
  onTabChange: (tab: UserProfileTab) => void;
}

const tabs = [
  {
    key: 'posts',
    label: 'Gallery',
    icon: LayoutGrid,
  },
  {
    key: 'likes',
    label: 'Liked',
    icon: Heart,
  },
] as const;

export default function UserProfileTabs({
  activeTab,
  onTabChange,
}: UserProfileTabsProps) {
  return (
    <div
      role='tablist'
      aria-label='User profile feed tabs'
      className='flex border-b border-primary-400/20'
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type='button'
            role='tab'
            aria-selected={isActive}
            aria-controls={`user-profile-${tab.key}`}
            onClick={() => onTabChange(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-b-2 border-white text-white'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Icon className='size-4' />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
