import { auth } from "@ai-hackathon/auth";

interface Request {
  headers: Record<string, string | string[] | undefined>;
}

export async function createContext({ req }: { req?: Request }) {
  const session = req
    ? await auth.api.getSession({
        headers: req.headers as unknown as Headers,
      })
    : null;

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
