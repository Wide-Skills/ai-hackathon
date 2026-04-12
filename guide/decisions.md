# Architecture & Decision Log (ADL)

This file tracks the core technical choices we made for the AI-Powered Talent Screening Platform and *why* we made them.

## 1. Application Framework & Monorepo
**Decision**: Use Turborepo with Next.js (Frontend) and NestJS (Backend).
**Why**: Turborepo allows us to seamlessly share `packages` like DTOs, Zod validations (`@ai-hackathon/env`), and MongoDB schemas between the frontend and backend without duplicating code.

## 2. API Schema
**Decision**: Use tRPC & Zod for internal calls.
**Why**: Given our strictly typed TypeScript ecosystem, tRPC eliminates the need for manual API swagger documentation and prevents a whole class of runtime type mismatch errors.

## 3. Database
**Decision**: MongoDB using Mongoose.
**Why**: Since applicant parsed data (resumes) might arrive in wildly different JSON structures before normalization, a NoSQL structure allows us to store arbitrary metadata freely without migrating relational schemas constantly.

## 4. Frontend State
**Decision**: Redux Toolkit + React Query.
**Why**: React Query (via tRPC) handles server-state caching perfectly. However, the recruiter UI will be extremely filter-heavy (sorting ranking scores, managing shortlists, comparing items). Redux serves as a highly robust, predictable engine for resolving these complex client states.

## 5. AI Orchestration
**Decision**: Gemini API over Vercel AI SDK (`@ai-sdk/google`).
**Why**: Google's Gemini models offer industry-leading context windows, allowing recruiters to upload incredibly dense PDFs or thousands of structured rows and evaluate them instantly. The Vercel AI SDK provides the cleanest streaming API mapping for Next.js.
