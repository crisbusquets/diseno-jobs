// app/lib/email.ts

"use server";

import { Resend } from "resend";
import { Job, Benefit } from "@/types";
import { formatSalaryRange, getJobTypeLabel } from "@/lib/utils/formatting";

const resend = new Resend(process.env.RESEND_API_KEY!);

interface JobEmailData {
  to: string;
  jobTitle: string;
  companyName: string;
  companyEmail: string;
  companyLogo?: string;
  managementUrl: string;
  jobType: Job["job_type"];
  experience_level: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  benefits?: Benefit[];
  applicationMethod: {
    type: "email" | "url";
    value: string;
  };
}

function getSenderEmail(): string {
  return process.env.NODE_ENV === "development" ? "onboarding@resend.dev" : "jobs@disnojobs.com";
}

function getRecipientEmail(email: string): string {
  return process.env.NODE_ENV === "development" ? process.env.TEST_EMAIL || email : email;
}

export async function sendJobConfirmationEmail(jobData: JobEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured" };
  }

  const senderEmail = getSenderEmail();
  const recipientEmail = getRecipientEmail(jobData.to);

  try {
    console.log("Attempting to send email with data:", JSON.stringify(jobData, null, 2));

    const { data, error } = await resend.emails.send({
      from: `DisñoJobs <${senderEmail}>`,
      to: [recipientEmail],
      subject: `Tu oferta en DisñoJobs: ${jobData.jobTitle}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu oferta en DisñoJobs</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563EB; margin-bottom: 24px; font-size: 24px;">
        ¡Tu oferta está publicada!
      </h1>
    </div>

    <!-- Job Details Card -->
    <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
      <!-- Company Info Section -->
      <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
        ${
          jobData.companyLogo
            ? `
          <div style="text-align: center; margin-bottom: 16px;">
            <img src="${jobData.companyLogo}" alt="${jobData.companyName} logo" style="max-width: 200px; max-height: 100px; object-fit: contain;">
          </div>
        `
            : ""
        }
        <h3 style="color: #4B5563; font-size: 14px; margin-bottom: 8px;">Empresa</h3>
        <p style="font-size: 16px; margin: 0; color: #111827;">${jobData.companyName}</p>
        <p style="font-size: 14px; margin: 4px 0 0 0; color: #6B7280;">${jobData.companyEmail}</p>
      </div>

      <!-- Job Details Section -->
      <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
        <h3 style="color: #4B5563; font-size: 14px; margin-bottom: 8px;">Detalles del puesto</h3>
        <h2 style="color: #111827; font-size: 18px; margin: 0 0 16px 0;">${jobData.jobTitle}</h2>
        
        <div style="margin-bottom: 16px;">
        <p style="margin: 0 0 8px 0;"><strong>Experiencia:</strong> ${jobData.experience_level}</p>
          <p style="margin: 0 0 8px 0;"><strong>Modalidad:</strong> ${getJobTypeLabel(jobData.jobType)}</p>
          ${jobData.location ? `<p style="margin: 0 0 8px 0;"><strong>Ubicación:</strong> ${jobData.location}</p>` : ""}
          ${
            jobData.salaryMin || jobData.salaryMax
              ? `<p style="margin: 0 0 8px 0;"><strong>Salario:</strong> ${formatSalaryRange(
                  jobData.salaryMin,
                  jobData.salaryMax
                )}</p>`
              : ""
          }
        </div>

        <div style="margin-top: 16px;">
          <h4 style="color: #4B5563; font-size: 14px; margin: 0 0 8px 0;">Método de aplicación:</h4>
          <p style="margin: 0; color: #6B7280;">
            ${
              jobData.applicationMethod.type === "email"
                ? `Los candidatos enviarán su aplicación a: <strong>${jobData.applicationMethod.value}</strong>`
                : `Los candidatos aplicarán a través de: <strong>${jobData.applicationMethod.value}</strong>`
            }
          </p>
        </div>
      </div>

      <!-- Benefits Section -->
      ${
        jobData.benefits && jobData.benefits.length > 0
          ? `
        <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
          <h3 style="color: #4B5563; font-size: 14px; margin-bottom: 12px;">Beneficios</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            ${jobData.benefits
              .map(
                (benefit) => `
              <div style="background-color: #F9FAFB; padding: 8px 12px; border-radius: 6px;">
                <span style="margin-right: 8px;">${benefit.icon || "✨"}</span>
                <span style="color: #4B5563;">${benefit.name}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <!-- Description Section -->
      <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
        <h3 style="color: #4B5563; font-size: 14px; margin-bottom: 12px;">Descripción</h3>
        <div style="white-space: pre-line; color: #4B5563;">
          ${jobData.description}
        </div>
      </div>

      <!-- Management URL Section -->
      <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px;">
        <h3 style="color: #4B5563; font-size: 14px; margin-bottom: 8px;">Gestiona tu oferta</h3>
        <p style="margin: 0 0 8px 0;">Usa este enlace para editar o desactivar tu oferta:</p>
        <a href="${jobData.managementUrl}" 
           style="color: #2563EB; text-decoration: none; word-break: break-all;">
          ${jobData.managementUrl}
        </a>
        <p style="color: #6B7280; font-size: 14px; margin-top: 12px;">
          ⚠️ Este enlace es privado, no lo compartas con nadie.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px; color: #6B7280; font-size: 12px;">
      <p>© ${new Date().getFullYear()} DisñoJobs. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}
