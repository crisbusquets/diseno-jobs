// app/actions/stripe.ts
"use server";

import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function createPaymentSession(jobId: number) {
  const supabase = getSupabase();

  const { data: job } = await supabase
    .from("job_listings")
    .select("*")
    .eq("id", jobId)
    .single();

  if (!job) {
    throw new Error("Job not found");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Publicación de Empleo en DisñoJobs",
            description: `Oferta: ${job.title} - ${job.company}`,
          },
          unit_amount: Number(process.env.JOB_POSTING_PRICE) || 2900, // Price in cents, default to 29€
        },
        quantity: 1,
      },
    ],
    metadata: {
      jobId: job.id,
      managementToken: job.management_token,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/create`,
  });

  return { sessionId: session.id, url: session.url };
}
