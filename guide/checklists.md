# Development Checklists

To standardize our rapid delivery during the hackathon, please use these standard operating procedures (SOPs).

## Feature Delivery Walkthrough
Whenever building a new feature (e.g., adding an 'Interviews' tab), follow this flow:

1. [ ] **Database**: Define or expand Mongoose models in `packages/db/src/models/`.
2. [ ] **API Validation**: Outline Zod input schemas for the new endpoints.
3. [ ] **API Router**: Wire up the logic in `packages/api/src/routers/` and bind to `appRouter`.
4. [ ] **Redux (If UI demands)**: Create a new slice in `apps/web/src/store/slices/` if you have complex user states like active tabs.
5. [ ] **Frontend Scaffold**: Build React components inside `apps/web/src/features/[feature]/components/`.
6. [ ] **Tests**: (Optional but encouraged) Prove your logic in a `*.test.ts` file.

## Pre-Pull Request Checklist

Before merging into main, ensure the following is green:

1. [ ] Code follows existing Biome formatting.
2. [ ] `npm run check-types` executes successfully (No TS Errors anywhere in the monorepo).
3. [ ] UI state utilizes Redux Toolkit appropriately.
4. [ ] AI interactions leverage `@ai-sdk/google` properly.

*Note: Husky will legally block your commit if Biome or TS validations fail.*
