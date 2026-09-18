import Link from 'next/link';
import { CONTACT_EMAIL } from './LegalPage';

export function TermsEn() {
  return (
    <>
      <h2>1. What Shopylist is</h2>
      <p>
        Shopylist is a free app for keeping and sharing shopping lists. It is run by an
        individual, non-commercially (contact:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>).
      </p>

      <h2>2. Account</h2>
      <p>
        Using the app requires signing in with a Google account. By signing in you accept these
        terms and the <Link href="/privacy">privacy policy</Link>. You can have your account
        deleted at any time by writing to the contact address.
      </p>

      <h2>3. Rules</h2>
      <ul>
        <li>You use the app for your own needs and in accordance with the law.</li>
        <li>
          You do not try to access other users&apos; lists or disrupt the service.
        </li>
        <li>
          When sharing by email, you only enter addresses of people who agree to it.
        </li>
        <li>
          You do not put other people&apos;s personal data or unlawful content on lists. A
          public list link can be opened by anyone who has it.
        </li>
      </ul>

      <h2>4. Sharing and public links</h2>
      <p>
        The list owner decides who gets access and with what permissions. A public link works
        until the owner turns it off. The person who entered content is responsible for it.
      </p>

      <h2>5. Sorting by category</h2>
      <p>
        Sorting uses a language model and may assign a category incorrectly. It is a
        convenience, not a guarantee of correctness.
      </p>

      <h2>6. Availability and liability</h2>
      <p>
        The app is provided &quot;as is&quot;, with no guarantee of uninterrupted operation or
        data retention. The operator may change or discontinue the service, announcing it on the
        home page with reasonable notice where possible. The operator&apos;s liability is
        limited to the extent required by mandatory law.
      </p>

      <h2>7. Changes to these terms</h2>
      <p>
        Material changes will be announced in the app. Continued use after a change means you
        accept it. If you disagree, stop using the app and ask for your account to be deleted.
      </p>

      <h2>8. Governing law</h2>
      <p>These terms are governed by Polish law.</p>
    </>
  );
}
