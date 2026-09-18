#!/bin/sh
# Dumps the Mikrus shared Postgres to ~/backups, keeps last 14 dumps.
# Cron example (daily 03:15):  15 3 * * * /home/USER/shopping-list/backup.sh
set -eu

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups/shopping-list}"
KEEP="${KEEP:-14}"

# read DATABASE_URL from .env, strip query params (pg_dump rejects connection_limit)
DB_URL="$(grep '^DATABASE_URL=' "$APP_DIR/.env" | cut -d= -f2- | sed 's/?.*$//')"

mkdir -p "$BACKUP_DIR"
OUT="$BACKUP_DIR/shopping-list-$(date +%Y%m%d-%H%M%S).sql.gz"

docker run --rm postgres:16-alpine pg_dump --no-owner --no-privileges "$DB_URL" | gzip > "$OUT"

ls -1t "$BACKUP_DIR"/*.sql.gz | tail -n +$((KEEP + 1)) | xargs -r rm --
echo "backup written: $OUT"
