import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { getTranslations } from 'next-intl/server';
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
    // Language of the person sharing; the recipient's preference is unknown.
    const t = await getTranslations('Email');
    const vars = { from, listName };
    const props = {
      listUrl,
      copy: {
        subject: t('subject', vars),
        hi: t('hi'),
        shared: t('shared', vars),
        openHere: t('openHere'),
        signInHint: t('signInHint'),
        footer: t('footer', vars)
      }
    };

    await transporter.sendMail({
      // SMTP_FROM may be a bare address or "Name <address>"
      from: process.env.SMTP_FROM,
      to,
      // replies go to the person who shared, not to the app mailbox
      replyTo: from,
      subject: props.copy.subject,
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
