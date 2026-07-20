'use client';

import { BsGrid3X3GapFill, BsBookmark } from 'react-icons/bs';
import { cn } from '@/lib/utils';
import type { IconType } from 'react-icons';

interface ProfileTabsProps {
  activeTab: 'gallery' | 'saved';
  onTabChange: (tab: 'gallery' | 'saved') => void;
}

const tabs: ReadonlyArray<{
  key: 'gallery' | 'saved';
  label: string;
  icon: IconType;
}> = [
  {
    key: 'gallery',
    label: 'Gallery',
    icon: BsGrid3X3GapFill,
  },
  {
    key: 'saved',
    label: 'Saved',
    icon: BsBookmark,
  },
];

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <div
      role='tablist'
      aria-label='Profile navigation'
      className='flex border-b border-white/10'
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type='button'
            role='tab'
            aria-selected={active}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 border-b-2 py-3 text-sm font-medium transition-colors',
              active
                ? 'border-white text-white'
                : 'border-transparent text-neutral-400 hover:text-white',
            )}
          >
            <Icon className='size-4' />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
