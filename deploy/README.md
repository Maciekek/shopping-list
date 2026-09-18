# Deploying shopping-list on the Mikrus VPS

Runs the prebuilt image from GHCR. Nothing is built on the server.

- **Database**: Mikrus shared PostgreSQL (`psql.mikr.us`), credentials from the Mikrus panel.
- **TLS / reverse proxy**: the shared [vps-proxy](https://github.com/Maciekek/vps-proxy) stack.
  This compose only declares its domain via labels and joins the `web` network.
- **Migrations**: `prisma migrate deploy` runs automatically when the container starts.

## Requirements

- Docker with the Compose plugin.
- [vps-proxy](https://github.com/Maciekek/vps-proxy) running on the VPS (owns ports 80/443 and the `web` network).
- DNS: A record for `shopylist.pl` and `www` pointing at the VPS.

## First deploy

```bash
# on the server
mkdir -p ~/shopping-list && cd ~/shopping-list
curl -fsSLO https://raw.githubusercontent.com/Maciekek/shopping-list/main/deploy/docker-compose.yml
curl -fsSLO https://raw.githubusercontent.com/Maciekek/shopping-list/main/deploy/update.sh
curl -fsSLO https://raw.githubusercontent.com/Maciekek/shopping-list/main/deploy/backup.sh
curl -fsSL  https://raw.githubusercontent.com/Maciekek/shopping-list/main/deploy/.env.example -o .env
chmod +x update.sh backup.sh && chmod 600 .env
nano .env          # DOMAIN, DATABASE_URL, AUTH_SECRET, GOOGLE_*, SMTP_*, GEMINI_API_KEY

docker compose up -d
docker compose logs -f
```

Expect the migrations list, then `Ready`. If the GitHub repo is private, first
`echo "<PAT with read:packages>" | docker login ghcr.io -u Maciekek --password-stdin`.

vps-proxy notices the new container within seconds and fetches the certificate once DNS resolves.

In Google Cloud Console add the OAuth client origin `https://shopylist.pl` and redirect URI
`https://shopylist.pl/api/auth/callback/google`.

Open `https://shopylist.pl`.

## Updating

```bash
./update.sh
```

Pulls the newest `latest` (or the tag set in `SHOPPING_LIST_TAG`) and restarts if it changed.
Every push to `main` publishes a new image. For hands-off updates put it in cron:

```
*/15 * * * * /home/USER/shopping-list/update.sh >/dev/null 2>&1
```

## Pinning a version

Set `SHOPPING_LIST_TAG=<commit sha>` in `.env`, then `./update.sh`.

## Backups

`backup.sh` dumps the shared DB through a throwaway `postgres:16-alpine` container and keeps
the last 14 dumps in `~/backups/shopping-list`.

```
15 3 * * * /home/USER/shopping-list/backup.sh >> /home/USER/backups/shopping-list.log 2>&1
```

Sync `~/backups` off the VPS (rclone) if the data matters.

## E-mail

Share notifications go through Brevo SMTP, same account as my-pi-home. `SMTP_FROM` must be a
sender verified in Brevo: your Gmail works right away, `hello@shopylist.pl` after adding the
domain (two DNS records) in Brevo.

## Useful commands

```bash
docker compose logs -f
docker compose run --rm -e SKIP_MIGRATIONS=1 shopping-list sh
docker compose run --rm shopping-list node node_modules/prisma/build/index.js migrate status
```

## Local image test

```bash
docker build -t shopping-list .
docker run --rm -p 3000:3000 --env-file .env shopping-list
```
