"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useHeader } from "./hooks/useHeader";
import { useMe } from "@/components/site/header/hooks/useMe";
import { setToken, setIsLoggedIn } from "@/store/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  IoArrowBackOutline,
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoBookmarkOutline,
} from "react-icons/io5";
import Logo from "@/public/assets/logo/Logo.svg";

export default function Navbar() {
  const { isProfileRoute, profileTitle, handleBack } = useHeader();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const { me } = useMe();
  const dispatch = useDispatch();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? "";

  // Use real name from API for profile header title
  const headerTitle = profileTitle === "My Profile" && me?.name ? me.name : profileTitle;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    setSidebarOpen(false);
    router.push("/login");
  };

  return (
    <>
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
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]"
            onClick={() => setSidebarOpen(false)}
          >
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
            <span className="text-xs text-[var(--neutral-500)]">@{me?.username}</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <Link href="/myProfile" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoPersonOutline className="size-5 text-[var(--neutral-500)]" />
            <span className="text-sm font-semibold">My Profile</span>
          </Link>
          <Link href="/myProfile" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoBookmarkOutline className="size-5 text-[var(--neutral-500)]" />
            <span className="text-sm font-semibold">Saved Posts</span>
          </Link>
          <Link href="/editprofile" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoSettingsOutline className="size-5 text-[var(--neutral-500)]" />
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

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-40 flex w-full flex-col bg-black text-white">
        {/* Desktop */}
        <div className="hidden h-20 items-center justify-between px-30 py-0 md:flex">
          <div className="flex items-center gap-3">
            <Image src={Logo} alt="logo" width={30} height={30} priority />
            <span className="text-2xl leading-none font-bold">Sociality</span>
          </div>

          <div className="w-full max-w-122.75 h-12">
            <div className="relative w-full">
              <IoSearchOutline className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[var(--neutral-500)]" />
              <Input
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="h-12 rounded-full border-neutral-900 bg-neutral-950 px-4 pl-11 text-[14px] leading-[20px] text-[var(--base-pure-white)] shadow-none placeholder:text-[var(--neutral-500)] focus-visible:border-[rgba(126,145,183,0.48)] focus-visible:ring-0"
              />
            </div>
          </div>

          {isLoggedIn ? (
            <Avatar className="size-12 border border-[rgba(126,145,183,0.32)] cursor-pointer"
              onClick={() => setSidebarOpen(true)}>
              <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full font-semibold text-white">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full font-semibold bg-primary-300">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="flex h-16 items-center justify-between px-4 py-0 md:hidden">
          {isProfileRoute ? (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Go back"
                  onClick={handleBack}
                  className="size-8 rounded-full p-0 text-white hover:bg-[rgba(126,145,183,0.18)]">
                  <IoArrowBackOutline className="size-[20px]" />
                </Button>
                {/* Show real name instead of "My Profile" */}
                <span className="text-md font-bold">{headerTitle}</span>
              </div>

              <Avatar className="size-8 border border-[rgba(126,145,183,0.32)] cursor-pointer"
                onClick={() => setSidebarOpen(true)}>
                <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Image src={Logo} alt="logo" width={30} height={30} priority />
                <span className="text-2xl leading-none text-white font-bold">Sociality</span>
              </div>

              <div className="flex items-center gap-4">
                <Button type="button" size="icon" aria-label="Open search" className="size-5 text-white">
                  <IoSearchOutline className="size-[20px]" />
                </Button>

                {isLoggedIn ? (
                  <Avatar className="size-10 border border-[rgba(126,145,183,0.32)] cursor-pointer"
                    onClick={() => setSidebarOpen(true)}>
                    <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                  </Avatar>
                ) : (
                  <Button type="button" size="icon" aria-label="Open menu" className="size-5 text-white"
                    onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? <IoCloseOutline className="size-[30px]" /> : <IoMenuOutline className="size-[30px]" />}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {!isLoggedIn && menuOpen && (
          <div className="flex flex-row gap-4 px-7 pb-4 md:hidden">
            <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full rounded-full font-semibold text-white border border-[rgba(126,145,183,0.32)]">Login</Button>
            </Link>
            <Link href="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full rounded-full font-semibold bg-primary-300 text-white">Register</Button>
            </Link>
          </div>
        )}

        <Separator className="bg-[rgba(126,145,183,0.2)]" />
      </header>

      <div className=" md:h-[81px]" />
    </>
  );
}