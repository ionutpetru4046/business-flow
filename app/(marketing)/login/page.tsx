"use client";

import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { HiOutlineLockClosed } from "react-icons/hi2";

async function hasActiveSubscription(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Unable to verify subscription:", error);
    return false;
  }

  return data?.status === "active" || data?.status === "trialing";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (cancelled || error || !user) return;

      const hasSubscription = await hasActiveSubscription(user.id);

      if (!cancelled) {
        router.replace(hasSubscription ? "/dashboard" : "/pricing");
      }
    };

    void checkUser();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      if (!data.user) {
        setFormError("Unable to verify your account. Please try again.");
        return;
      }

      const hasSubscription = await hasActiveSubscription(data.user.id);

      router.replace(hasSubscription ? "/dashboard" : "/pricing");
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-indigo-50">
      <div className="bg-white shadow-lg rounded-xl px-10 py-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 tracking-tight">
          Sign In to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block mb-1 text-sm text-gray-700 font-medium"
              htmlFor="email"
            >
              Email
            </label>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-black rounded-lg border border-gray-300 py-3 pl-11 pr-3 transition focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              className="block mb-1 text-sm text-gray-700 font-medium"
              htmlFor="password"
            >
              Password
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <HiOutlineLockClosed size={20} />
              </span>

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full text-black rounded-lg border border-gray-300 py-3 pl-11 pr-3 transition focus:border-indigo-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {formError && (
            <div
              role="alert"
              className="bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm text-center"
            >
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
          © {new Date().getFullYear()} BusinessFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
