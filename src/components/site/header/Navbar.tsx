"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useHeader } from "./hooks/useHeader";
import { useMe } from "@/components/site/header/hooks/useMe";
import { setToken, setIsLoggedIn } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  IoArrowBackOutline, IoSearchOutline, IoMenuOutline, IoCloseOutline,
  IoPersonOutline, IoSettingsOutline, IoLogOutOutline, IoBookmarkOutline,
} from "react-icons/io5";
import Logo from "@/public/assets/logo/Logo.svg";

export default function Navbar() {
  const { isProfileRoute, profileTitle, handleBack } = useHeader();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const { me } = useMe();
  const dispatch = useDispatch();
  const router = useRouter();

  const [menuOpen, setMenuOpen]               = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const [searchQuery, setSearchQuery]         = useState("");
  const [showSearch, setShowSearch]           = useState(false);
  const [searchUsers, setSearchUsers]         = useState<Array<{id:number;username:string;name:string;avatarUrl?:string}>>([]);
  const [searchLoading, setSearchLoading]     = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchUsers([]); return; }
    setSearchLoading(true);
    try {
      const { default: axios } = await import("axios");
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";
      const res = await axios.get(`${baseURL}/users/search`, {
        params: { q, page: 1, limit: 10 },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSearchUsers(res.data.data?.users ?? []);
    } catch { setSearchUsers([]); }
    finally { setSearchLoading(false); }
  }, []);

  const avatarFallback = me?.name?.[0]?.toUpperCase() ?? "";
  const headerTitle = profileTitle === "My Profile" && me?.name ? me.name : profileTitle;

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setToken(""));
    dispatch(setIsLoggedIn(false));
    setSidebarOpen(false);
    setDesktopDropdown(false);
    router.push("/login");
  };

  return (
    <>
      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── MOBILE SIDEBAR ── */}
      <aside className={`fixed top-0 right-0 z-50 h-full w-72 bg-neutral-950 border-l border-[rgba(126,145,183,0.2)] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-[rgba(126,145,183,0.2)]">
          <span className="font-bold text-white text-lg">Menu</span>
          <Button variant="ghost" size="icon-sm" className="size-8 rounded-full text-white hover:bg-[rgba(126,145,183,0.18)]" onClick={() => setSidebarOpen(false)}>
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
            <span className="text-xs text-[var(--neutral-500)]">{me?.username}</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          <Link href="/myProfile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoPersonOutline className="size-5 text-[var(--neutral-500)]" />
            <span className="text-sm font-semibold">My Profile</span>
          </Link>
          <Link href="/myProfile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoBookmarkOutline className="size-5 text-[var(--neutral-500)]" />
            <span className="text-sm font-semibold">Saved Posts</span>
          </Link>
          <Link href="/editprofile" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-[rgba(126,145,183,0.12)] transition-colors">
            <IoSettingsOutline className="size-5 text-[var(--neutral-500)]" />
            <span className="text-sm font-semibold">Edit Profile</span>
          </Link>
        </nav>
        <div className="px-3 py-4 border-t border-[rgba(126,145,183,0.2)]">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <IoLogOutOutline className="size-5" />
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* ── NAVBAR ── */}
      <header className="fixed inset-x-0 top-0 z-40 flex w-full flex-col bg-black text-white">

        {/* DESKTOP */}
        <div className="hidden h-20 items-center justify-between px-16 md:flex">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image src={Logo} alt="logo" width={30} height={30} priority />
            <span className="text-2xl leading-none font-bold">Sociality</span>
          </Link>

          {/* Desktop inline search */}
          <div className="relative w-full max-w-[490px] mx-8">
            <div className="flex items-center gap-2 h-12 px-4 rounded-full border bg-neutral-950 transition-colors"
              style={{ borderColor: showSearch && searchQuery ? "rgba(124,92,252,0.4)" : "rgb(23,23,23)" }}>
              <IoSearchOutline className="size-[18px] shrink-0 text-[var(--neutral-500)]" />
              <input
                value={searchQuery}
                onFocus={() => setShowSearch(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(() => doSearch(e.target.value), 350);
                }}
                onKeyDown={(e) => { if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); setSearchUsers([]); } }}
                placeholder="Search users..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-[var(--neutral-500)] outline-none"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(""); setSearchUsers([]); }}>
                  <IoCloseOutline className="size-4 text-neutral-500" />
                </button>
              )}
            </div>
            {showSearch && searchQuery.trim() && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchUsers([]); }} />
                <div className="absolute top-14 left-0 right-0 z-40 rounded-2xl overflow-hidden"
                  style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
                  {searchLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="size-5 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
                    </div>
                  ) : searchUsers.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-1">
                      <p className="text-sm font-semibold text-neutral-400">No results found</p>
                      <p className="text-xs text-neutral-600">Change your keyword</p>
                    </div>
                  ) : (
                    <div className="px-2 py-2 space-y-0.5 max-h-80 overflow-y-auto">
                      {searchUsers.map((user) => (
                        <Link key={user.id} href={`/profile/${user.username}`}
                          onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchUsers([]); }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors">
                          <Avatar className="size-9 shrink-0" style={{ border: "1.5px solid rgba(124,92,252,0.2)" }}>
                            <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                            <AvatarFallback className="text-sm font-bold" style={{ background: "#1a1a2e", color: "#a78bff" }}>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Desktop right */}
          {isLoggedIn ? (
            <div className="relative shrink-0" suppressHydrationWarning>
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setDesktopDropdown((p) => !p)}
                suppressHydrationWarning
              >
                <Avatar className="size-12 border border-[rgba(126,145,183,0.32)]" suppressHydrationWarning>
                  <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
                  <AvatarFallback suppressHydrationWarning>{avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold text-white" suppressHydrationWarning>
                  {me?.name}
                </span>
              </div>

              {desktopDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDesktopDropdown(false)} />
                  <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl overflow-hidden"
                    style={{ background: "rgba(10,10,18,0.98)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                      <Avatar className="size-9 border border-[rgba(126,145,183,0.32)]">
                        <AvatarImage src={me?.avatarUrl ?? ""} alt={me?.name} />
                        <AvatarFallback className="text-sm font-bold">{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-white text-sm truncate">{me?.name}</span>
                        <span className="text-xs text-[var(--neutral-500)] truncate">{me?.username}</span>
                      </div>
                    </div>
                    <div className="px-2 py-2">
                      <Link href="/myProfile" onClick={() => setDesktopDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/[0.05] transition-colors">
                        <IoPersonOutline className="size-4 text-[var(--neutral-500)]" />
                        <span className="text-sm font-semibold">My Profile</span>
                      </Link>
                      <Link href="/myProfile" onClick={() => setDesktopDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/[0.05] transition-colors">
                        <IoBookmarkOutline className="size-4 text-[var(--neutral-500)]" />
                        <span className="text-sm font-semibold">Saved Posts</span>
                      </Link>
                      <Link href="/editprofile" onClick={() => setDesktopDropdown(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white hover:bg-white/[0.05] transition-colors">
                        <IoSettingsOutline className="size-4 text-[var(--neutral-500)]" />
                        <span className="text-sm font-semibold">Edit Profile</span>
                      </Link>
                    </div>
                    <div className="px-2 pb-2 border-t border-[rgba(255,255,255,0.06)] pt-2">
                      <button onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                        <IoLogOutOutline className="size-4" />
                        <span className="text-sm font-semibold">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link href="/login">
                <Button variant="ghost" className="rounded-full font-semibold text-white">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full font-semibold bg-primary-300">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE */}
        <div className="flex h-16 items-center justify-between px-4 py-0 md:hidden">
          {isProfileRoute ? (
            <>
              <div className="flex min-w-0 items-center gap-2">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Go back"
                  onClick={handleBack}
                  className="size-8 rounded-full p-0 text-white hover:bg-[rgba(126,145,183,0.18)]">
                  <IoArrowBackOutline className="size-[20px]" />
                </Button>
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
              {showSearch ? (
                <div className="flex items-center gap-2 w-full">
                  <div className="flex flex-1 items-center gap-2 px-3.5 py-2 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(124,92,252,0.4)" }}>
                    <IoSearchOutline className="size-4 shrink-0 text-[#a78bff]" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (debounceRef.current) clearTimeout(debounceRef.current);
                        debounceRef.current = setTimeout(() => doSearch(e.target.value), 350);
                      }}
                      placeholder="Search name or username..."
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none"
                      onKeyDown={(e) => { if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); } }}
                    />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(""); setSearchUsers([]); }}>
                        <IoCloseOutline className="size-4 text-neutral-500" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchUsers([]); window.dispatchEvent(new Event("search-close")); }}
                    className="shrink-0 text-sm font-semibold text-[#a78bff]">
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Image src={Logo} alt="logo" width={30} height={30} priority />
                    <span className="text-2xl leading-none text-white font-bold">Sociality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => { setShowSearch(true); window.dispatchEvent(new Event("search-open")); }}
                      aria-label="Search"
                      className="flex items-center justify-center size-9 rounded-full transition-colors hover:bg-[rgba(126,145,183,0.12)]">
                      <IoSearchOutline className="size-[22px] text-white" />
                    </button>
                    {isLoggedIn ? (
                      <Avatar className="size-9 border border-[rgba(126,145,183,0.32)] cursor-pointer"
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

        {/* Mobile search results */}
        {showSearch && searchQuery.trim() && (
          <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto" style={{ background: "#08080f" }}>
            {searchLoading ? (
              <div className="flex justify-center py-8">
                <div className="size-5 rounded-full border-2 border-[#7c5cfc] border-t-transparent animate-spin" />
              </div>
            ) : searchUsers.length === 0 ? (
              <div className="flex flex-col items-center py-10 gap-1">
                <p className="text-sm font-semibold text-neutral-400">No results found</p>
                <p className="text-xs text-neutral-600">Change your keyword</p>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-0.5">
                {searchUsers.map((user) => (
                  <Link key={user.id} href={`/profile/${user.username}`}
                    onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchUsers([]); window.dispatchEvent(new Event("search-close")); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors">
                    <Avatar className="size-10 shrink-0" style={{ border: "1.5px solid rgba(124,92,252,0.2)" }}>
                      <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
                      <AvatarFallback className="text-sm font-bold" style={{ background: "#1a1a2e", color: "#a78bff" }}>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="md:h-[81px]" />
    </>
  );
}