// app/api/webhook/stripe/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getSupabase } from "@/lib/supabase";
import { sendJobConfirmationEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const jobId = session.metadata?.jobId;

      if (jobId) {
        const supabase = getSupabase();

        // Get job details
        const { data: job } = await supabase.from("job_listings").select("*").eq("id", jobId).single();

        if (job) {
          // Activate the job listing
          await supabase.from("job_listings").update({ is_active: true }).eq("id", jobId);

          // Send confirmation email
          const managementUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/jobs/manage/${job.management_token}`;

          await sendJobConfirmationEmail({
            to: job.company_email,
            jobTitle: job.title,
            companyName: job.company,
            managementUrl: managementUrl,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
