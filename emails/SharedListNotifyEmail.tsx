import * as React from 'react';
import { Html, Head, Body, Container, Text, Link } from '@react-email/components';

export type SharedListNotifyEmailProps = {
  listUrl: string;
  listName: string;
  from: string;
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
export function SharedListNotifyEmail({
  listUrl,
  listName,
  from
}: SharedListNotifyEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <title>{`${from} shared "${listName}" with you`}</title>
      </Head>
      <Body style={{ backgroundColor: '#ffffff', margin: 0 }}>
        <Container style={{ padding: '24px', maxWidth: '560px' }}>
          <Text style={text}>Hi,</Text>
          <Text style={text}>
            {from} shared the shopping list <strong>{listName}</strong> with
            you on Shopylist.
          </Text>
          <Text style={text}>
            Open it here: <Link href={listUrl}>{listUrl}</Link>
          </Text>
          <Text style={text}>
            Sign in with the Google account this email was sent to and the list
            will be waiting for you.
          </Text>
          <Text style={{ ...text, color: '#6b7280', fontSize: '14px' }}>
            You got this email because {from} added your address to a shared
            list. Reply to this message to reach them directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function sharedListNotifyText({
  listUrl,
  listName,
  from
}: SharedListNotifyEmailProps) {
  return [
    'Hi,',
    '',
    `${from} shared the shopping list "${listName}" with you on Shopylist.`,
    '',
    `Open it here: ${listUrl}`,
    '',
    'Sign in with the Google account this email was sent to and the list will be waiting for you.',
    '',
    `You got this email because ${from} added your address to a shared list. Reply to this message to reach them directly.`
  ].join('\n');
}

export default SharedListNotifyEmail;
