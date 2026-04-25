import { headers } from "next/headers";
import { authClient } from "./auth-client";

export async function getSession() {
  try {
    const requestHeaders = await headers();

    const { data: session } = await authClient.getSession({
      fetchOptions: {
        headers: requestHeaders,
      },
    });

    return session;
  } catch {
    return null;
  }
}
