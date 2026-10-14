
import Link from "next/link";

const plans = [
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

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-20 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            BusinessFlow Garage CRM
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Simple pricing. Better customer relationships.
          </h1>

          <p className="mt-5 text-lg text-slate-400">
            Keep track of customers, manage follow-ups and bring more
            customers back to your garage.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            No complicated setup. Choose the plan that fits your garage.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {plans.map((plan) => (
            <section
              key={plan.plan}
              className={`relative rounded-2xl border p-7 sm:p-9 ${
                plan.featured
                  ? "border-blue-500 bg-slate-900 shadow-xl shadow-blue-950/30"
                  : "border-slate-800 bg-slate-900/60"
              }`}
            >
              {plan.featured && (
                <span className="inline-flex rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-300">
                  Best for growing garages
                </span>
              )}

              <h2 className="mt-4 text-2xl font-semibold">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                {plan.description}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-5xl font-bold">€{plan.price}</span>
                <span className="text-slate-400">/ month</span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Cancel anytime. Taxes may apply.
              </p>

              <Link
                href={`/signup?plan=${plan.plan}`}
                className={`mt-8 flex w-full items-center justify-center rounded-xl px-5 py-3 font-semibold transition ${
                  plan.featured
                    ? "bg-blue-600 text-white hover:bg-blue-500"
                    : "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                }`}
              >
                {plan.cta}
              </Link>

              <div className="my-8 border-t border-slate-800" />

              <p className="text-sm font-semibold text-slate-200">
                What's included
              </p>

              <ul className="mt-5 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <span className="text-emerald-400" aria-hidden="true">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-emerald-900/70 bg-emerald-950/20 p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-400">
                Limited early access
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Help shape BusinessFlow
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Join our first group of independent garages. Get access
                to Business features for €19/month in exchange for
                honest feedback and product testing.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Proposed offer for the first 10 garages. Confirm availability
                and terms before publishing.
              </p>
            </div>

            <Link
              href="/signup?plan=early-access"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Apply for early access
            </Link>
          </div>
        </section>

        <p className="mt-10 text-center text-sm text-slate-500">
          Questions? Contact our team to discuss the right plan for your garage.
        </p>
      </div>
    </main>
  );
}
