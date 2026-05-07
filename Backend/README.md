# Student Voice API

Node.js 20+ **Express** REST API with **Prisma** ORM and **PostgreSQL** (e.g. Supabase). Matches the Student Voice development specification (auth, modules, feedback, impact, notifications, dashboard stats).

## Prerequisites

- Node.js 20+
- A PostgreSQL database (Supabase: Project Settings → Database → Connection string, use port `5432` and `?sslmode=require`)

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Set `DATABASE_URL` and `DIRECT_URL` from the Supabase dashboard (**Settings → Database**):
   - **`DATABASE_URL`**: **Transaction pooler**, port **6543**, user typically `postgres.[project-ref]`, and add **`?pgbouncer=true`**. This is what the running API uses.
   - **`DIRECT_URL`**: **Direct connection** only — host **`db.[project-ref].supabase.co`**, port **5432**, user **`postgres`**. Do **not** point `DIRECT_URL` at `*.pooler.supabase.com`; Prisma migrations need the direct host.
   - URL-encode special characters in the password (`$`, `%`, `/`, `+`, etc.). Set a strong `JWT_SECRET`.
   - If you see **`tenant/user ... not found`** or **Can't reach database server**, recheck both strings against the dashboard, confirm the project isn’t paused, and that the pooler **region** in the hostname matches your project (e.g. `aws-0-eu-west-2`).

3. Install dependencies and apply the schema:

   ```bash
   npm install
   ```

4. Create tables (pick one):

   - **Migrations (recommended for production):**

     ```bash
     npx prisma migrate dev --name init
     ```

   - **Quick sync (dev only):**

     ```bash
     npx prisma db push
     ```

5. Seed modules, impact entries, and the demo user:

   ```bash
   npm run db:seed
   ```

   Demo account: `student@chester.ac.uk` / `Password123` (student ID `2430001`).

## Run locally

```bash
npm run dev
```

API base URL: `http://localhost:3000/api`  
Health check: `GET http://localhost:3000/health`

## Deploy on Vercel (Node / serverless)

This folder is set up for a **Vercel** deployment: `api/index.ts` exports the Express app, and `vercel.json` rewrites all routes to that function.

1. In [Vercel](https://vercel.com) → **Add New…** → **Project** → import this Git repository.
2. **Root Directory**: set to **`Backend`** (required if the repo also contains the mobile app).
3. **Framework Preset**: **Other** (or leave default; build is driven by `vercel.json`).
4. **Environment Variables** (Production — same values as `.env`):
   - `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`
   - Optional: `CORS_ORIGIN` (comma-separated origins, or omit for permissive CORS in dev)
5. Deploy. Prisma Client is generated during **`prisma generate`** (`postinstall` / `buildCommand`).
6. **Migrations**: run against production from your machine or CI (Vercel builds do not migrate by default):

   ```bash
   DATABASE_URL="…" DIRECT_URL="…" npx prisma migrate deploy
   ```

   Or use **Supabase SQL Editor** / `db push` once if you are not using migration history yet.

7. Point the mobile app at **`https://<your-project>.vercel.app`** (same paths as local: `/api/...`, `/health`).

Install the Vercel CLI for previews: `npm i -g vercel`, then from `Backend/` run `vercel`.

## Response format

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": "message" }` with appropriate HTTP status (400, 401, 404, 500).

Authenticated routes expect: `Authorization: Bearer <access_token>`.

## Main endpoints

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public (body: `refreshToken`) |
| POST | `/api/auth/forgot-password` | Public (stub — no email sent) |
| GET | `/api/user/profile` | Yes |
| PUT | `/api/user/profile` | Yes |
| GET | `/api/modules` | Yes |
| GET | `/api/modules/:id` | Yes |
| GET | `/api/feedback` | Yes (query: `status`, `moduleId`, `sort`, `page`, `limit`) |
| GET | `/api/feedback/:id` | Yes |
| POST | `/api/feedback` | Yes (body: `moduleId`, `rating`, `comment?`) |
| DELETE | `/api/feedback/:id` | Yes (undo within 15s of creation) |
| GET | `/api/impact` | Yes (query: `search`, `moduleId`) |
| GET | `/api/notifications` | Yes |
| PUT | `/api/notifications/:id/read` | Yes |
| GET | `/api/stats/dashboard` | Yes |

## Deploy (Railway / Render)

- Set `DATABASE_URL`, `JWT_SECRET`, and `PORT`.
- Build: `npm run build`
- Start: `npm run start`
- Run migrations: `npx prisma migrate deploy` (or `db push` only for early prototypes).

## Project layout

- `src/routes/` — route registration
- `src/controllers/` — HTTP handlers
- `src/middleware/` — JWT auth, validation
- `src/utils/` — JWT, passwords, token hashing
- `prisma/schema.prisma` — data model
- `prisma/seed.ts` — seed data
