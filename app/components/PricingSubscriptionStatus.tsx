"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CheckoutButton from "@/app/components/CheckoutButton";

type SubscriptionState = "loading" | "subscribed" | "not-subscribed" | "error";

type Plan = {
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  plan: "starter" | "business";
  featured: boolean;
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: 19,
    description: "Everything a small garage needs to stay organised.",
    features: [
      "1 user",
      "Customer and vehicle records",
      "Lead management pipeline",
      "Basic follow-up reminders",
      "Customer activity history",
    ],
    cta: "Start with Starter",
    plan: "starter",
    featured: false,
  },
  {
    name: "Business",
    price: 39,
    description: "More visibility and collaboration for a growing garage.",
    features: [
      "Team access",
      "Everything in Starter",
      "Shared tasks and reminders",
      "Advanced follow-up workflows",
      "Business performance reports",
    ],
    cta: "Choose Business",
    plan: "business",
    featured: true,
  },
];

export default function PricingSubscriptionStatus() {
  const [state, setState] = useState<SubscriptionState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function checkSubscription() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        const user = session?.user;

        if (!user) {
          if (!cancelled) setState("not-subscribed");
          return;
        }

        const { data, error } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .in("status", ["active", "trialing"])
          .limit(1);

        if (error) throw error;

        if (!cancelled) {
          setState(data && data.length > 0 ? "subscribed" : "not-subscribed");
        }
      } catch (error) {
        console.error("Pricing subscription check failed:", error);

        if (!cancelled) setState("error");
      }
    }

    void checkSubscription();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="mt-12 h-32 animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (state === "subscribed") {
    return (
      <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-emerald-900">
          You're already subscribed
        </h2>
        <p className="mt-2 text-emerald-800">
          Your subscription is active. You don't need to subscribe again.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-500"
        >
          Go to your dashboard
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <p
        role="alert"
        className="mt-12 rounded-xl bg-red-50 p-5 text-sm text-red-700"
      >
        We couldn't verify your subscription. Please refresh the page or try
        again shortly. Checkout is unavailable until verification succeeds.
      </p>
    );
  }

  return <PricingSubscriptionStatus />;
}
