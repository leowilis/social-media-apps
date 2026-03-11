"use client";

import { useSearchParams } from "next/navigation";
import Navbar from "@/components/site/header/Navbar";
import { HomeBottomNav } from "@/components/site/bottom/BottomNav";
import { LikeProvider } from "@/components/features/likes/LikeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const hasPost = !!searchParams.get("postId");

  return (
    <LikeProvider>
      <div className="min-h-screen bg-black">
        {/* Hide navbar on desktop when post overlay is open */}
        <div className={hasPost ? "md:hidden" : ""}>
          <Navbar />
        </div>

        <main className={hasPost ? "md:pt-0 pt-20 pb-32 md:pb-0" : "pt-18 pb-32 md:pb-0 md:pt-2"}>
          {children}
        </main>

        {/* Hide bottom nav on desktop */}
        <div className={` ${hasPost ? "hidden" : ""}`}>
          <HomeBottomNav />
        </div>
      </div>
    </LikeProvider>
  );
}