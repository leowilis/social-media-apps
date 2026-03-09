"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoAdd, IoHome, IoPerson } from "react-icons/io5";
import { Button } from "@/components/ui/button";

export function HomeBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isHomeActive = pathname === "/" || pathname === "/home";
  const isProfileActive =
    pathname === "/myprofile" ||
    pathname === "/myProfile" ||
    pathname.startsWith("/profile/");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        // At the very top — always show
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down — hide
        setVisible(false);
      } else {
        // Scrolling up — show
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Home navigation"
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 h-16 md:h-20 transition-all duration-400 ease-in-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-28 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex w-full max-w-110 items-center justify-between rounded-full border border-neutral-900 bg-neutral-950 px-5 py-2 shadow-[0_20px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {/* Home */}
        <Button
          asChild
          variant="ghost"
          className={`h-auto min-w-[96px] flex-col gap-1 rounded-full px-2 py-1 ${
            isHomeActive
              ? "text-[var(--primary-200)] hover:text-[var(--primary-200)]"
              : "text-[var(--base-pure-white)] hover:text-[var(--base-pure-white)]"
          } hover:bg-transparent`}
        >
          <Link
            href="/"
            className="flex flex-col items-center gap-0.5"
            aria-current={isHomeActive ? "page" : undefined}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full ${isHomeActive ? "bg-[rgba(127,81,249,0.22)]" : "bg-[rgba(126,145,183,0.16)]"}`}
            >
              <IoHome className="size-5 md:size-6" />
            </span>
            <span className="text-xs md:text-sm font-bold">Home</span>
          </Link>
        </Button>

        {/* Add Post */}
        <Button
          asChild
          size="icon"
          aria-label="Create post"
          className="size-11 md:size-12 rounded-full bg-[linear-gradient(180deg,#7f51f9_0%,#6936f2_100%)] text-white hover:opacity-90 hover:bg-[linear-gradient(180deg,#7f51f9_0%,#6936f2_100%)]"
        >
          <Link href="/addpost">
            <IoAdd className="size-7 text-white" />
          </Link>
        </Button>

        {/* Profile */}
        <Button
          asChild
          variant="ghost"
          className={`h-auto min-w-[96px] flex-col gap-1 rounded-full px-2 py-1 ${
            isProfileActive
              ? "text-[var(--primary-200)] hover:text-[var(--primary-200)]"
              : "text-[var(--base-pure-white)] hover:text-[var(--base-pure-white)]"
          } hover:bg-transparent`}
        >
          <Link
            href="/myProfile"
            className="flex flex-col items-center gap-0.5"
            aria-current={isProfileActive ? "page" : undefined}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full ${isProfileActive ? "bg-[rgba(127,81,249,0.22)]" : "bg-white"}`}
            >
              <IoPerson
                className={`size-5 md:size-6 ${isProfileActive ? "" : "text-black"}`}
              />
            </span>
            <span className="text-xs text-white md:text-sm font-bold">
              Profile
            </span>
          </Link>
        </Button>
      </div>
    </nav>
  );
}
