# Tasks

This serves as our tactical backlog logic:

- [x] Connect `better-auth` fully restricting Next.js pages if `!session`.
- [x] Connect `generateText` with `Output.object` from Vercel AI SDK to Gemini `gemini-2.0-flash` logic inside `packages/api/src/routers/screening.router.ts`.
- [x] Implement PDF to Text parser logic (using client-side `pdf.js` for public view and `pdf-parse` for server-side ingest).
- [x] Build UI: Applicant Rankings list showing `matchScore` sorting.
- [x] Setup shadcn/ui Data Table for applicants.
