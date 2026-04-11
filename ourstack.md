# ai-hackathon

This file provides critical context about the project's architecture and domain for AI assistants.

## Project Overview

**Domain**: AI-Powered Talent Screening Platform created for the Umurava AI Hackathon.
**Goal**: Automate evaluation and shortlisting of job candidates using AI to reduce time-to-hire. Focus heavily on explainability instead of generic matching percentages (giving human-readable strengths, risks, and overall justification).

## Product Workflows

- **Internal Data**: Processes structured JSON candidates straight from a database against a job.
- **External Data**: Intake and normalize unstructured CVs/resume PDFs and spreadsheets.
- **Explainable Ranking**: The platform acts as a screening assistant. The AI pipeline is required to produce structural reasoning representing "Strengths", "Gaps/Risks", and "Final Recommendation" for each applicant, in combination with a final score.

## Tech Stack

- **Ecosystem**: Typescript Strict, Turborepo Monorepo
- **Runtime & PM**: Node, bun

### Frontend (`apps/web`)

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **UI System**: shadcn-ui
- **State Management**: Redux Toolkit (Required)

### Backend (`apps/server`)

- **Framework**: NestJS
- **API**: tRPC (and REST for external ingestion if needed)
- **Validation**: Zod
- **Logging**: Pino

### Database (`packages/db`)

- **Engine**: MongoDB
- **ORM**: Mongoose

### Authentication (`packages/auth`)

- **Provider**: better-auth

### AI & Orchestration (Mandatory)

- **AI SDK**: Vercel AI SDK
- **Core Model**: Gemini API (via `@ai-sdk/google`)

## Project Structure

```
ai-hackathon/
├── apps/
│   ├── web/         # Recruiter Next.js application
│   └── server/      # API, AI pipeline, NextJS backend
├── packages/
│   ├── api/         # tRPC routers
│   ├── auth/        # Auth config
│   ├── db/          # Mongo connections, Mongoose Models
│   ├── env/         # Env validations (Zod)
```

## Common Commands

- `bun install` - Install dependencies
- `bun dev` - Start development server (both web and API)
- `bun test` - Run Vitest suites
- `bun check` - Run Biome formatter/linter

## AI Assistant Instructions

Keep this file and `README.md` updated if core libraries, architectural choices, or major domains change! ALWAYS prefer Vercel AI SDK + Google/Gemini providers for AI code generations. Ensure the `web` uses Redux Toolkit for state.
