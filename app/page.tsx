import Link from "next/link";

  const features = [
    {
      title: "Client Management",
      desc: "Easily organize contacts, track notes, and view communication history.",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" className="w-9 h-9 text-sky-500">
          <circle cx="14" cy="14" r="14" fill="currentColor" opacity="0.12" />
          <path
            d="M19 10a5 5 0 11-10 0 5 5 0 0110 0zM5 21.5V21a6 6 0 016-6h6a6 6 0 016 6v.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 015 21.5z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      title: "Task Automation",
      desc: "Automate repeat work with intelligent workflows and reminders.",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" className="w-9 h-9 text-green-500">
          <rect x="3" y="3" width="22" height="22" rx="11" fill="currentColor" opacity="0.12" />
          <path
            d="M20 14a6 6 0 01-12 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M9 14l2.5 2.5L19 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "Real-Time Dashboard",
      desc: "Monitor key metrics and team activity live, anywhere, anytime.",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" className="w-9 h-9 text-yellow-400">
          <circle cx="14" cy="14" r="14" fill="currentColor" opacity="0.12" />
          <path
            d="M8 18V10m4 8V6m4 12v-4m4 4V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Team Collaboration",
      desc: "Bring your whole team together with real-time collaboration.",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" className="w-9 h-9 text-violet-500">
          <circle cx="14" cy="14" r="14" fill="currentColor" opacity="0.12" />
          <path
            d="M14 10a3 3 0 110 6 3 3 0 010-6zm7 7.5A5.977 5.977 0 0014 15a5.977 5.977 0 00-7 2.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: "Secure & Cloud-Based",
      desc: "Access your business securely from anywhere — your data, protected.",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" className="w-9 h-9 text-cyan-500">
          <circle cx="14" cy="14" r="14" fill="currentColor" opacity="0.12" />
          <path
            d="M8 13v5a3 3 0 003 3h6a3 3 0 003-3v-5m-9 0V9a3 3 0 016 0v4m-6 0h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  export default function Home() {
    return (
      <main className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-sky-100 via-white to-violet-100 overflow-x-hidden">
        {/* Abstract modern background shapes */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[360px] h-[360px] bg-[radial-gradient(circle_at_30%_50%,theme(colors.sky.200),transparent_70%)] blur-2xl rounded-full opacity-70 -z-10" />
          <div className="absolute -top-16 right-0 w-[220px] h-[260px] bg-[radial-gradient(circle_at_80%_10%,theme(colors.violet.300),transparent_70%)] blur-3xl rounded-full opacity-50 -z-10" />
          <div className="absolute bottom-0 right-1/3 w-96 h-56 bg-[radial-gradient(circle_at_60%_90%,theme(colors.green.200),transparent_70%)] blur-2xl rounded-full opacity-40 -z-10" />
        </div>

        {/* Card Section */}
        <section className="relative z-10 backdrop-blur-2xl flex flex-col gap-10 items-center w-full max-w-4xl px-4 sm:px-8 md:px-16 pt-14 sm:my-16 mx-auto transition-all duration-200">

          {/* Logo/Brand Header */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-400 bg-clip-text text-transparent tracking-tight drop-shadow leading-tight text-center">
              BusinessFlow CRM
            </h1>
            <p className="text-base md:text-lg text-gray-600 text-center font-medium max-w-2xl">
              The modern solution to manage your clients, team, and workflow — all in one place, on any device.
            </p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-xl bg-gradient-to-br from-blue-600 to-sky-400 text-white font-bold py-3 px-9 shadow-lg hover:from-sky-600 hover:to-indigo-400 hover:scale-105 active:scale-100 transition-all duration-150"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-xl border-2 border-blue-500 text-blue-700 font-semibold py-3 px-9 shadow-sm bg-white hover:bg-sky-50 hover:text-blue-900 hover:scale-105 active:scale-100 transition-all duration-150"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-xl border-2 border-gray-200 text-gray-700 font-semibold py-3 px-9 shadow-sm bg-white hover:bg-gray-100 hover:scale-105 active:scale-100 transition-all duration-150"
            >
              Dashboard
            </Link>
          </div>

          {/* Features section */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-7 mt-2">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className="flex flex-col items-center sm:items-start gap-3 bg-white/70 border border-gray-100 hover:border-sky-200 hover:shadow-xl rounded-2xl p-6 transition-all duration-150 group"
              >
                <span className="flex items-center justify-center bg-white rounded-xl shadow w-14 h-14 group-hover:shadow-lg transition-all">{f.icon}</span>
                <h3 className="text-xl font-bold text-sky-700 group-hover:text-sky-900 transition text-center sm:text-left">{f.title}</h3>
                <p className="text-gray-500 text-base md:text-sm font-medium text-center sm:text-left leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Modern testimonial */}
          <div className="flex flex-col items-center gap-3 w-full mt-2">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2">
              <span className="flex items-center gap-1 font-semibold text-sky-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-yellow-400"
                >
                  <path d="M12 18.26l-6.18 3.73a1 1 0 01-1.45-1.06l1.18-6.88L1.69 9.16a1 1 0 01.55-1.7l6.9-1 .03-.01.01-.03L12 2.1l3.09 6.32.01.03.03.01 6.9 1a1 1 0 01.55 1.7l-4.86 4.89 1.18 6.88a1 1 0 01-1.45 1.06L12 18.26z" />
                </svg>
                5/5 by 500+ businesses
              </span>
            </div>
            <blockquote className="italic text-gray-700 max-w-xl text-center leading-relaxed">
              "BusinessFlow CRM lets our team focus on what matters. Collaboration and automation have never been this smooth."
              <span className="block font-semibold text-blue-600 mt-2">– Inova Digital</span>
            </blockquote>
          </div>

          {/* Call-to-action footer */}
          <p className="text-gray-400 text-xs md:text-sm mt-10 text-center">
            Ready to elevate your business? <span className="text-sky-600 font-semibold">Sign up</span> or <span className="text-blue-600 font-semibold">log in</span> to get started from any device, anytime.
          </p>
        </section>
      </main>
    );
  }
