import * as React from 'react';
import { Html, Head, Body, Container, Text, Link } from '@react-email/components';

export type SharedListEmailCopy = {
  subject: string;
  hi: string;
  shared: string;
  openHere: string;
  signInHint: string;
  footer: string;
};

export type SharedListNotifyEmailProps = {
  listUrl: string;
  copy: SharedListEmailCopy;
};

const text = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1f2937',
  margin: '0 0 16px'
};

// Deliberately plain: a short personal note reads as transactional mail,
// a banner + button layout reads as a promotion.
export function SharedListNotifyEmail({ listUrl, copy }: SharedListNotifyEmailProps) {
  return (
    <Html>
      <Head>
        <title>{copy.subject}</title>
      </Head>
      <Body style={{ backgroundColor: '#ffffff', margin: 0 }}>
        <Container style={{ padding: '24px', maxWidth: '560px' }}>
          <Text style={text}>{copy.hi}</Text>
          <Text style={text}>{copy.shared}</Text>
          <Text style={text}>
            {copy.openHere} <Link href={listUrl}>{listUrl}</Link>
          </Text>
          <Text style={text}>{copy.signInHint}</Text>
          <Text style={{ ...text, color: '#6b7280', fontSize: '14px' }}>{copy.footer}</Text>
        </Container>
      </Body>
    </Html>
  );
}

export function sharedListNotifyText({ listUrl, copy }: SharedListNotifyEmailProps) {
  return [
    copy.hi,
    '',
    copy.shared,
    '',
    `${copy.openHere} ${listUrl}`,
    '',
    copy.signInHint,
    '',
    copy.footer
  ].join('\n');
}

export default SharedListNotifyEmail;
