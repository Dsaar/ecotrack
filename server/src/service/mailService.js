// src/services/mailService.js
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_SECURE,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
  APP_BASE_URL,
} = process.env;


const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  secure: MAIL_SECURE === "true",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});


export async function verifyMail() {
  try {
    await transporter.verify();
    console.log("📧 Mail server ready");
  } catch (err) {
    console.error("❌ Mail server error:", err);
  }
}



const logoPath = path.join(__dirname, "../../public/ecotrack-logo.png");

/* ================================
   SEND WELCOME EMAIL
   ================================ */
export async function sendWelcomeEmail({ to, firstName }) {
  const html = `
  <div style="font-family:Arial,sans-serif;background:#f6f7f9;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb">

<div style="padding:20px;border-bottom:1px solid #e5e7eb;text-align:center">
  <img
    src="cid:ecotracklogo"
    alt="EcoTrack"
    width="160"
    style="
      max-width:160px;
      width:100%;
      height:auto;
      display:block;
      margin:0 auto;
    "
  />
</div>


      <div style="padding:24px">
        <h2 style="margin:0 0 12px">
          Welcome${firstName ? `, ${firstName}` : ""}! 🌱
        </h2>

        <p style="color:#374151;line-height:1.5">
          Your EcoTrack account has been successfully created.
          Start completing missions and tracking your environmental impact.
        </p>

        <a
          href="${APP_BASE_URL}/dashboard"
          style="display:inline-block;margin-top:16px;padding:10px 16px;
                 background:#166534;color:white;text-decoration:none;
                 border-radius:10px;font-weight:600"
        >
          Go to my dashboard
        </a>

        <p style="margin-top:24px;color:#6b7280;font-size:12px">
          If you didn’t create an EcoTrack account, you can ignore this email.
        </p>
      </div>

      <div style="padding:16px;background:#f9fafb;font-size:12px;color:#6b7280">
        © ${new Date().getFullYear()} EcoTrack
      </div>
    </div>
  </div>
  `;


  return transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject: "Welcome to EcoTrack 🌍",

    // 👇 Plain-text fallback (helps spam + accessibility)
    text: `Welcome${firstName ? `, ${firstName}` : ""}!

Your EcoTrack account has been created.
Open your dashboard: ${APP_BASE_URL}/dashboard
`,

    html,

    // 👇 INLINE IMAGE ATTACHMENT
    attachments: [
      {
        filename: "ecotrack-logo.png",
        path: logoPath,
        cid: "ecotracklogo", // must match img src
      },
    ],
  });
}
