'use client';

import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

// Navbar: fully responsive, improved layout on all devices
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
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-indigo-100 shadow-[0_2px_20px_-5px_rgba(70,79,225,0.08)] transition-colors min-h-[64px]">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        {/* Main Flex Container */}
        <div className="flex flex-row items-center justify-between min-h-[64px] h-16 md:h-20 py-2 md:py-0 relative">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl md:rounded-xl flex items-center justify-center ring-2 ring-indigo-50 shadow-xl transition-all group-hover:scale-105 group-hover:ring-blue-200 duration-200">
              <span className="text-white font-extrabold text-xl sm:text-2xl tracking-wider">BF</span>
            </div>
            <span className="hidden sm:inline text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 font-black text-xl sm:text-2xl tracking-tight drop-shadow-sm select-none transition-all group-hover:scale-105">
              BusinessFlow CRM
            </span>
          </Link>
          {/* Desktop Navigation (>=lg) */}
          <ul className="hidden lg:flex items-center space-x-2 xl:space-x-6 ml-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block px-4 py-2 rounded-lg font-semibold text-gray-700/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md focus-visible:bg-blue-100 outline-none transition-all duration-150 group"
                >
                  <span className="group-hover:underline decoration-2 underline-offset-8 group-hover:text-blue-600 transition">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile Menu Icon */}
          <button
            className="lg:hidden flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            {/* Hamburger icon disappears when drawer is open, replaced with close icon (improve accessibility) */}
            {!mobileOpen
              ? <HiOutlineMenuAlt3 size={28} />
              : <IoClose size={28} />
            }
          </button>
        </div>
      </div>
      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-[90] lg:hidden transition-all duration-200 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: mobileOpen ? 'rgba(0 0 0 / 0.38)' : 'rgba(0 0 0 / 0)' }}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      >
        {/* Drawer Panel */}
        <nav
          className={`absolute right-0 top-0 h-full w-[84vw] sm:w-[340px] bg-white shadow-2xl p-5 pt-9 transition-transform duration-300 rounded-tl-3xl rounded-bl-3xl flex flex-col gap-2 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ minWidth: "260px", maxWidth: 384 }}
          onClick={e => e.stopPropagation()}
          aria-label="Mobile navigation drawer"
        >
          {/* Drawer close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 focus:outline-none rounded-full p-2"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <IoClose size={24} />
          </button>
          {/* Logo + Name mobile */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-7 mt-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-white font-extrabold text-lg tracking-wider">BF</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 font-black text-lg tracking-tight drop-shadow-sm select-none">
              BusinessFlow
            </span>
          </Link>
          <ul className="flex flex-col gap-1 mt-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="w-full block px-3.5 py-3 rounded-xl text-base font-semibold text-gray-700/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Extra: Add bottom spacing for safe area on iOS */}
          <div className="mt-auto h-3 sm:h-4"></div>
        </nav>
      </div>
    </nav>
  );
}
