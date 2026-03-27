# Deploy na Mikrus VPS

Poniżej minimalny setup dla tego projektu (`Next.js + Prisma + Postgres`) na małym VPS.

## 1) Wymagania systemowe

- Ubuntu/Debian
- Node.js 20
- npm (z Node)
- PostgreSQL
- nginx
- certbot

## 2) Aplikacja i build

```bash
mkdir -p ~/apps
cd ~/apps
git clone <URL_TWOJEGO_REPO> shopping-list
cd shopping-list

cp deploy/mikrus/.env.production.example .env.production
# Uzupełnij .env.production

npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

## 3) Konfiguracja systemd

```bash
sudo cp deploy/mikrus/shopping-list.service /etc/systemd/system/shopping-list.service
```

Edytuj plik `/etc/systemd/system/shopping-list.service`:
- podmień `YOUR_LINUX_USER`
- upewnij się, że `WorkingDirectory` wskazuje na katalog projektu

Następnie:

```bash
sudo systemctl daemon-reload
sudo systemctl enable shopping-list
sudo systemctl start shopping-list
sudo systemctl status shopping-list
```

## 4) Konfiguracja nginx

```bash
sudo cp deploy/mikrus/nginx-shopping-list.conf /etc/nginx/sites-available/shopping-list
sudo ln -s /etc/nginx/sites-available/shopping-list /etc/nginx/sites-enabled/shopping-list
```

Edytuj `/etc/nginx/sites-available/shopping-list`:
- podmień `your-domain.example`

Sprawdź i przeładuj:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5) Certyfikat SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.example -d www.your-domain.example
```

Po wygenerowaniu certyfikatu sprawdź jeszcze raz:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6) Deploy kolejnych zmian

```bash
cd ~/apps/shopping-list
git pull
npm ci
npx prisma migrate deploy
npm run build
sudo systemctl restart shopping-list
```

## Checklista .env.production

Wymagane:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Opcjonalne:
- `POSTMARK_API_TOKEN` (jeśli chcesz wysyłkę e-maili)
