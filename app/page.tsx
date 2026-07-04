  import Link from "next/link";

  export default function Home() {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-0">
        <section className="bg-white rounded-3xl shadow-2xl flex flex-col items-center p-12 max-w-2xl w-full">
          <div className="mb-6">
            <h1 className="text-5xl font-extrabold text-blue-600 tracking-tighter mb-3">BusinessFlow CRM</h1>
            <p className="text-lg text-gray-600 font-medium">
              The all-in-one platform to manage your business, clients, and workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-6">
            <Link
              href="/register"
              className="rounded-lg bg-blue-600 text-white font-semibold py-3 px-6 shadow hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-blue-600 text-blue-600 font-semibold py-3 px-6 shadow hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-gray-300 text-gray-700 font-semibold py-3 px-6 shadow hover:bg-gray-100 transition"
            >
              Dashboard
            </Link>
          </div>

          <ul className="mt-10 text-left w-full space-y-3">
            <li className="flex items-start gap-2">
              <span className="inline-block w-6 text-blue-500">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586 5.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong>Client Management:</strong> Track contacts, notes, and interactions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-6 text-blue-500">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586 5.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong>Task Automation:</strong> Streamline your workflow with reminders and to-dos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-block w-6 text-blue-500">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586 5.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </span>
              <span>
                <strong>Real-Time Dashboard:</strong> Get instant insight into your business performance.
              </span>
            </li>
          </ul>

          <p className="text-gray-400 text-xs mt-10">
            Ready to elevate your business? Create your account or log in to get started.
          </p>
        </section>
      </main>
    );
  }
