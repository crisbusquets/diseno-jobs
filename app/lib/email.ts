// app/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface JobEmailData {
  to: string;
  jobTitle: string;
  companyName: string;
  managementUrl: string;
  jobType: 'remote' | 'hybrid' | 'onsite';
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  benefits?: { name: string; icon?: string }[];
}

function getSenderEmail() {
  if (process.env.NODE_ENV === 'development') {
    return 'onboarding@resend.dev';
  }
  return 'jobs@disnojobs.com';
}

function getRecipientEmail(email: string) {
  if (process.env.NODE_ENV === 'development') {
    return process.env.TEST_EMAIL || email;
  }
  return email;
}

function getJobTypeLabel(type: 'remote' | 'hybrid' | 'onsite'): string {
  const types = {
    remote: 'Remoto',
    hybrid: 'Híbrido',
    onsite: 'Presencial'
  };
  return types[type] || 'No especificado';
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatSalary(jobData: JobEmailData): string {
  if (jobData.salaryMin && jobData.salaryMax) {
    return `${formatCurrency(jobData.salaryMin)} - ${formatCurrency(jobData.salaryMax)}`;
  }
  if (jobData.salaryMin) {
    return `Desde ${formatCurrency(jobData.salaryMin)}`;
  }
  if (jobData.salaryMax) {
    return `Hasta ${formatCurrency(jobData.salaryMax)}`;
  }
  return 'No especificado';
}

export async function sendJobConfirmationEmail(jobData: JobEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured" };
  }

  const senderEmail = getSenderEmail();
  const recipientEmail = getRecipientEmail(jobData.to);

  try {
    console.log('Sending email with data:', JSON.stringify(jobData, null, 2)); // Debug log

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
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563EB; margin-bottom: 24px; font-size: 24px;">
                ¡Tu oferta está publicada!
              </h1>
            </div>

            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
              <div style="margin-bottom: 24px;">
                <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 8px;">${jobData.jobTitle}</h2>
                <p style="color: #666; font-size: 16px; margin: 0;">${jobData.companyName}</p>
              </div>

              <div style="margin-bottom: 24px;">
                <h3 style="color: #4a5568; font-size: 16px; margin-bottom: 8px;">Detalles de la oferta:</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="margin-bottom: 8px;">📍 Modalidad: ${getJobTypeLabel(jobData.jobType)}</li>
                  ${jobData.location ? `<li style="margin-bottom: 8px;">🏢 Ubicación: ${jobData.location}</li>` : ''}
                  <li style="margin-bottom: 8px;">💰 Salario: ${formatSalary(jobData)}</li>
                </ul>
              </div>

              ${jobData.benefits && jobData.benefits.length > 0 ? `
                <div style="margin-bottom: 24px;">
                  <h3 style="color: #4a5568; font-size: 16px; margin-bottom: 8px;">Beneficios:</h3>
                  <ul style="list-style: none; padding: 0; margin: 0;">
                    ${jobData.benefits.map(benefit => `
                      <li style="margin-bottom: 4px;">✨ ${benefit.name}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}

              <div style="margin-bottom: 24px;">
                <h3 style="color: #4a5568; font-size: 16px; margin-bottom: 8px;">Descripción:</h3>
                <div style="white-space: pre-line; color: #4a5568;">${jobData.description}</div>
              </div>

              <div style="background-color: #F3F4F6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0;">Gestiona tu oferta con este enlace:</p>
                <a href="${jobData.managementUrl}" 
                   style="color: #2563EB; text-decoration: none; word-break: break-all;">
                  ${jobData.managementUrl}
                </a>
              </div>

              <p style="color: #666; font-size: 14px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee;">
                Este enlace es privado, no lo compartas con nadie.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 12px;">
              <p>© 2024 DisñoJobs. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error };
  }
}
