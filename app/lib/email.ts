// app/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to handle development email addresses
function getEmailRecipient(email: string) {
  if (process.env.NODE_ENV === "development") {
    // Replace the recipient's email with your verified email or a @resend.dev address
    return "busquets.cris@gmail.com"; // Replace with your verified email
    // Or use: `${email.split('@')[0]}@resend.dev`
  }
  return email;
}

interface JobEmailData {
  to: string;
  jobTitle: string;
  companyName: string;
  managementUrl: string;
}

export async function sendJobConfirmationEmail({ to, jobTitle, companyName, managementUrl }: JobEmailData) {
  try {
    console.log("Sending email to:", to); // Debug log

    const recipient = getEmailRecipient(to);
    console.log("Actual recipient:", recipient); // Debug log

    const { data, error } = await resend.emails.send({
      from: "DisñoJobs <onboarding@resend.dev>", // Use this for testing
      to: recipient,
      subject: `Tu oferta en DisñoJobs: ${jobTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563EB; margin-bottom: 24px;">¡Tu oferta está publicada!</h1>
          
          <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <p><strong>Modo Desarrollo</strong></p>
            <p>Email original: ${to}</p>
            <p>Email usado: ${recipient}</p>
          </div>

          <p style="margin-bottom: 16px;">
            Tu oferta para <strong>${jobTitle}</strong> en ${companyName} ha sido publicada correctamente en DisñoJobs.
          </p>

          <p style="margin-bottom: 24px;">
            Guarda este enlace para gestionar tu oferta en el futuro:
          </p>

          <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
            <a href="${managementUrl}" style="color: #2563EB; text-decoration: none; word-break: break-all;">
              ${managementUrl}
            </a>
          </div>

          <p style="color: #4B5563; font-size: 14px;">
            Este enlace es privado, no lo compartas con nadie.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw error;
    }

    return { success: true, originalEmail: to, actualRecipient: recipient };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
