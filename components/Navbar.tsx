'use client';

import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-[3px] border-b border-indigo-100 shadow-[0_2px_20px_-5px_rgba(70,79,225,0.08)] transition-colors min-h-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20 relative">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-11 h-11 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-2xl md:rounded-xl flex items-center justify-center ring-2 ring-indigo-50 shadow-xl transition-all group-hover:scale-105 group-hover:ring-blue-200 duration-200">
                <span className="text-white font-extrabold text-2xl md:text-xl tracking-wider">BF</span>
              </div>
              <span className="hidden sm:inline text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 font-black text-2xl md:text-2xl tracking-tight drop-shadow-sm select-none transition-all group-hover:scale-105">
                BusinessFlow CRM
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-2 lg:space-x-5 ml-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block relative px-5 py-2 rounded-lg font-semibold text-gray-700/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md focus-visible:bg-blue-100 outline-none transition-all duration-150 group"
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
            className="md:hidden flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            <HiOutlineMenuAlt3 size={30} />
          </button>
        </div>
      </div>
      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 bg-black/40 z-[90] transition-opacity duration-200 md:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      >
        {/* Drawer */}
        <nav
          className={`absolute right-0 top-0 h-full w-[82vw] max-w-xs bg-white shadow-2xl p-6 pt-10 transition-transform duration-300 rounded-tl-3xl rounded-bl-3xl flex flex-col gap-1.5 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ minWidth: "260px" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drawer close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 focus:outline-none rounded-full p-1.5"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <IoClose size={28} />
          </button>
          {/* Logo on mobile */}
          <Link
            href="/"
            className="flex items-center gap-2 mb-7"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-inner">
              <span className="text-white font-extrabold text-xl tracking-wider">BF</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 font-extrabold text-xl tracking-tight drop-shadow-sm select-none">
              BusinessFlow
            </span>
          </Link>
          <ul className="flex flex-col gap-1.5 mt-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="w-full block px-4 py-3 rounded-xl text-base font-semibold text-gray-700/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 transition-all duration-150"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </nav>
  );
}
