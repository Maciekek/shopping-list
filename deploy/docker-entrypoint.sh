#!/bin/sh
set -e

if [ "${SKIP_MIGRATIONS:-0}" != "1" ]; then
  echo "[entrypoint] running prisma migrate deploy"
  node node_modules/prisma/build/index.js migrate deploy
fi

exec "$@"
