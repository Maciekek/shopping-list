import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import SharedListNotifyEmail from '@/emails/SharedListNotifyEmail';

const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
    })
  : null;

const sendShareEmail = async ({
  to,
  from,
  listUrl
}: {
  to: string;
  from: string;
  listUrl: string;
}) => {
  if (!transporter) {
    console.warn('[emails] SMTP not configured, skipping share email to', to);
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Shared list is waiting for you',
      html: render(SharedListNotifyEmail({ listUrl, from }))
    });
  } catch (error) {
    console.error('[emails] failed to send share email to', to, error);
  }
};

const emailService = {
  sendShareEmail
};

export { emailService };
