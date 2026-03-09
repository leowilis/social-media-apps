"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useMe } from "@/components/site/header/hooks/useMe";
import { setToken, setIsLoggedIn } from "@/store/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HomeBottomNav } from "@/components/site/bottom/BottomNav";
import {
  IoArrowBackOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoBookmarkOutline,
} from "react-icons/io5";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { me } = useMe();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? "";

  const headerTitle =
    pathname === "/editprofile"
      ? "Edit Profile"
      : pathname === "/addpost"
      ? "Add Post"
      : me?.name ?? "";

  // Sembunyikan BottomNav di halaman tertentu
  const hideBottomNav = pathname === "/editprofile" || pathname === "/addpost";

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    setSidebarOpen(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-neutral-950 border-l border-[rgba(126,145,183,0.2)] flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(126,145,183,0.2)]">
          <span className="font-bold text-white text-lg">Menu</span>
          <Button variant="ghost" size="icon-sm"
            className="size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]"
            onClick={() => setSidebarOpen(false)}>
            <IoCloseOutline className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(126,145,183,0.2)]">
          <Avatar className="size-12 border border-[rgba(126,145,183,0.32)]">
            <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
            <AvatarFallback className="text-base font-bold">{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-white text-sm">{me?.name}</span>
            <span className="text-xs text-neutral-400">@{me?.username}</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <Link href="/myProfile" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoPersonOutline className="size-5 text-neutral-400" />
            <span className="text-sm font-semibold">My Profile</span>
          </Link>
          <Link href="/myProfile" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoBookmarkOutline className="size-5 text-neutral-400" />
            <span className="text-sm font-semibold">Saved Posts</span>
          </Link>
          <Link href="/editprofile" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoSettingsOutline className="size-5 text-neutral-400" />
            <span className="text-sm font-semibold">Edit Profile</span>
          </Link>
        </nav>

        <div className="px-3 py-4 border-t border-[rgba(126,145,183,0.2)]">
          <button onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <IoLogOutOutline className="size-5" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-black px-4 border-b border-[rgba(126,145,183,0.2)]">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm"
            className="size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]"
            onClick={() => router.back()}>
            <IoArrowBackOutline className="size-5" />
          </Button>
          <span className="text-base font-bold">{headerTitle}</span>
        </div>

        {/* Sembunyikan avatar di editprofile */}
        {!hideBottomNav && (
          <Avatar
            className="size-8 border border-[rgba(126,145,183,0.32)] cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
            <AvatarFallback className="text-sm font-bold">{avatarFallback}</AvatarFallback>
          </Avatar>
        )}
      </header>

      <main className={`pt-16 ${!hideBottomNav ? "pb-24" : "pb-8"}`}>
        {children}
      </main>

      {!hideBottomNav && <HomeBottomNav />}
    </div>
  );
}