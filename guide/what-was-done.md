# What Was Done (Changelog)

## Core Architecture Setup
**April Hackathon Kickoff Phase**
- [x] Scaffolded the Next.js and NestJS monorepo utilizing Turborepo.
- [x] Defined all domain constraints in `README.md` and `ourstack.md`.
- [x] Updated Zod validations (`@ai-hackathon/env`) to strictly enforce `GEMINI_API_KEY`.
- [x] Successfully linked MongoDB database utilizing Mongoose.

## Tooling & Quality Control
- [x] Initialized Redux Toolkit to act as standard global client-state holder mapping `jobs` and `applicants` interactions.
- [x] Set up Husky Git hooks enforcing Biome checking and TS types prior to staging commits to drastically minimize errors.
- [x] Created `features/` directory map on the frontend to decouple dumb generic components from smart business-logic pieces.

## Data Layer Definition
- [x] Finished Mongoose schema implementation (`Job`, `Applicant`, `ScreeningResult`). Note: `Job` requires `department`, `Applicant` anticipates `resumeUrl`.
- [x] Added generic tRPC test logic using Vitest inside `packages/api`.
