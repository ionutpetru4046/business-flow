"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { HiOutlineLockClosed } from "react-icons/hi2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setFormError(error.message);
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
    } catch (error: any) {
      setFormError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-indigo-50">
      <div className="bg-white shadow-lg rounded-xl px-10 py-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 tracking-tight">Sign In to Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 text-sm text-gray-700 font-medium" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 py-3 pl-11 pr-3 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-700 font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <HiOutlineLockClosed size={20} />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 py-3 pl-11 pr-10 rounded-lg focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {formError && (
            <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm text-center">
              {formError}
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-50 cursor-pointer transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-8 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Modern Login. All rights reserved.
        </p>
      </div>
    </div>
  );
}
