
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getCurrentPeriodEnd(subscription: Stripe.Subscription): string {
  const item = subscription.items.data[0];

  if (!item?.current_period_end) {
    throw new Error(
      `Subscription ${subscription.id} has no current period end`
    );
  }

  return new Date(item.current_period_end * 1000).toISOString();
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("[Stripe webhook] Missing signature or webhook secret.");

    return NextResponse.json(
      { error: "Missing Stripe webhook signature or configuration" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("[Stripe webhook] Signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  console.info("[Stripe webhook] Event received:", event.type);

  try {
    // 1. Save the subscription after checkout completes.
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.info("[Stripe webhook] Checkout details:", {
        mode: session.mode,
        hasUserId: Boolean(session.metadata?.user_id),
        plan: session.metadata?.plan ?? null,
        hasCustomer: Boolean(session.customer),
        hasSubscription: Boolean(session.subscription),
      });

      if (session.mode !== "subscription") {
        return NextResponse.json({ received: true });
      }

      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan;

      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id;

      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id;

      if (
        !userId ||
        (plan !== "starter" && plan !== "business") ||
        !customerId ||
        !subscriptionId
      ) {
        console.error(
          "[Stripe webhook] Checkout session is missing required details.",
          {
            sessionId: session.id,
            hasUserId: Boolean(userId),
            plan: plan ?? null,
            hasCustomer: Boolean(customerId),
            hasSubscription: Boolean(subscriptionId),
          }
        );

        return NextResponse.json(
          { error: "Checkout session is missing subscription details" },
          { status: 400 }
        );
      }

      // Retrieve the authoritative subscription status from Stripe.
      const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);

      const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert(
          {
            user_id: userId,
            plan,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: subscription.status,
            current_period_end: getCurrentPeriodEnd(subscription),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("[Stripe webhook] Supabase upsert failed:", error);
        throw error;
      }

      console.info(
        "[Stripe webhook] Subscription saved successfully.",
        {
          plan,
          status: subscription.status,
        }
      );
    }

    // 2. Synchronise subscription status changes and cancellations.
    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;

      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .update({
          status: subscription.status,
          current_period_end: getCurrentPeriodEnd(subscription),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId)
        .select("user_id");

      if (error) {
        console.error(
          "[Stripe webhook] Subscription update failed:",
          error
        );
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn(
          "[Stripe webhook] No database row matched this customer.",
          { eventType: event.type }
        );
      } else {
        console.info(
          "[Stripe webhook] Subscription status updated.",
          {
            status: subscription.status,
            matchedRows: data.length,
          }
        );
      }
    }

    // 3. Record failed subscription payments.
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;

      const subscriptionValue =
        invoice.parent?.subscription_details?.subscription;

      const subscriptionId =
        typeof subscriptionValue === "string"
          ? subscriptionValue
          : subscriptionValue?.id;

      if (subscriptionId) {
        const { data, error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscriptionId)
          .select("user_id");

        if (error) {
          console.error(
            "[Stripe webhook] Failed-payment update failed:",
            error
          );
          throw error;
        }

        if (!data || data.length === 0) {
          console.warn(
            "[Stripe webhook] Failed payment received, but no matching subscription row was found."
          );
        } else {
          console.info(
            "[Stripe webhook] Subscription marked past_due."
          );
        }
      } else {
        console.warn(
          "[Stripe webhook] Failed-payment event contained no subscription ID."
        );
      }
    }

    // invoice.paid is acknowledged; subscription status is synchronised
    // using checkout.session.completed and subscription events.
    if (event.type === "invoice.paid") {
      console.info("[Stripe webhook] Invoice paid event acknowledged.");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe webhook] Processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
