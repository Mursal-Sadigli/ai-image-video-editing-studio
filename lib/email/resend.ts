import { Resend } from "resend";
import WelcomeEmail from "@/components/emails/welcome-email";
import JobCompletedEmail from "@/components/emails/job-completed-email";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function sendWelcomeEmail(toEmail: string, userFirstName?: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping Welcome email.");
    return;
  }

  try {
    await resend.emails.send({
      from: "VisionAI <hello@visionai.demo>",
      to: [toEmail],
      subject: "VisionAI-yə Xoş Gəldiniz! 🚀",
      react: WelcomeEmail({ userFirstName }),
    });
    console.log(`Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendJobCompletedEmail(
  toEmail: string, 
  userFirstName?: string, 
  jobType?: string, 
  projectUrl?: string
) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping Job Completed email.");
    return;
  }

  try {
    await resend.emails.send({
      from: "VisionAI <hello@visionai.demo>",
      to: [toEmail],
      subject: "Müjdə! Prosesiniz tamamlandı 🎉",
      react: JobCompletedEmail({ userFirstName, jobType, projectUrl }),
    });
    console.log(`Job completed email sent to ${toEmail}`);
  } catch (error) {
    console.error("Failed to send job completed email:", error);
  }
}
