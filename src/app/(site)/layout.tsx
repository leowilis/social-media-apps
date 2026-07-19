'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import Navbar from '@/components/site/header/Navbar';
import { HomeBottomNav } from '@/components/site/bottom/BottomNav';
import LoadingState from '@/components/common/LoadingState';

interface LayoutContentProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutContentProps) {
  const searchParams = useSearchParams();

  const hasPost = searchParams.has('postId');

  const contentClass = hasPost
    ? 'pt-20 pb-32 md:pt-0 md:pb-0'
    : 'pt-[72px] pb-32 md:pt-2 md:pb-0';

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Desktop Navbar */}
      {!hasPost && (
        <div className='hidden md:block'>
          <Navbar />
        </div>
      )}

      {/* Mobile Navbar */}
      {!hasPost && (
        <div className='md:hidden'>
          <Navbar />
        </div>
      )}

      <main className={contentClass}>{children}</main>

      {!hasPost && <HomeBottomNav />}
    </div>
  );
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingState text='Loading...' />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
