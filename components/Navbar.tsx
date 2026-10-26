"use client";

import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-gradient-to-b from-white/90 to-blue-50/70 backdrop-blur-lg border-b border-blue-100 shadow-lg transition-colors min-h-[68px] font-sans"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between min-h-[68px] h-16 md:h-20 relative">
          {/* Brand section */}
          <Link href="/" className="flex items-center gap-2 group select-none">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-700 via-sky-600 to-purple-600 shadow-lg ring-2 ring-blue-100 transition-transform group-hover:scale-105">
              <span className="text-white text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow">
                BF
              </span>
            </span>
            <span className="hidden sm:inline text-xl md:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-tr from-blue-700 via-indigo-500 to-purple-600 drop-shadow group-hover:brightness-125 transition">
              BusinessFlow CRM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-1 xl:space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block px-4 py-[10px] rounded-xl font-semibold text-gray-700/90 hover:text-blue-700 hover:bg-blue-50/70 focus-visible:bg-blue-100 focus-visible:text-blue-700 focus-visible:outline ring-2 ring-transparent focus-visible:ring-blue-300 transition-all duration-150 group"
                >
                  <span className="group-hover:underline decoration-2 underline-offset-8 transition-colors text-base md:text-lg group-hover:text-blue-700">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex items-center justify-center text-blue-700 p-2 rounded-full transition hover:bg-blue-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            type="button"
          >
            {!mobileOpen ? (
              <HiOutlineMenuAlt3 size={28} />
            ) : (
              <IoClose size={28} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay & Drawer */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-[opacity,backdrop-filter] duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          background: mobileOpen
            ? "linear-gradient(120deg,rgba(34,52,120,0.16) 55%,rgba(85,117,255,0.13) 90%)"
            : "rgba(0,0,0,0)",
          backdropFilter: mobileOpen ? "blur(6px)" : "none",
        }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      >
        <nav
          className={`absolute right-0 top-0 h-full w-[86vw] xs:w-[340px] max-w-sm bg-white/95 shadow-xl p-7 pt-12 transition-transform duration-400 rounded-tl-[2.5rem] rounded-bl-[2.5rem] flex flex-col gap-4
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          `}
          style={{
            minWidth: 256,
            boxShadow:
              "0 12px 36px 0px rgba(72,90,255,0.13), 0 1.5px 0 0 #dbeafe",
            backdropFilter: "blur(16px)",
          }}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile navigation drawer"
        >
          {/* Mobile Drawer Close Button */}
          <button
            className="absolute top-3.5 right-4 text-gray-400 hover:text-blue-600 focus:outline-none rounded-full p-2 bg-white/70 hover:bg-blue-50/60 shadow transition"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            tabIndex={mobileOpen ? 0 : -1}
          >
            <IoClose size={26} />
          </button>

          {/* Mobile Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-7 mt-1 select-none"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-sky-600 to-violet-700 flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-lg tracking-wide">
                BF
              </span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-700 via-indigo-500 to-purple-700 font-extrabold text-xl tracking-tight drop-shadow select-none">
              BusinessFlow
            </span>
          </Link>

          <ul className="flex flex-col gap-1 mt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="w-full block px-4 py-3 rounded-lg text-base font-semibold text-gray-800/95 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:text-blue-700 focus:bg-blue-100/60 focus:text-blue-700 outline-none transition-all duration-150"
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto h-8"></div>
        </nav>
      </div>
    </nav>
  );
}
