
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type CheckoutButtonProps = {
  plan: "starter" | "business";
  label: string;
  featured?: boolean;
};

export default function CheckoutButton({
  plan,
  label,
  featured = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        window.location.href = `/login?next=${encodeURIComponent(
          `/pricing`,
        )}`;
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Unable to start checkout.");
      }

      window.location.href = result.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={`flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          featured
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "border border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
        }`}
      >
        {loading ? "Redirecting..." : label}
      </button>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
