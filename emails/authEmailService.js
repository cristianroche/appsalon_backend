import { createTransport } from "../config/nodemailer.js";

export const sendEmailVerification = async ({ name, email, token }) => {
  const transporter = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transporter.sendMail({
    from: "AppSalon - <accounts@appsalon.com>",
    to: email,
    subject: "AppSalon - Verify your account",
    text: "AppSalon - Verify your account",
    html: `
      <p>Hello ${name}</p>
      <p>Your account is almost ready, please click the link below to verify your email</p>
      <a href="${process.env.FRONTEND_CONFIRMATION_URL}/${token}">Confirm your Account</a>
      <p>if you didn't request this account, please ignore this email</p>
    `,
  });

  console.log(`Email sent: ${info.messageId}`);
};

export const sendEmailForgotPassword = async ({ name, email, token }) => {
  const transporter = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transporter.sendMail({
    from: "AppSalon - <accounts@appsalon.com>",
    to: email,
    subject: "AppSalon - Reset your password",
    text: "AppSalon - Reset your password",
    html: `
      <p>Hello ${name}, you have requested to reset your password</p>
      <p>Follow the link below to generate a new password</p>
      <a href="${process.env.FRONTEND_RESET_PASSWORD_URL}/${token}">Reset your password</a>
      <p>if you didn't request this, please ignore this email</p>
    `,
  });
  console.log(`Email sent: ${info.messageId}`);
};
