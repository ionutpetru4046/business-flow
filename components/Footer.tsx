import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-indigo-100 bg-gradient-to-br from-white via-indigo-50 to-blue-50/40 backdrop-blur-md shadow-inner transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-6 md:gap-0 md:flex-row items-center justify-between">
        <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 select-none drop-shadow-sm">
            BusinessFlow CRM
          </span>
          <span className="hidden md:inline-block text-indigo-200">|</span>
          <span className="text-gray-500 text-xs md:text-sm font-medium">
            All rights reserved
          </span>
        </div>
        <nav className="w-full md:w-auto">
          <ul className="flex flex-wrap justify-center md:justify-end items-center gap-x-4 gap-y-1 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block px-3 py-2 rounded-md font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow transition-all focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className="text-gray-400 text-xs md:text-sm tracking-wide text-center md:text-right">
          © {new Date().getFullYear()} <span className="font-semibold text-blue-500">BusinessFlow CRM</span>
        </span>
      </div>
    </footer>
  );
}