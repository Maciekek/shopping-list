import { CONTACT_EMAIL } from './LegalPage';

export function PrivacyEn() {
  return (
    <>
      <h2>Who</h2>
      <p>
        Shopylist is a private, non-commercial app run by an individual (contact:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>). No ads, no selling of data,
        no profiling.
      </p>

      <h2>What data</h2>
      <ul>
        <li>
          <strong>From your Google account</strong> after sign-in: account id, email address,
          name, profile picture URL. We have no access to your password, mail, contacts or any
          other Google data.
        </li>
        <li>
          <strong>Entered by you</strong>: list names, items on the lists, their order and
          checked state, sharing settings.
        </li>
        <li>
          <strong>Email addresses of people you share a list with.</strong> By entering
          someone&apos;s address you confirm you may use it for this purpose. They receive one
          message about the share, with your address as the sender.
        </li>
        <li>
          <strong>Technical</strong>: a sign-in session cookie and a <code>NEXT_LOCALE</code>{' '}
          cookie with the chosen language. No analytics or tracking cookies. The server and
          proxy keep standard access logs (IP address, time, URL), rotated automatically after a
          short period.
        </li>
      </ul>

      <h2>Why</h2>
      <p>
        Only to run the app: recognise you after sign-in, attach lists to your account, share
        lists with the people you choose, send the share notification and sort items by
        category. No newsletters.
      </p>

      <h2>Processors</h2>
      <ul>
        <li>
          <strong>Google</strong> (Google Ireland Ltd.): sign-in with Google, under the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Google privacy policy
          </a>
          .
        </li>
        <li>
          <strong>Google Gemini</strong>: when you click &quot;Sort by category&quot;, the item
          names from that list are sent to the Gemini model to assign categories. Only item
          names are sent, never your account data. See the{' '}
          <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">
            Gemini API terms
          </a>
          .
        </li>
        <li>
          <strong>Brevo</strong> (Sendinblue SAS, France): delivery of share notifications.
          Brevo sees the recipient address, sender address and message content.
        </li>
        <li>
          <strong>Cloudflare</strong>: traffic to the app passes through the Cloudflare network
          (protection and connection encryption). Cloudflare processes IP addresses and
          connection metadata.
        </li>
        <li>
          <strong>Hosting</strong>: the server and database are located in the European Union
          (Mikrus service).
        </li>
      </ul>

      <h2>How long</h2>
      <p>
        Account and list data are kept until you delete them or ask us to. The sign-in session
        expires after 30 days or on sign-out. Database backups are kept for up to 14 days.
      </p>

      <h2>Deleting your data</h2>
      <p>
        You delete lists directly in the app. To delete your whole account with all lists and
        shares, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from the address
        you sign in with. We delete the data within 14 days. You can also revoke the app&apos;s
        access in your Google account settings (myaccount.google.com → Security → Third-party
        apps &amp; services).
      </p>

      <h2>Your rights</h2>
      <p>
        You have the right to access, correct, delete, restrict and port your data. Everything
        you entered is visible and editable in the app. You may also lodge a complaint with the
        Polish data protection authority (UODO) or your local one.
      </p>

      <h2>Changes</h2>
      <p>
        Material changes to this policy will be announced in the app. The current version is
        always at this address.
      </p>
    </>
  );
}
