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

## AI & Data Integration
- [x] Bound `@ai-sdk/google` with `gemini-2.0-flash` for structured screening results.
- [x] Integrated client-side PDF parsing using `pdf.js` for the public applicant view.
- [x] Fixed server-side `pdf-parse` implementation for candidate ingest.
- [x] Resolved workspace-wide TypeScript errors in UI components and API tests.
