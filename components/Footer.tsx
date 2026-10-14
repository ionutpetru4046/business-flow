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
    icon: <FaLinkedin className="text-xl" aria-label="LinkedIn" />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/",
    icon: <FaTwitter className="text-xl" aria-label="Twitter" />,
    label: "Twitter",
  },
  {
    href: "https://github.com/",
    icon: <FaGithub className="text-xl" aria-label="GitHub" />,
    label: "GitHub",
  },
  {
    href: "mailto:support@businessflowcrm.com",
    icon: <MdEmail className="text-xl" aria-label="Email" />,
    label: "Email",
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-100 bg-gradient-to-br from-white via-indigo-50 to-blue-100/40 backdrop-blur-xl shadow-[0_-4px_32px_-6px_rgba(71,77,255,0.13)] transition-colors font-sans z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
        {/* Logo & Brief */}
        <div className="flex-1 flex flex-col items-center md:items-start gap-3 mb-6 md:mb-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 rounded-2xl shadow-lg ring-2 ring-indigo-50 flex items-center justify-center backdrop-blur-xs border-[0.5px] border-white/50">
              <span className="text-white font-extrabold text-2xl">BF</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 font-extrabold text-2xl md:text-3xl tracking-tight drop-shadow-md select-none">
              BusinessFlow CRM
            </span>
          </div>
          <p className="max-w-xs text-center md:text-left text-sm text-gray-500/90 mt-2">
            Modern software to empower your customer management and sales workflow. Secure, fast, and beautifully simple for growing businesses.
          </p>
          <div className="flex gap-3 mt-3">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group hover:bg-blue-600/10 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200"
                aria-label={social.label}
              >
                <span className="text-indigo-500 group-hover:text-blue-700 transition">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex-1 flex flex-col md:flex-row justify-evenly items-center gap-8">
          <nav className="w-full max-w-xs mb-4 md:mb-0">
            <h4 className="mb-2 text-indigo-600 font-bold uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-block w-full px-2 py-1.5 rounded-md font-medium text-gray-700 hover:bg-indigo-50/80 hover:text-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-100 text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="w-full max-w-xs">
            <h4 className="mb-2 text-indigo-600 font-bold uppercase text-sm tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {quickLinks.map((q) => (
                <li key={q.href}>
                  <Link
                    href={q.href}
                    className="inline-block w-full px-2 py-1.5 rounded-md font-medium text-gray-700 hover:bg-indigo-50/80 hover:text-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-100 text-base"
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
      <div className="w-full bg-gradient-to-t from-white via-indigo-50/60 to-transparent border-t border-indigo-100/80">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-gray-500/80 text-xs md:text-sm text-center">
            © {new Date().getFullYear()} <span className="font-semibold text-blue-500">BusinessFlow CRM</span>. All rights reserved.
          </span>
          <span className="text-gray-400 text-xs text-center md:text-right">
            Crafted with <span className="text-pink-400">♥</span> for modern businesses.
          </span>
        </div>
      </div>
    </footer>
  );
}