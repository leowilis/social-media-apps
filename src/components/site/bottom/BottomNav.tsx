"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { IoAdd, IoHome, IoPerson } from "react-icons/io5";

export function HomeBottomNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [hoverAdd, setHoverAdd] = useState(false);
  const [tapped, setTapped] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [isMd, setIsMd] = useState(false);
  const lastScrollY = useRef(0);

  const isHomeActive = pathname === "/" || pathname === "/home";
  const isProfileActive = pathname === "/myprofile" || pathname === "/myProfile" || pathname.startsWith("/profile/");

  useEffect(() => {
    const check = () => setIsMd(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onOpen  = () => setSearchActive(true);
    const onClose = () => setSearchActive(false);
    window.addEventListener("search-open",  onOpen);
    window.addEventListener("search-close", onClose);
    return () => {
      window.removeEventListener("search-open",  onOpen);
      window.removeEventListener("search-close", onClose);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y <= 10) setVisible(true);
      else if (y > lastScrollY.current) setVisible(false);
      else setVisible(true);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tap = (key: string) => {
    setTapped(key);
    setTimeout(() => setTapped(null), 400);
  };

  // Desktop sizes
  const baseWidth = isMd ? 360 : 280;
  const hoverWidth = isMd ? 460 : 320;
  const addHoverWidth = isMd ? 180 : 148;
  const addBaseSize = isMd ? 52 : 44;
  const addHeight = isMd ? 52 : 44;

  return (
    <>
      <style>{`
        @keyframes navSlideUp {
          from { transform: translateY(80px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes iconBounce {
          0%   { transform: scale(1); }
          35%  { transform: scale(0.8) translateY(-2px); }
          70%  { transform: scale(1.2) translateY(-1px); }
          100% { transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(250%) skewX(-20deg); }
        }
        @keyframes dotPop {
          from { transform: translateX(-50%) scaleX(0); opacity: 0; }
          to   { transform: translateX(-50%) scaleX(1); opacity: 1; }
        }
        .nav-enter  { animation: navSlideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .icon-tap   { animation: iconBounce 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .dot-pop    { animation: dotPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
      `}</style>

      <nav
        aria-label="Bottom navigation"
        className={`nav-enter pointer-events-none fixed inset-x-0 bottom-4 md:bottom-6 z-40 flex justify-center px-6 transition-all duration-500 ${
          visible && !searchActive ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
        }`}
      >
        <div
          className="pointer-events-auto relative flex items-center justify-between px-3 py-2 md:px-7 md:py-2"
          style={{
            width: hoverAdd ? hoverWidth : baseWidth,
            borderRadius: 30,
            transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            background: "rgba(10,10,18,0.96)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(28px)",
          }}
        >
          <div className="absolute inset-x-10 top-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
          />

          {/* ── HOME ── */}
          <Link href="/" onClick={() => tap("home")} aria-current={isHomeActive ? "page" : undefined}
            className="relative flex flex-col items-center justify-center gap-0.5 w-14 py-1.5 md:w-20 md:py-2 rounded-2xl select-none">
            {isHomeActive && (
              <div className="absolute inset-0 rounded-2xl"
                style={{ background: "radial-gradient(ellipse at center, rgba(124,92,252,0.15) 0%, transparent 70%)" }} />
            )}
            <IoHome className={`size-[18px] md:size-5 transition-colors duration-200 ${tapped === "home" ? "icon-tap" : ""}`}
              style={{ color: isHomeActive ? "#b49fff" : "rgba(255,255,255,0.28)", filter: isHomeActive ? "drop-shadow(0 0 5px rgba(180,159,255,0.8))" : "none" }} />
            <span className="text-[9px] md:text-[11px] font-semibold"
              style={{ color: isHomeActive ? "#b49fff" : "rgba(255,255,255,0.22)", letterSpacing: "0.05em" }}>Home</span>
            {isHomeActive && (
              <div className="absolute bottom-0.5 left-1/2 h-0.5 w-4 rounded-full dot-pop"
                style={{ background: "linear-gradient(90deg, #7c5cfc, #b49fff)", boxShadow: "0 0 6px #a78bff" }} />
            )}
          </Link>

          {/* ── ADD POST ── */}
          <Link href="/addpost" aria-label="Add new post" onClick={() => tap("add")}
            onMouseEnter={() => setHoverAdd(true)} onMouseLeave={() => setHoverAdd(false)}
            className="btn-shimmer relative flex items-center justify-center select-none active:scale-95 overflow-hidden"
            style={{
              height: addHeight,
              borderRadius: 999,
              width: hoverAdd ? addHoverWidth : addBaseSize,
              transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
              background: "linear-gradient(135deg, #c084fc 0%, #7c5cfc 45%, #4f28e0 100%)",
              boxShadow: hoverAdd
                ? "0 0 0 1px rgba(192,132,252,0.5), 0 6px 24px rgba(124,92,252,0.7), inset 0 1px 0 rgba(255,255,255,0.25)"
                : "0 0 0 1px rgba(167,139,255,0.25), 0 4px 14px rgba(124,92,252,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}>
            <div className="absolute inset-x-3 top-1 h-px rounded-full pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
            <IoAdd className="size-5 md:size-6 text-white shrink-0 relative z-10"
              style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))", transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", transform: hoverAdd ? "rotate(90deg)" : "rotate(0deg)" }} />
            <span className="text-white text-[13px] md:text-sm font-bold relative z-10 whitespace-nowrap overflow-hidden"
              style={{ maxWidth: hoverAdd ? 120 : 0, opacity: hoverAdd ? 1 : 0, transition: "max-width 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.05s, opacity 0.2s ease 0.1s", letterSpacing: "0.02em" }}>
              Add New Post
            </span>
          </Link>

          {/* ── PROFILE ── */}
          <Link href="/myProfile" onClick={() => tap("profile")} aria-current={isProfileActive ? "page" : undefined}
            className="relative flex flex-col items-center justify-center gap-0.5 w-14 py-1.5 md:w-20 md:py-2 rounded-2xl select-none">
            {isProfileActive && (
              <div className="absolute inset-0 rounded-2xl"
                style={{ background: "radial-gradient(ellipse at center, rgba(124,92,252,0.15) 0%, transparent 70%)" }} />
            )}
            <IoPerson className={`size-[18px] md:size-5 transition-colors duration-200 ${tapped === "profile" ? "icon-tap" : ""}`}
              style={{ color: isProfileActive ? "#b49fff" : "rgba(255,255,255,0.28)", filter: isProfileActive ? "drop-shadow(0 0 5px rgba(180,159,255,0.8))" : "none" }} />
            <span className="text-[9px] md:text-[11px] font-semibold"
              style={{ color: isProfileActive ? "#b49fff" : "rgba(255,255,255,0.22)", letterSpacing: "0.05em" }}>Profile</span>
            {isProfileActive && (
              <div className="absolute bottom-0.5 left-1/2 h-0.5 w-4 rounded-full dot-pop"
                style={{ background: "linear-gradient(90deg, #7c5cfc, #b49fff)", boxShadow: "0 0 6px #a78bff" }} />
            )}
          </Link>
        </div>
      </nav>
    </>
  );
}