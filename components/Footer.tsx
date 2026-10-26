import Link from "next/link";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/pricing", label: "Pricing" },
];

const quickLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
  { href: "/support", label: "Support" },
];

const socials = [
  {
    href: "https://linkedin.com/",
    icon: <FaLinkedin className="text-2xl" aria-label="LinkedIn" />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/",
    icon: <FaTwitter className="text-2xl" aria-label="Twitter" />,
    label: "Twitter",
  },
  {
    href: "https://github.com/",
    icon: <FaGithub className="text-2xl" aria-label="GitHub" />,
    label: "GitHub",
  },
  {
    href: "mailto:support@businessflowcrm.com",
    icon: <MdEmail className="text-2xl" aria-label="Email" />,
    label: "Email",
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-gradient-to-br from-white via-blue-50/90 to-[#d2dcfd] text-slate-800 border-t border-indigo-100/80 shadow-[0_0_36px_-6px_rgba(71,77,255,0.08)] font-sans z-30 overflow-hidden transition-colors">
      {/* Glass morphism gradient accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tl from-white/70 via-sky-100/50 to-purple-100/40 blur-[76px] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 flex flex-col md:flex-row gap-10 md:gap-8 justify-between">
        {/* Logo & Brief */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-5 mb-8 md:mb-0">
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl bg-gradient-to-tr from-blue-700 via-indigo-500 to-violet-900 border-2 border-white/40 ring-4 ring-indigo-100/40 animate-gradientX">
              <span className="text-white font-extrabold text-3xl drop-shadow-sm">BF</span>
            </div>
            <span className="sm:inline text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-tr from-blue-700 via-indigo-500 to-purple-700 drop-shadow transition animate-gradientX">
              BusinessFlow CRM
            </span>
          </div>
          <p className="max-w-xs text-center md:text-left text-base text-slate-500/90 mt-2">
            Modern customer management reimagined. Lightning-fast, secure, and crafted for teams who want beautiful simplicity and power, all-in-one.
          </p>
          <div className="flex gap-3 mt-2">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/60 hover:bg-indigo-50 border border-indigo-100/80 shadow transition p-2 rounded-full flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                aria-label={social.label}
              >
                <span className="text-indigo-500 group-hover:text-blue-700">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation & Resources */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
          <nav className="">
            <h4 className="mb-3 text-indigo-700 font-semibold uppercase text-xs tracking-widest letter-spacing-widest">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-3 py-2 rounded-lg font-medium text-gray-700/90 hover:bg-indigo-100/70 hover:text-blue-700 transition focus-visible:ring-2 focus-visible:ring-indigo-300 text-base shadow-sm hover:shadow-md"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="">
            <h4 className="mb-3 text-indigo-700 font-semibold uppercase text-xs tracking-widest letter-spacing-widest">
              Resources
            </h4>
            <ul className="space-y-1.5">
              {quickLinks.map((q) => (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="block px-3 py-2 rounded-lg font-medium text-gray-700/90 hover:bg-indigo-100/70 hover:text-blue-700 transition focus-visible:ring-2 focus-visible:ring-indigo-300 text-base shadow-sm hover:shadow-md"
                  >
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative w-full bg-white/50 dark:bg-slate-900/30 border-t border-indigo-100/60 shadow backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-gray-500/80 text-xs md:text-sm text-center">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-blue-500">BusinessFlow CRM</span>
            . All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1 text-gray-400 text-xs md:text-sm text-center md:text-right">
            Crafted with
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-pink-400 animate-pulse"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 21s-7.448-6.134-9.749-9.041C-0.757 8.062 2.194 3 7.113 3c2.021 0 3.848 1.227 4.887 3.106C13.04 4.227 14.867 3 16.887 3c4.92 0 7.87 5.062 4.862 8.959C19.448 14.866 12 21 12 21z" />
            </svg>
            for modern businesses.
          </span>
        </div>
      </div>
    </footer>
  );
}