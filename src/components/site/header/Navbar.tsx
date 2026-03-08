"use client";

import Image from "next/image";
import Link from "next/link";
// Hooks
import { useSelector } from "react-redux";
import { useHeader } from "./hooks/useHeader";
// Ui Shadcn
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoArrowBackOutline, IoSearchOutline, IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
// Logo
import Logo from "@/public/assets/logo/Logo.svg";

export default function Navbar() {
  const { isProfileRoute, profileTitle, handleBack } = useHeader();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex w-full flex-col bg-[var(--base-pure-black)] text-[var(--base-pure-white)]">
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
          <div className="flex items-center gap-2">
            <Avatar className="size-12 border border-[rgba(126,145,183,0.32)]">
              <AvatarImage src="/dummy-profile-image.png" alt="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="rounded-full font-semibold text-white">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full font-semibold bg-primary-300">
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center justify-between px-4 py-0 md:hidden">
        {isProfileRoute ? (
          <>
            <div className="flex min-w-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Go back"
                onClick={handleBack}
                className="size-8 rounded-full p-0 text-white hover:bg-[rgba(126,145,183,0.18)]"
              >
                <IoArrowBackOutline className="size-[20px]" />
              </Button>
              <span className="text-md font-bold">{profileTitle}</span>
            </div>

            <Avatar className="size-8 border border-[rgba(126,145,183,0.32)]">
              <AvatarImage src="/dummy-profile-image.png" alt="avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Image src={Logo} alt="logo" width={30} height={30} priority />
              <span className="text-2xl leading-none text-white font-bold">Sociality</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                type="button"
                size="icon"
                aria-label="Open search"
                className="size-5 text-neutral-25 text-white"
              >
                <IoSearchOutline className="size-[20px]" />
              </Button>

              {isLoggedIn ? (
                <Avatar className="size-10 border border-[rgba(126,145,183,0.32)]">
                  <AvatarImage src="/dummy-profile-image.png" alt="avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  aria-label="Open menu"
                  className="size-5 text-neutral-25 text-white"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? (
                    <IoCloseOutline className="size-[30px]" />
                  ) : (
                    <IoMenuOutline className="size-[30px]" />
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Mobile dropdown menu - before login */}
      {!isLoggedIn && menuOpen && (
        <div className="flex flex-row gap-4 px-7 pb-4 md:hidden">
          <Link href="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full rounded-full font-semibold text-white border border-[rgba(126,145,183,0.32)]">
              Login
            </Button>
          </Link>
          <Link href="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
            <Button variant="ghost" className="w-full rounded-full font-semibold bg-primary-300 text-white">
              Register
            </Button>
          </Link>
        </div>
      )}

      <Separator className="bg-[rgba(126,145,183,0.2)]" />
    </header>
  );
}