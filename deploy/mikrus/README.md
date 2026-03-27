# Deploy on Mikrus VPS

Below is a minimal setup for this project (`Next.js + Prisma + Postgres`) on a small VPS.

## 1) System Requirements

- Ubuntu/Debian
- Node.js 20
- npm (from Node)
- PostgreSQL
- nginx
- certbot

## 2) App Setup and Build

```bash
mkdir -p ~/apps
cd ~/apps
git clone <YOUR_REPO_URL> shopping-list
cd shopping-list

cp deploy/mikrus/.env.production.example .env.production
# Fill in .env.production

npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
```

## 3) systemd Configuration

```bash
sudo cp deploy/mikrus/shopping-list.service /etc/systemd/system/shopping-list.service
```

Edit `/etc/systemd/system/shopping-list.service`:
- replace `YOUR_LINUX_USER`
- make sure `WorkingDirectory` points to your project directory

Then run:

```bash
sudo systemctl daemon-reload
sudo systemctl enable shopping-list
sudo systemctl start shopping-list
sudo systemctl status shopping-list
```

## 4) nginx Configuration

```bash
sudo cp deploy/mikrus/nginx-shopping-list.conf /etc/nginx/sites-available/shopping-list
sudo ln -s /etc/nginx/sites-available/shopping-list /etc/nginx/sites-enabled/shopping-list
```

Edit `/etc/nginx/sites-available/shopping-list`:
- replace `your-domain.example`

Validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 5) SSL Certificate (Let's Encrypt)

```bash
sudo certbot --nginx -d your-domain.example -d www.your-domain.example
```

After issuing the certificate, validate again:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6) Deploying Updates

```bash
cd ~/apps/shopping-list
git pull
npm ci
npx prisma migrate deploy
npm run build
sudo systemctl restart shopping-list
```

## .env.production Checklist

Required:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Optional:
- `POSTMARK_API_TOKEN` (required only if you want email sending)
