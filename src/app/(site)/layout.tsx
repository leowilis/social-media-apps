'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingState from '@/components/common/LoadingState';
import Navbar from '@/components/site/header/Navbar';
import { HomeBottomNav } from '@/components/site/bottom/BottomNav';

interface SearchLayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: SearchLayoutProps) {
  const searchParams = useSearchParams();

  const hasPost = searchParams.has('postId');

  return (
    <div className='min-h-screen bg-black'>
      {!hasPost && <Navbar />}

      <main
        className={
          hasPost
            ? 'pt-20 pb-32 md:pt-0 md:pb-0'
            : 'pt-[72px] pb-32 md:pt-2 md:pb-0'
        }
      >
        {children}
      </main>

      {!hasPost && <HomeBottomNav />}
    </div>
  );
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <Suspense fallback={<LoadingState text='Loading search...' />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
