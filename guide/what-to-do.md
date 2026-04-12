# What To Do (Immediate Roadmap)

Currently, the scaffolding phases (DB, API, Store) are completed. The immediate next action items to convert this into a working prototype are:

1. **AI Prompt Orchestration**
   - Bind the `@ai-sdk/google` library to the `screeningRouter.generate` endpoint.
   - We need to craft a precise, deterministic system prompt using `zod` schema outputs (using `generateObject`) to ensure Gemini returns structured JSON mapping exactly to the `ScreeningResult` MongoDB model.

2. **Frontend Wiring**
   - Create the Dashboard shell connecting to Redux Layout.
   - Build a `JobModal` to create jobs.
   - Bind tRPC queries (`api.jobs.list.useQuery`) to display active jobs.

3. **External Ingest Pipeline**
   - We need a solution to extract text from a physical PDF resume via an edge function or API route, passing that raw text directly into the AI Applicant evaluator.
