# Shopylist

Shared shopping lists. Sign in with Google, create a list, add items on your phone, tick
them off in the store, share the list with family or friends by email or a public link.
Items can be sorted into store categories with an LLM.

Live: https://shopylist.pl

## Stack

Next.js 14 (App Router, server actions), Prisma + PostgreSQL, Auth.js with Google,
Tailwind + Radix UI, next-intl (Polish default, English when the browser prefers it),
nodemailer over Brevo SMTP, Gemini for category sorting.

## Local development

```bash
pnpm install
cp .env.local.example .env          # fill DATABASE_URL, AUTH_SECRET, GOOGLE_*
docker compose up -d db             # local Postgres
pnpm exec prisma migrate dev
pnpm dev
```

## Deployment

Docker image built by GitHub Actions and published to GHCR on every push to `main`.
See [`deploy/README.md`](deploy/README.md) for running it on the VPS.

## License

MIT, see [LICENSE.md](LICENSE.md).
