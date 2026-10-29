"use client";

import { Suspense, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { supabase } from "@/lib/supabase";

const validPlans = ["starter", "business", "early-access"] as const;
type Plan = (typeof validPlans)[number];

function RegisterForm() {
  const searchParams = useSearchParams();

  const requestedPlan = searchParams.get("plan");
  const selectedPlan: Plan =
    validPlans.find((plan) => plan === requestedPlan) ?? "starter";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { plan: selectedPlan },
        },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      setSuccessMessage(
        "Account created! Please check your inbox to confirm your registration.",
      );
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-indigo-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white px-10 py-10 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-indigo-700">
          Create your account
        </h1>

        <p className="mb-6 text-center text-sm text-gray-500">
          Selected plan:{" "}
          <span className="font-semibold capitalize text-indigo-600">
            {selectedPlan.replace("-", " ")}
          </span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <HiOutlineMail size={20} />
              </span>
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
              className="mb-1 block text-sm font-medium text-gray-700"
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
                autoComplete="new-password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            <p className="ml-1 mt-1 text-xs text-gray-400">
              Password must be at least 6 characters.
            </p>
          </div>

          {formError && (
            <div
              className="rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600"
              role="alert"
            >
              {formError}
            </div>
          )}

          {successMessage && (
            <div
              className="rounded-lg bg-green-50 px-4 py-2 text-center text-sm text-green-700"
              role="status"
            >
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading registration...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
