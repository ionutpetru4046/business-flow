  import Link from "next/link";

  const features = [
    {
      title: "Client Management",
      desc: "Track contacts, notes, and interactions.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-blue-500">
          <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586 5.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Task Automation",
      desc: "Streamline workflow with reminders and to-dos.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-emerald-500">
          <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586 5.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Real-Time Dashboard",
      desc: "Get instant insight into your business performance.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-amber-500">
          <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586 5.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Team Collaboration",
      desc: "Work together with your colleagues in real-time.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-purple-500">
          <path fillRule="evenodd" d="M10 3a4 4 0 014 4v1a2 2 0 11-4 0V7a4 4 0 014-4zm-6 7a4 4 0 014 4v1a2 2 0 11-4 0v-1a4 4 0 014-4zm12 4a4 4 0 00-4-4h-1a2 2 0 100 4h1a4 4 0 004 4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: "Secure & Cloud-Based",
      desc: "Your business data is protected and accessible anywhere.",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-7 h-7 text-cyan-500">
          <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v4.586l-1.293 1.293a1 1 0 001.414 1.414L6 15.414V18a2 2 0 002 2h4a2 2 0 002-2v-2.586l1.293-1.293a1 1 0 00-1.414-1.414L16 12.586V8a6 6 0 00-6-6z" clipRule="evenodd" />
        </svg>
      ),
    }
  ];

  export default function Home() {
    return (
      <main className="relative flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-violet-200 py-0 px-2 sm:px-0">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-32 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="absolute top-40 right-0 w-72 h-72 bg-purple-100 rounded-full blur-2xl opacity-30" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-emerald-100 rounded-full blur-2xl opacity-40" />
        </div>
        <section className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col gap-10 items-center w-full max-w-3xl px-6 sm:px-12 py-12 my-8">
          {/* Logo and brand */}
          <div className="flex flex-col gap-2 items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-300 rounded-full p-4 mb-2 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="currentColor"/><text x="50%" y="60%" textAnchor="middle" fontSize="18" fill="#fff" fontWeight="800" fontFamily="sans-serif">BF</text></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-400 bg-clip-text text-transparent tracking-tight drop-shadow">
              BusinessFlow CRM
            </h1>
            <p className="text-base md:text-lg text-gray-500 text-center font-medium max-w-xl">
              The all-in-one platform to manage your business, clients, team, and daily workflow with modern simplicity.
            </p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-lg bg-blue-600 text-white font-semibold py-3 px-8 shadow-md hover:bg-blue-700 hover:scale-[1.03] transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-lg border border-blue-600 text-blue-600 font-semibold py-3 px-8 shadow-md bg-white hover:bg-blue-50 hover:scale-[1.03] transition"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto rounded-lg border border-gray-200 text-gray-700 font-semibold py-3 px-8 shadow-md bg-white hover:bg-gray-50 hover:scale-[1.03] transition"
            >
              Dashboard
            </Link>
          </div>

          {/* Features section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {features.map((f, idx) => (
              <div key={f.title} className="flex items-start gap-4 bg-blue-50/40 hover:bg-blue-100/70 rounded-xl p-4 transition group shadow-sm border border-blue-100">
                {f.icon}
                <div>
                  <h3 className="text-lg font-bold text-blue-700 group-hover:text-blue-900 transition">{f.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial or call-to-action section */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-blue-500 font-semibold text-center px-2">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.003 9.25C2.555 5.079 6.333 2 10.5 2c4.417 0 8.014 3.433 8.497 7.828.062.543-.37.972-.917.972h-3.342a.75.75 0 00-.75.75v4.25a.75.75 0 01-.75.75H11V18a1 1 0 01-2 0v-1.5H6.75a.75.75 0 01-.75-.75v-4.25a.75.75 0 00-.75-.75H2.92c-.546 0-.979-.43-.917-.972z" clipRule="evenodd" /></svg>
              <span>Rated 5/5 by over 500+ businesses</span>
            </div>
            <p className="italic text-gray-500 max-w-lg text-center">
              "BusinessFlow CRM transformed how we manage clients and projects. The real-time dashboard and automation keeps our whole team productive." <span className="font-semibold text-blue-600">– Inova Digital</span>
            </p>
          </div>

          {/* Tiny footer/CTA */}
          <p className="text-gray-400 text-xs mt-10 text-center">
            Ready to elevate your business? Create your account or log in to get started.
          </p>
        </section>
      </main>
    );
  }
