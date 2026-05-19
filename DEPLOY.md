# Milk Dairy - Deployment Guide

## Deploying to Vercel with Supabase PostgreSQL

### 1. Switch Prisma Schema to PostgreSQL
```bash
cp prisma/schema.prisma.pg prisma/schema.prisma
```

### 2. Set Environment Variables in Vercel
- `DATABASE_URL` = `postgresql://postgres:Rahul1234%40.com@db.ehuasvrckhimjcocuicf.supabase.co:5432/postgres`

### 3. Deploy
```bash
vercel --prod
```

### 4. Push Schema to Supabase
After first deploy, run:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 5. Set up Cron Job for Data Cleanup
Use Vercel Cron or an external service to call:
`GET https://your-app.vercel.app/api/cron/cleanup`
This deletes records older than 5 months (configurable in Settings).

## Local Development
The app uses SQLite by default for local development. No additional setup needed.

```bash
bun install
npx prisma db push
npx tsx prisma/seed.ts
bun run dev
```
