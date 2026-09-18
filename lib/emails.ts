import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import SharedListNotifyEmail, {
  sharedListNotifyText
} from '@/emails/SharedListNotifyEmail';

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
  listUrl,
  listName
}: {
  to: string;
  from: string;
  listUrl: string;
  listName: string;
}) => {
  if (!transporter) {
    console.warn('[emails] SMTP not configured, skipping share email to', to);
    return;
  }

  try {
    const props = { listUrl, listName, from };

    await transporter.sendMail({
      // SMTP_FROM may be a bare address or "Name <address>"
      from: process.env.SMTP_FROM,
      to,
      // replies go to the person who shared, not to the app mailbox
      replyTo: from,
      subject: `${from} shared "${listName}" with you`,
      text: sharedListNotifyText(props),
      html: render(SharedListNotifyEmail(props))
    });
  } catch (error) {
    console.error('[emails] failed to send share email to', to, error);
  }
};

const emailService = {
  sendShareEmail
};

export { emailService };
