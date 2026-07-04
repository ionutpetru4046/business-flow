'use client';

import Link from "next/link";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/login", label: "Login" },
    { href: "/register", label: "Register" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur border-b shadow-sm sticky top-0 z-30 transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center shadow-inner">
                <span className="text-white font-extrabold text-xl tracking-wider">BF</span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 font-extrabold text-2xl tracking-tight drop-shadow-sm select-none">
                BusinessFlow CRM
              </span>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative px-4 py-2 rounded-full font-medium text-gray-700/90 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow transition-all duration-150 group"
                >
                  <span className="group-hover:decoration-blue-500">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Mobile Menu */}
          <button
            className="md:hidden flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-2 rounded-xl transition"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            type="button"
          >
            <HiOutlineMenuAlt3 size={28} />
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed top-0 left-0 w-full h-full bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute right-0 top-0 mt-5 mr-5 p-7 w-60 bg-white rounded-2xl shadow-2xl flex flex-col gap-2"
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-base font-semibold hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
