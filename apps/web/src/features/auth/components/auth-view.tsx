"use client";

import { RiAtLine, RiUserLine } from "@remixicon/react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthDivider } from "@/components/auth-divider";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.85 1.24 1.92 1.24 3.23 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22l-.01 3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .297Z" />
  </svg>
);

export function AuthView() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMagicLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Enter your work email to receive a sign-in link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.magicLink({
        email,
        name: name.trim() || undefined,
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/dashboard`,
        newUserCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/dashboard`,
      });

      if (result?.error) {
        toast.error(result.error.message || "Failed to send sign-in link.");
        return;
      }

      toast.success("Magic link sent. Check your inbox.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send sign-in link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/dashboard`,
        newUserCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/dashboard`,
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to continue with ${provider}.`,
      );
    }
  };

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="font-display font-light text-[32px] text-primary tracking-tight">
          Sign in to the recruiter console.
        </h1>
        <p className="text-[16px] text-black/60 leading-relaxed">
          Use a magic link or continue with Google or GitHub. New users are
          created automatically on first sign-in.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white font-medium text-[#3c4043] text-[14px] shadow-sm transition-colors hover:bg-[#f8f9fa]"
          onClick={() => void handleSocial("google")}
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#24292e] bg-[#24292e] font-medium text-[14px] text-white shadow-sm transition-colors hover:bg-[#2f363d]"
          onClick={() => void handleSocial("github")}
        >
          <GitHubIcon />
          Continue with GitHub
        </button>
      </div>

      <AuthDivider>or get a magic link</AuthDivider>

      <form className="space-y-4" onSubmit={handleMagicLink}>
        <div className="space-y-2">
          <p className="ml-1 font-medium text-[12px] text-black/60">
            Full Name
          </p>
          <InputGroup className="h-11 overflow-hidden rounded-full border border-primary/40 bg-background px-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <InputGroupAddon align="inline-start" className="pl-4">
              <RiUserLine className="h-3.5 w-3.5 text-primary" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="text-[14px] text-black placeholder:text-black/40"
            />
          </InputGroup>
        </div>

        <div className="space-y-2">
          <p className="ml-1 font-medium text-[12px] text-black/60">
            Work Email
          </p>
          <InputGroup className="h-11 overflow-hidden rounded-full border border-primary/40 bg-background px-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)] focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
            <InputGroupAddon align="inline-start" className="pl-4">
              <RiAtLine className="h-3.5 w-3.5 text-primary" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="text-[14px] text-black placeholder:text-black/40"
            />
          </InputGroup>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-primary font-medium text-[14px] text-white shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60"
        >
          {isSubmitting ? "Sending link..." : "Email me a magic link"}
        </button>
      </form>

      <a
        href="/docs"
        className="inline-flex h-9 items-center px-0 text-[13px] text-black/50 transition-colors hover:text-black"
      >
        Open the product docs
      </a>
    </div>
  );
}
