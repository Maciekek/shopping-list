import * as postmark from 'postmark';
import { render } from '@react-email/render';
import SharedListNotifyEmail from '@/emails/SharedListNotifyEmail';

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN || 'test');

const common_mail_config = {
  From: 'hello@shopylist.xyz',
}

const sendShareEmail = ({to, from, listUrl}: {to: string, from: string, listUrl: string}) => {
  const emailHtml = render(SharedListNotifyEmail({ listUrl, from }));

  const options = {
    ...common_mail_config,
    To: to,
    Subject: 'Shared list is waiting for you',
    HtmlBody: emailHtml,
  };

  client.sendEmail(options);
}


const emailService = {
  sendShareEmail
}

export {
  emailService
}
