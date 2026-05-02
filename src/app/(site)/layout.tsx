"use client";

import { Suspense } from "react";
import Navbar from "@/components/site/header/Navbar";
import { HomeBottomNav } from "@/components/site/bottom/BottomNav";
import { useSearchParams } from "next/navigation";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hasPost = !!searchParams.get("postId");

  return (
    <div className="min-h-screen bg-black">
      <div className={`${hasPost ? "md:hidden" : "block"}`}>
        <Navbar />
      </div>

      <main
        className={`
          ${
            hasPost
              ? "md:pt-0 pt-20 pb-32 md:pb-0"
              : "pt-[72px] pb-32 md:pb-0 md:pt-2"
          }
        `}
      >
        {children}
      </main>

      <div className={`${hasPost ? "hidden" : "block"}`}>
        <HomeBottomNav />
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#7c5cfc] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}