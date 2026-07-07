# Deployment Guide

GroupFinder deploys to Vercel via GitHub Actions, backed by a single Vercel Postgres database used in both local development and production.

## 1. Create the database (Vercel Postgres)

1. In the Vercel dashboard, open your project → **Storage** → **Create** → **Postgres**.
2. Copy the **pooled connection string** (`?pgbouncer=true&connection_limit=1` is fine for serverless). This is your `DATABASE_URL`.
3. Add it as an environment variable to the Vercel project (all environments): `DATABASE_URL`.
4. Use the **same** `DATABASE_URL` locally — copy it into `.env` (created from `example.env`). This gives you one DB for local + prod as requested.

> `prisma migrate dev` against the remote Vercel Postgres works but is slower than a local DB. That's expected for a shared remote DB.

## 2. Local setup

```bash
cp example.env .env        # then fill in DATABASE_URL + AUTH_SECRET
pnpm install               # postinstall runs `prisma generate`
pnpm prisma:migrate --name init   # creates + applies the first migration (commits prisma/migrations/)
pnpm prisma:seed           # seeds demo user (demo@test.com / demo), groups, activities, posts, messages, admin
pnpm dev
```

Demo login: **demo@test.com** / **demo** (the demo user is a real seeded row with `super_admin` rights).

## 3. Required Vercel project environment variables

| Variable | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Vercel Postgres pooled string | same locally and in prod |
| `AUTH_SECRET` | `openssl rand -base64 32` | required by Auth.js v5 |
| `NEXT_PUBLIC_BASE_URL` | your prod URL | optional |

**Do NOT set `AUTH_URL` on Vercel** — Auth.js v5 auto-derives it from `VERCEL_URL`. Set `AUTH_URL` only in your local `.env`.

`postinstall: prisma generate` and the `build` script (`prisma generate && next build`) ensure the Prisma client exists in the Vercel build environment.

## 4. Required GitHub secrets (for the deploy workflow)

Add these as repository secrets (Settings → Secrets and variables → Actions):

| Secret | Source |
|---|---|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens (create a token) |
| `VERCEL_ORG_ID` | from `vercel link` (or Vercel project settings) |
| `VERCEL_PROJECT_ID` | from `vercel link` (or Vercel project settings) |
| `DATABASE_URL` | the Vercel Postgres connection string (used by `prisma migrate deploy` in CI) |

Run `vercel link` locally once to associate the repo with the Vercel project; it writes `.vercel/` (project + org ids).

## 5. CI/CD

- `.github/workflows/ci.yml` — runs `tsc --noEmit` + `next build` on every PR / push. Blocks merges on failure.
- `.github/workflows/deploy.yml` — on push to `main`: runs `prisma migrate deploy` (applies committed migrations to Vercel Postgres), optionally seeds (`SEED_ON_DEPLOY=true`), then `vercel deploy --prod`.

Migrations are created locally with `pnpm prisma:migrate --name <name>` and committed to `prisma/migrations/`. **Never run `prisma migrate dev` against production** — CI uses `migrate deploy`.

## 6. First production deploy

1. Ensure `prisma/migrations/` is committed (run `pnpm prisma:migrate --name init` locally first).
2. Add all env vars + secrets above.
3. Push to `main`. The deploy workflow applies migrations and deploys.
4. Visit the prod URL → log in with the demo credentials → verify the feed is populated.
