# Umurava AI: Next-Gen Talent Screening Platform

![Umurava AI Banner](https://umurava.africa/wp-content/uploads/2023/07/Umurava-Logo-01.png)

A sophisticated recruitment ecosystem built for the **Umurava AI Hackathon**. Our platform leverages deep semantic analysis and generative AI to bridge the gap between massive talent pools and precise organizational requirements.

## 🚀 Key Features

- **AI-Driven Screening**: Automated resume analysis using Gemini 2.5 Flash for high-fidelity candidate matching.
- **Strategic Pipeline**: Visual candidate ranking with "Strongly Recommended", "Recommend", and "Consider" tiers.
- **Smart Ingestion**: Bulk candidate processing via CSV/PDF with client-side text extraction.
- **Intelligence Dashboard**: Comprehensive metrics for recruiters, including match scores, skills gap analysis, and screening logs.
- **Unified Auth**: Secure sign-in via Magic Links, Google, and GitHub powered by `better-auth`.
- **Studio Aesthetic**: A refined, minimal "Studio" design language implemented with Tailwind CSS and shadcn/ui.

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS, shadcn/ui, Redux Toolkit, Framer Motion |
| **Backend** | NestJS, tRPC (Shared Router), Hono (Lightweight Server Wrapper), BullMQ (Background Workers) |
| **Database** | MongoDB Atlas, Upstash Redis (Queue & Caching) |
| **Authentication** | Better-Auth with MongoDB Adapter |
| **AI/ML** | Google Gemini (via Vercel AI SDK) |
| **Messaging** | Brevo (Nodemailer SMTP Integration) |
| **DevOps** | Docker, Turborepo, Biome (Linting/Formatting) |

## 🏗 Project Structure

```text
├── apps/
│   ├── server/       # NestJS/Hono entry point & background workers
│   └── web/          # Next.js recruiter dashboard & public apply page
├── packages/
│   ├── api/          # Core tRPC router & business logic
│   ├── auth/         # better-auth configuration & audit logging
│   ├── db/           # Mongoose models, schemas, and seeding engine
│   ├── env/          # Type-safe environment variable validation (Zod)
│   ├── queue/        # BullMQ queue definitions & Redis connection
│   └── shared/       # Common types, constants, and demo credentials
```

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (optional, for local container testing)

### 1. Installation
```bash
pnpm install
```

### 2. Environment Configuration
Create `.env` files in `apps/server/` and `apps/web/` using the provided `.env.example` templates.

**Critical Keys:**
- `DATABASE_URL`: MongoDB connection string.
- `UPSTASH_REDIS_REST_URL` & `TOKEN`: For background job processing.
- `BETTER_AUTH_URL`: Backend URL (e.g., `http://localhost:3000/api/auth`).
- `CORS_ORIGIN`: Frontend URL (e.g., `http://localhost:3001`).
- `GEMINI_API_KEY`: For AI screening features.

### 3. Database Seeding
Initialize your local environment with high-fidelity mock data:
```bash
pnpm seed
```

### 4. Development
Start both frontend and backend concurrently:
```bash
pnpm dev
```

- **Frontend**: `http://localhost:3001`
- **Backend API**: `http://localhost:3000`
- **Docs/Pitch**: `http://localhost:3001/docs`

## 🔑 Demo Access

**Seeded Recruiter Account:**
- **Email**: `saddynkurunziza8@gmail.com`
- **Access**: Magic Link (sent via Brevo/SMTP) or Social Login.

## 🧪 Quality Control

We maintain high standards through comprehensive testing and linting:

- **All Tests**: `pnpm test`
- **Type Check**: `pnpm check-types`
- **Lint & Format**: `pnpm check`

---

Built with ❤️ by Saddy Nkurunziza for the Umurava AI Hackathon.
