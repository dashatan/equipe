# Deploy to Vercel — zero → 100%

This project deploys via **direct Vercel git integration**: push to `main` → Vercel auto-builds.
The database is **Neon Postgres** provisioned through the Vercel Storage marketplace, shared by local dev and production.

## One-time setup (already done for this project)

1. **Vercel CLI + auth**
   ```powershell
   npm i -g vercel
   vercel login
   vercel link --yes --project equipe
   ```
2. **Create the Postgres store** — Vercel dashboard → `equipe` project → **Storage** → **Create Database** → **Neon Postgres** (name `equipe-db`, region `iad1`). Then **Connect to project** → select `equipe`. This auto-injects env vars (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `POSTGRES_*`, etc.).
3. **Pull envs locally**:
   ```powershell
   vercel env pull .env.vercel --environment development
   ```
   Copy the pooled `DATABASE_URL` and the non-pooled `DATABASE_URL_UNPOOLED` into your local `.env` as `DATABASE_URL` and `DIRECT_URL` respectively.

## Local environment (`.env`, never committed)

```
DATABASE_URL=<pooled Neon string>
DIRECT_URL=<non-pooled Neon string>
AUTH_SECRET=<openssl rand -base64 32>
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Migrate + seed the shared DB (once)

```powershell
pnpm prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0001_init/migration.sql
pnpm prisma migrate deploy   # applies schema to the shared Neon DB
pnpm prisma db seed          # seeds demo@test.com / demo + demo content
```
Because local + prod share one DB, seeding here also populates production.

## Vercel project env vars

Neon already injected `DATABASE_URL` + `DATABASE_URL_UNPOOLED` for all environments when you connected it. Add `AUTH_SECRET` for production + preview:
```powershell
"<AUTH_SECRET>" | vercel env add AUTH_SECRET production
"<AUTH_SECRET>" | vercel env add AUTH_SECRET preview
vercel env ls
```
Do **NOT** set `AUTH_URL` on Vercel — Auth.js v5 auto-derives it from `VERCEL_URL`.

## Connect GitHub + deploy

```powershell
vercel git connect https://github.com/dashatan/equipe.git
git checkout main
git merge dev
git push origin main
```
Vercel auto-builds from `main`. The build command is:
```
prisma generate && prisma migrate deploy && next build
```
(`migrate deploy` is a no-op after the initial migration.)

## Verify production
- Watch the build in the Vercel dashboard (or `vercel inspect <url>`).
- Open the prod URL → log in `demo@test.com` / `demo` → feed populated → click through groups/profile/admin.

## Notes / out of scope
- Google/GitHub OAuth not configured (no client creds) — demo login is credentials-based.
- No GitHub Actions deploy workflow — vercel-git handles it. `.github/workflows/ci.yml` only runs type-check + build on PRs.
- Never run `prisma migrate dev` against the shared prod DB (shadow-DB issues); the diff-based migration avoids it.
