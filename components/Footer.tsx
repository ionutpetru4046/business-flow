export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-tr from-indigo-50 to-white border-t border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-blue-600 to-indigo-500 select-none">
            BusinessFlow CRM
          </span>
          <span className="hidden md:inline-block mx-3 text-indigo-200">|</span>
          <span className="text-gray-500 text-xs md:text-sm">
            All rights reserved
          </span>
        </div>
        <span className="text-gray-400 text-xs md:text-sm">
          © {new Date().getFullYear()} BusinessFlow CRM
        </span>
      </div>
    </footer>
  );
}