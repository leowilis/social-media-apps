'use client';

import { cn } from '@/lib/utils';
import { IconType } from 'react-icons/lib';

interface ProfileTabsProps {
  activeTab: 'gallery' | 'saved';
  onTabChange: (tab: 'gallery' | 'saved') => void;
}

const tabs: ReadonlyArray<{
  key: 'gallery' | 'saved';
  label: string;
  icon: IconType;
}> = [];

export default function ProfileTabs({
  activeTab,
  onTabChange,
}: ProfileTabsProps) {
  return (
    <div
      role='tablist'
      aria-label='Profile section feeds navigation tabs'
      className='flex border-b border-primary-400/20'
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;

        return (
          <button
            id={`profile-tab-${tab.key}`}
            key={tab.key}
            type='button'
            role='tab'
            aria-selected={isActive}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors',
              isActive
                ? 'border-b-2 border-white text-white'
                : 'text-neutral-500 hover:text-white',
            )}
          >
            <Icon className='size-4 shrink-0' aria-hidden='true' />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
