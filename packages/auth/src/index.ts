import { client, mongoClient } from "@ai-hackathon/db";
import { env } from "@ai-hackathon/env/server";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { magicLink } from "better-auth/plugins";
import { writeAuditLog } from "./audit";
import { sendMagicLinkEmail, sendWelcomeEmail } from "./email";

export const auth = betterAuth({
database: mongodbAdapter(client, {
  client: mongoClient,
}),
  experimental: {
    joins: true,
  },
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.CORS_ORIGIN, env.BETTER_AUTH_URL],
  emailAndPassword: {
    enabled: false,
  },
  advanced: {
  database: {
    generateId: () => crypto.randomUUID(),
  },
},
  socialProviders: {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  },
  plugins: [
    magicLink({
      sendMagicLink: async (data, ctx) => {
        await sendMagicLinkEmail({
          email: data.email,
          url: data.url,
          requestId: ctx?.headers?.get("x-request-id") ?? undefined,
        });
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        async after(user, context) {
          try {
            await writeAuditLog({
              level: "info",
              action: "auth.user.create",
              source: "auth",
              status: "success",
              message: "User account created",
              actorUserId: user.id,
              actorEmail: user.email,
              requestId: context?.headers?.get("x-request-id") ?? undefined,
            });
          } catch (error) {
            console.error("Failed to write audit log for user creation", error);
          }

          try {
            await sendWelcomeEmail({
              email: user.email,
              name: user.name,
              requestId: context?.headers?.get("x-request-id") ?? undefined,
            });
          } catch (error) {
            console.error("Failed to send welcome email", error);
          }
        },
      },
    },
    session: {
      create: {
        async after(session, context) {
          try {
            await writeAuditLog({
              level: "info",
              action: "auth.session.create",
              source: "auth",
              status: "success",
              message: "User signed in",
              actorUserId: session.userId,
              requestId: context?.headers?.get("x-request-id") ?? undefined,
              ipAddress:
                context?.headers?.get("x-forwarded-for") ??
                context?.headers?.get("x-real-ip") ??
                undefined,
              userAgent: context?.headers?.get("user-agent") ?? undefined,
              metadata: {
                path: context?.path,
              },
            });
          } catch (error) {
            console.error(
              "Failed to write audit log for session creation",
              error,
            );
          }
        },
      },
    },
  },
});
