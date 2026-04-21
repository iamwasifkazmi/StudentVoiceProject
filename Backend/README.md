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

2. Set `DATABASE_URL` (pooled / PgBouncer) and `DIRECT_URL` (direct Postgres for Prisma migrations). URL-encode special characters in the password (`$`, `%`, `/`, `+`, etc.). Set a strong `JWT_SECRET`.

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
