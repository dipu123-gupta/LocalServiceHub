import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Create a transporter with proper TLS config for production (Brevo/STARTTLS on port 587)
  const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 587;
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      // Do not fail on invalid/self-signed certs (needed for some hosting providers)
      rejectUnauthorized: false,
    },
  });

  // Define the email options
  const message = {
    from: `${process.env.FROM_NAME || "HomeServiceHub"} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    ...(options.html && { html: options.html }),
  };

  console.log(`📧 Attempting to send email to: ${options.email} | Subject: ${options.subject}`);
  console.log(`📧 SMTP Config -> Host: ${process.env.SMTP_HOST}, Port: ${smtpPort}, User: ${process.env.SMTP_EMAIL ? "SET" : "NOT SET"}, Pass: ${process.env.SMTP_PASSWORD ? "SET" : "NOT SET"}`);

  const info = await transporter.sendMail(message);

  console.log("✅ Message sent: %s", info.messageId);
};

export default sendEmail;
