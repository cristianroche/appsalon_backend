import { createTransport } from "../config/nodemailer.js";

export const sendEmailNewAppointment = async ({ date, time }) => {
  const transporter = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transporter.sendMail({
    from: "AppSalon - <appointments@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "AppSalon - New appointment",
    text: "AppSalon - New appointment",
    html: `
      <p>Hello Admin, you have a new appointment</p>
      <p>The appointment will be on ${date} at ${time} hours</p>
    `,
  });

  console.log(`Email sent: ${info.messageId}`);
};

export const sendEmailUpdatedAppointment = async ({ date, time }) => {
  const transporter = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transporter.sendMail({
    from: "AppSalon - <appointments@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "AppSalon - Updated appointment",
    text: "AppSalon - Updated appointment",
    html: `
      <p>Hello Admin, A user has modified an appointment.</p>
      <p>The new appointment will be on ${date} at ${time} hours</p>
    `,
  });

  console.log(`Email sent: ${info.messageId}`);
};

export const sendEmailCancelledAppointment = async ({ date, time }) => {
  const transporter = createTransport(
    process.env.MAILTRAP_HOST,
    process.env.MAILTRAP_PORT,
    process.env.MAILTRAP_USER,
    process.env.MAILTRAP_PASS
  );

  const info = await transporter.sendMail({
    from: "AppSalon - <appointments@appsalon.com>",
    to: "admin@appsalon.com",
    subject: "AppSalon - Cancelled appointment",
    text: "AppSalon - Cancelled appointment",
    html: `
      <p>Hello Admin, A user has cancelled an appointment.</p>
      <p>The appointment was scheduled for ${date} at ${time} hours</p>
    `,
  });

  console.log(`Email sent: ${info.messageId}`);
};
