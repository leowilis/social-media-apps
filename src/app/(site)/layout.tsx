"use client";

import Navbar from "@/components/site/header/Navbar";
import { HomeBottomNav } from "@/components/site/bottom/BottomNav";
import { LikeProvider } from "@/components/features/likes/LikeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LikeProvider>
      <div className="min-h-screen bg-black">
        <Navbar />

        <main className="pt-20 pb-32">
          {children}
        </main>

        <HomeBottomNav />
      </div>
    </LikeProvider>
  );
}