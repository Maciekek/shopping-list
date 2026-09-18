import { CONTACT_EMAIL } from './LegalPage';

export function PrivacyPl() {
  return (
    <>
      <h2>Kto</h2>
      <p>
        Shopylist to prywatna, niekomercyjna aplikacja prowadzona przez osobę fizyczną
        (kontakt: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>). Nie ma reklam,
        nie sprzedaje danych i nie profiluje użytkowników.
      </p>

      <h2>Jakie dane</h2>
      <ul>
        <li>
          <strong>Z konta Google</strong> po zalogowaniu: identyfikator konta, adres e-mail,
          imię i nazwisko, adres zdjęcia profilowego. Nie mamy dostępu do hasła, poczty,
          kontaktów ani innych danych Google.
        </li>
        <li>
          <strong>Wpisane przez Ciebie</strong>: nazwy list, produkty na listach, ich kolejność
          i stan odhaczenia, ustawienia udostępniania.
        </li>
        <li>
          <strong>Adresy e-mail osób, którym udostępniasz listę.</strong> Wpisując czyjś adres,
          potwierdzasz, że możesz go użyć w tym celu. Ta osoba otrzyma jedną wiadomość
          z informacją o udostępnieniu i Twoim adresem jako nadawcy.
        </li>
        <li>
          <strong>Techniczne</strong>: plik cookie sesji logowania oraz cookie{' '}
          <code>NEXT_LOCALE</code> z wybranym językiem. Bez cookies analitycznych i śledzących.
          Serwer i proxy zapisują standardowe logi dostępu (adres IP, czas, adres URL),
          usuwane automatycznie po krótkim czasie.
        </li>
      </ul>

      <h2>Po co</h2>
      <p>
        Wyłącznie do działania aplikacji: rozpoznanie Cię po zalogowaniu, przypisanie list do
        Twojego konta, udostępnianie list wskazanym osobom, wysyłka powiadomienia o udostępnieniu
        i sortowanie produktów po kategoriach. Nie wysyłamy newsletterów.
      </p>

      <h2>Podmioty przetwarzające</h2>
      <ul>
        <li>
          <strong>Google</strong> (Google Ireland Ltd.): logowanie kontem Google, zgodnie z{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            polityką prywatności Google
          </a>
          .
        </li>
        <li>
          <strong>Google Gemini</strong>: gdy klikniesz „Sortuj po kategoriach”, nazwy produktów z
          tej listy są wysyłane do modelu Gemini w celu przypisania kategorii. Wysyłamy tylko
          nazwy produktów, bez Twoich danych konta. Google nie używa danych z API do trenowania
          modeli w płatnych planach; szczegóły w{' '}
          <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noreferrer">
            warunkach Gemini API
          </a>
          .
        </li>
        <li>
          <strong>Brevo</strong> (Sendinblue SAS, Francja): wysyłka wiadomości o udostępnieniu
          listy. Brevo widzi adres odbiorcy, adres nadawcy i treść wiadomości.
        </li>
        <li>
          <strong>Cloudflare</strong>: ruch do aplikacji przechodzi przez sieć Cloudflare
          (ochrona i szyfrowanie połączenia). Cloudflare przetwarza adresy IP i metadane
          połączeń.
        </li>
        <li>
          <strong>Hosting</strong>: serwer i baza danych znajdują się w Unii Europejskiej
          (usługa Mikrus).
        </li>
      </ul>

      <h2>Jak długo</h2>
      <p>
        Dane konta i list trzymamy do momentu ich usunięcia przez Ciebie lub na Twoją prośbę.
        Sesja logowania wygasa po 30 dniach lub po wylogowaniu. Kopie zapasowe bazy są
        przechowywane do 14 dni.
      </p>

      <h2>Usunięcie danych</h2>
      <p>
        Listy usuwasz bezpośrednio w aplikacji. Aby usunąć całe konto wraz z listami i
        udostępnieniami, napisz na <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> z
        adresu, którym się logujesz. Usuniemy dane w ciągu 14 dni. Możesz też cofnąć dostęp
        aplikacji w ustawieniach konta Google (myaccount.google.com → Bezpieczeństwo →
        Połączenia z aplikacjami innych firm).
      </p>

      <h2>Twoje prawa</h2>
      <p>
        Masz prawo dostępu do danych, ich poprawienia, usunięcia, ograniczenia przetwarzania i
        przeniesienia. Wszystkie wpisane dane widzisz i edytujesz w aplikacji. Przysługuje Ci
        skarga do Prezesa Urzędu Ochrony Danych Osobowych.
      </p>

      <h2>Zmiany</h2>
      <p>
        O istotnych zmianach tej polityki poinformujemy komunikatem w aplikacji. Aktualna wersja
        jest zawsze pod tym adresem.
      </p>
    </>
  );
}
