import { DEMO_RECRUITER } from "@ai-hackathon/shared";
import Link from "next/link";

const steps = [
  "Seed the database to create demo recruiters, jobs, applicants, and screening results.",
  "Sign in with the seeded recruiter account to access the dashboard.",
  "Review jobs, applicants, analytics, and screening pages backed by tRPC queries.",
  "Create a job, upload applicants, and run screening to update job counters and applicant statuses.",
] as const;

const commands = [
  "pnpm install",
  "pnpm seed",
  "pnpm dev",
  "pnpm test",
] as const;

const stack = [
  "Frontend: Next.js, React Query, Redux, Tailwind CSS, shadcn/ui",
  "Backend: NestJS host app exposing the shared tRPC router",
  "Database: MongoDB with Mongoose models for auth, jobs, applicants, and screening results",
  "Auth: better-auth with magic link sign-in plus Google and GitHub",
] as const;

export function PlatformDocs() {
  return (
    <main className="min-h-screen bg-background px-6 py-20 text-foreground md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <section className="rounded-[32px] border border-border/60 bg-secondary/20 p-8 md:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground/60">
            Platform Docs
          </p>
          <h1 className="mt-4 font-display text-[40px] font-light tracking-tight md:text-[56px]">
            How the talent screening platform works
          </h1>
          <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-muted-foreground">
            This single page covers local setup, seeded login credentials, the
            product flow, and the commands used to verify the frontend and
            backend together.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/auth"
              className="btn-pill-primary h-11 px-6 text-[12px] uppercase tracking-[0.18em]"
            >
              Open Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex h-11 items-center rounded-full border border-border px-6 text-[12px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Open Dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[28px] border border-border/50 bg-background p-8 shadow-ethereal">
            <h2 className="font-display text-[24px] font-light tracking-tight">
              Demo Login
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Use this seeded recruiter email after running `pnpm seed`.
            </p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                  Email
                </dt>
                <dd className="mt-1 text-[15px]">{DEMO_RECRUITER.email}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                  Auth Method
                </dt>
                <dd className="mt-1 text-[15px]">Magic link, Google, or GitHub</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-[28px] border border-border/50 bg-background p-8 shadow-ethereal">
            <h2 className="font-display text-[24px] font-light tracking-tight">
              Core Stack
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="rounded-[28px] border border-border/50 bg-background p-8 shadow-ethereal">
          <h2 className="font-display text-[24px] font-light tracking-tight">
            Local Workflow
          </h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-2">
            {steps.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-border/40 bg-secondary/10 p-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                  Step {index + 1}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[28px] border border-border/50 bg-background p-8 shadow-ethereal">
          <h2 className="font-display text-[24px] font-light tracking-tight">
            Commands
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {commands.map((command) => (
              <code
                key={command}
                className="rounded-2xl border border-border/40 bg-secondary/10 px-4 py-4 text-sm"
              >
                {command}
              </code>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
