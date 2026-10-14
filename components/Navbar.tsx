'use client';

import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

// Ultra-modern, fully responsive Navbar
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent scroll when mobile drawer is open (mobile only)
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-blue-100 shadow-[0_2px_20px_-5px_rgba(70,79,225,0.13)] transition-colors min-h-[64px] font-sans"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 md:px-8">
        <div className="flex flex-row items-center justify-between min-h-[64px] h-16 md:h-20 py-1 md:py-0 relative">
          {/* Logo with glassmorphism and vibrant gradient */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 rounded-2xl shadow-[0_4px_30px_rgba(71,77,255,0.18)] ring-2 ring-indigo-50 flex items-center justify-center backdrop-blur-xs border-[0.5px] border-white/50 transition-all group-hover:scale-105 group-hover:ring-blue-200 duration-200">
              <span className="text-white font-extrabold text-2xl sm:text-3xl tracking-wider">BF</span>
            </div>
            <span className="hidden md:inline text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight drop-shadow-md select-none transition-all group-hover:scale-105">
              BusinessFlow CRM
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-2 xl:space-x-7 ml-1.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block px-5 py-2 rounded-lg font-semibold text-gray-700/90 hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-violet-100/50 hover:text-indigo-700 hover:shadow-md focus-visible:bg-blue-50/80 focus-visible:text-indigo-700 outline-none transition-all duration-150 group"
                >
                  <span className="group-hover:underline decoration-2 underline-offset-8 group-hover:text-blue-700 transition text-base md:text-lg">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden inline-flex items-center justify-center text-indigo-600 hover:bg-blue-50/80 hover:text-indigo-700 p-2 rounded-2xl shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            {!mobileOpen
              ? <HiOutlineMenuAlt3 size={30} />
              : <IoClose size={30} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay and Drawer */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          background: mobileOpen
            ? "linear-gradient(135deg, rgba(40,60,150,0.11) 55%, rgba(0,10,80,0.17) 100%)"
            : "rgba(0,0,0,0)",
          backdropFilter: mobileOpen ? "blur(4px)" : "none"
        }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      >
        <nav
          className={`absolute right-0 top-0 h-full w-[88vw] xs:w-[340px] max-w-xs bg-white/90 shadow-[0_10px_32px_rgba(72,72,255,0.16)] p-6 pt-10 transition-transform duration-400 rounded-tl-[2.2rem] rounded-bl-[2.2rem] flex flex-col gap-3
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          `}
          style={{
            minWidth: 260,
            boxShadow: "0 8px 32px rgba(72,72,255,0.13), 0 1.5px 0 0 #e0e7ff",
            backdropFilter: "blur(12px)"
          }}
          onClick={e => e.stopPropagation()}
          aria-label="Mobile navigation drawer"
        >
          {/* Mobile Drawer Close Button */}
          <button
            className="absolute top-4 right-5 text-gray-400 hover:text-blue-600 focus:outline-none rounded-full p-2 bg-white/60 hover:bg-blue-50/70 shadow transition"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            tabIndex={mobileOpen ? 0 : -1}
          >
            <IoClose size={26} />
          </button>

          {/* Mobile Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-8 mt-1"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-white font-extrabold text-lg tracking-wider">BF</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 font-black text-xl tracking-tight drop-shadow-sm select-none">
              BusinessFlow
            </span>
          </Link>

          <ul className="flex flex-col gap-1.5 mt-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="w-full block px-4 py-3 rounded-lg text-base font-semibold text-gray-800/95 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:text-indigo-700 focus:bg-blue-100/60 focus:text-indigo-700 transition-all duration-150"
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto h-7 sm:h-8"></div>
        </nav>
      </div>
    </nav>
  );
}
