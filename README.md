# AI-Powered Talent Screening Platform

A next-generation recruitment ecosystem built for the Umurava AI Hackathon. Our platform leverages deep semantic analysis to bridge the gap between massive talent pools and precise organizational needs.

[**View the Product Pitch & Platform Docs**](http://localhost:3001/docs)

## Stack

- Frontend: Next.js, React, React Query, Redux, Tailwind CSS, shadcn/ui
- Backend: NestJS host app + shared tRPC router
- Database: MongoDB + Mongoose
- Auth: better-auth
- AI layer: Gemini via Vercel AI SDK

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

- `apps/server/.env`
- `apps/web/.env`

At minimum, set:

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_SERVER_URL`
- `NEXT_PUBLIC_BASE_URL`
- `GEMINI_API_KEY`

3. Seed the database:

```bash
pnpm seed
```

4. Start the app:

```bash
pnpm dev
```

Frontend: `http://localhost:3001`
Backend: `http://localhost:3000`
Product Pitch & Strategy: `http://localhost:3001/docs`

## Seeded Recruiter Login

After running `pnpm seed`, use:

- Email: `saddynkurunziza8@gmail.com`
- Auth: magic link, Google, or GitHub

The sign-in page is available at `http://localhost:3001/auth`.

## Commands

```bash
pnpm dev
pnpm build
pnpm check-types
pnpm test
pnpm test:api
pnpm test:web
pnpm seed
```

## Product Flow

1. Sign in with the seeded recruiter account.
2. Open the dashboard to review seeded jobs, applicants, analytics, and screening results.
3. Create a new job from the jobs page.
4. Upload candidates from CSV on the applicants page.
5. Run screening from the screening page.
6. Review rankings, applicant details, and job metrics.

## Testing

This repo uses Vitest for both the backend and frontend.

- Backend tests live in `packages/api/tests`
- Frontend tests live under `apps/web/src/**/*.test.tsx`

Run everything:

```bash
pnpm test
```

Run individual parts:

```bash
pnpm test:api
pnpm test:web
```

## Project Structure

```text
apps/
  server/  NestJS host app
  web/     Next.js recruiter dashboard
packages/
  api/     Shared tRPC router
  auth/    better-auth config
  db/      Mongoose models and seed script
  env/     Environment validation
  shared/  Shared schemas and demo credentials
```
