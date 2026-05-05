import { env } from "@ai-hackathon/env/web";
import { magicLinkClient } from "better-auth/client/plugins";
import { oAuthProxy } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  fetchOptions: {
    credentials: "include",
  },
  plugins: [magicLinkClient(), oAuthProxy()],
});
