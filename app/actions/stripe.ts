// app/actions/stripe.ts
"use server";

import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

interface Benefit {
  name: string;
  isCustom?: boolean;
}

interface JobData {
  title: string;
  company: string;
  company_email: string;
  company_logo?: string;
  description: string;
  job_type: 'remote' | 'hybrid' | 'onsite';
  salary_min?: number;
  salary_max?: number;
  benefits: Benefit[];
  application_method_type: 'email' | 'url';
  application_method_value: string;
}

export async function createPaymentSession(data: JobData) {
  const supabase = getSupabase();

  // Create job listing first
  const { data: job, error } = await supabase
    .from("job_listings")
    .insert({
      title: data.title,
      company: data.company,
      company_email: data.company_email,
      company_logo: data.company_logo,
      description: data.description,
      job_type: data.job_type,
      salary_min: data.salary_min || null,
      salary_max: data.salary_max || null,
      application_method_type: data.application_method_type,
      application_method_value: data.application_method_value,
      is_active: false,
      management_token: crypto.randomUUID(),
    })
    .select()
    .single();

  if (error) throw error;

  // Insert benefits
  if (data.benefits?.length > 0) {
    const { error: benefitsError } = await supabase
      .from("job_benefits")
      .insert(
        data.benefits.map(benefit => ({
          job_id: job.id,
          benefit_name: benefit.name,
          is_custom: benefit.isCustom || false
        }))
      );

    if (benefitsError) throw benefitsError;
  }

  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Publicación de Empleo en DisñoJobs",
            description: `Oferta: ${data.title} - ${data.company}`,
          },
          unit_amount: Number(process.env.JOB_POSTING_PRICE) || 2900,
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
