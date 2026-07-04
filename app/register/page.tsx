"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setFormError(error.message);
        setLoading(false);
        return;
      }

      // Optionally, check if confirmation email sent (Supabase often requires confirmation)
      setSuccessMessage(
        "Account created! Please check your inbox to confirm your registration."
      );
      setEmail("");
      setPassword("");
      // Optionally, redirect after timeout
      // setTimeout(() => router.replace("/login"), 3000);
    } catch (error: any) {
      setFormError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-white to-indigo-50">
      <div className="bg-white shadow-lg rounded-xl px-10 py-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 tracking-tight">
          Create your account
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          autoComplete="off"
        >
          <div>
            <label
              className="block mb-1 text-sm text-gray-700 font-medium"
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
                type={showPassword ? "text" : "password"}
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={6}
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
            <p className="text-xs text-gray-400 mt-1 ml-1">
              Password must be at least 6 characters.
            </p>
          </div>
          {formError && (
            <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 text-sm text-center">
              {formError}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 text-green-700 rounded-lg px-4 py-2 text-sm text-center">
              {successMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-semibold py-3 rounded-lg transition disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
