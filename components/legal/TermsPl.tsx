import Link from 'next/link';
import { CONTACT_EMAIL } from './LegalPage';

export function TermsPl() {
  return (
    <>
      <h2>1. Czym jest Shopylist</h2>
      <p>
        Shopylist to bezpłatna aplikacja do prowadzenia i udostępniania list zakupów. Prowadzi
        ją osoba fizyczna, niekomercyjnie (kontakt:{' '}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>).
      </p>

      <h2>2. Konto</h2>
      <p>
        Korzystanie wymaga zalogowania kontem Google. Logując się, akceptujesz ten regulamin i{' '}
        <Link href="/privacy">politykę prywatności</Link>. Konto możesz usunąć w każdej chwili,
        pisząc na adres kontaktowy.
      </p>

      <h2>3. Zasady</h2>
      <ul>
        <li>Używasz aplikacji na własne potrzeby, zgodnie z prawem.</li>
        <li>
          Nie próbujesz uzyskać dostępu do list innych użytkowników ani zakłócać działania
          serwisu.
        </li>
        <li>
          Udostępniając listę po e-mailu, podajesz adresy tylko osób, które się na to zgadzają.
        </li>
        <li>
          Nie umieszczasz na listach danych osobowych innych osób ani treści bezprawnych.
          Publiczny link do listy może otworzyć każdy, kto go ma.
        </li>
      </ul>

      <h2>4. Udostępnianie i publiczne linki</h2>
      <p>
        Właściciel listy decyduje, komu ją udostępnia i z jakimi uprawnieniami. Publiczny link
        działa do momentu wyłączenia go przez właściciela. Za treść listy odpowiada osoba, która
        ją wpisała.
      </p>

      <h2>5. Sortowanie po kategoriach</h2>
      <p>
        Funkcja sortowania korzysta z modelu językowego i może przypisać kategorię błędnie. To
        udogodnienie, nie gwarancja poprawności.
      </p>

      <h2>6. Dostępność i odpowiedzialność</h2>
      <p>
        Aplikacja jest udostępniana „tak jak jest”, bez gwarancji ciągłości działania ani
        zachowania danych. Administrator może zmienić lub zakończyć działanie serwisu,
        informując o tym na stronie głównej z rozsądnym wyprzedzeniem, gdy to możliwe.
        Odpowiedzialność administratora jest ograniczona do zakresu wymaganego bezwzględnie
        obowiązującymi przepisami prawa.
      </p>

      <h2>7. Zmiany regulaminu</h2>
      <p>
        O istotnych zmianach poinformujemy komunikatem w aplikacji. Dalsze korzystanie po
        zmianie oznacza jej akceptację. Jeśli się nie zgadzasz, przestań korzystać z aplikacji i
        poproś o usunięcie konta.
      </p>

      <h2>8. Prawo</h2>
      <p>Regulamin podlega prawu polskiemu.</p>
    </>
  );
}
