
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const prices = {
    starter: process.env.STRIPE_PRICE_STARTER!,
    business: process.env.STRIPE_PRICE_BUSINESS!,
};

export async function POST(request: Request) {
    try {
        const authorization = request.headers.get("Authorization");
        const token = authorization?.startsWith("Bearer ")
            ? authorization.slice(7)
            : null;

        if (!token) {
            return NextResponse.json(
                { error: "Authentication required." },
                { status: 401 },
            );
        }

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Invalid or expired session." },
                { status: 401 },
            );
        }


        const body: { plan?: unknown } = await request.json();
        const plan = body?.plan;

        if (plan !== "starter" && plan !== "business") {
            return NextResponse.json(
                { error: "Invalid subscription plan." },
                { status: 400 },
            );
        }

        const priceId = prices[plan];


        if (!priceId || !process.env.NEXT_PUBLIC_APP_URL) {
            return NextResponse.json(
                { error: "Stripe configuration is incomplete." },
                { status: 500 },
            );
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer_email: user.email,
            client_reference_id: user.id,
            metadata: {
                user_id: user.id,
                plan,
            },
            subscription_data: {
                metadata: {
                    user_id: user.id,
                    plan,
                },
            },
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe checkout error:", error);

        return NextResponse.json(
            { error: "Unable to start checkout." },
            { status: 500 },
        );
    }
}
