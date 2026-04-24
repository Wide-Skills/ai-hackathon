"use client";

import { DEMO_RECRUITER } from "@ai-hackathon/shared";
import { AtSignIcon, SparklesIcon, User2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthDivider } from "@/components/auth-divider";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669 C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62 c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401 c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
  </svg>
);

const GitHubIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 .297a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.85 1.24 1.92 1.24 3.23 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22l-.01 3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .297Z" />
  </svg>
);

export function AuthView() {
  const [email, setEmail] = useState<string>(DEMO_RECRUITER.email);
  const [name, setName] = useState<string>(DEMO_RECRUITER.name);
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
        // callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        // newUserCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
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
        callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
        newUserCallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
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
        <h1 className="font-display font-light text-[32px] text-foreground tracking-tight">
          Sign in to the recruiter console.
        </h1>
        <p className="text-[16px] text-muted-foreground leading-relaxed">
          Use a magic link or continue with Google or GitHub. New users are
          created automatically on first sign-in.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="h-11 w-full rounded-full border-border font-normal hover:bg-secondary/50"
          onClick={() => void handleSocial("google")}
        >
          <GoogleIcon className="mr-3 h-4 w-4" />
          Continue with Google
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full rounded-full border-border font-normal hover:bg-secondary/50"
          onClick={() => void handleSocial("github")}
        >
          <GitHubIcon className="mr-3 h-4 w-4" />
          Continue with GitHub
        </Button>
      </div>

      <AuthDivider>or get a magic link</AuthDivider>

      <form className="space-y-4" onSubmit={handleMagicLink}>
        <div className="space-y-2">
          <p className="ml-1 font-medium text-[12px] text-muted-foreground">
            Full Name
          </p>
          <InputGroup className="h-11 overflow-hidden rounded-full border-border bg-background px-1 shadow-[0_1px_3px_rgba(0,0,0,0.01)] focus-within:ring-info/20">
            <InputGroupAddon align="inline-start" className="pl-4">
              <User2Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="text-[14px]"
            />
          </InputGroup>
        </div>

        <div className="space-y-2">
          <p className="ml-1 font-medium text-[12px] text-muted-foreground">
            Work Email
          </p>
          <InputGroup className="h-11 overflow-hidden rounded-full border-border bg-background px-1 shadow-[0_1px_3px_rgba(0,0,0,0.01)] focus-within:ring-info/20">
            <InputGroupAddon align="inline-start" className="pl-4">
              <AtSignIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="name@company.com"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="text-[14px]"
            />
          </InputGroup>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full bg-primary font-normal text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.98]"
        >
          <SparklesIcon className="mr-2 h-4 w-4" />
          {isSubmitting ? "Sending link..." : "Email me a magic link"}
        </Button>
      </form>

      <a
        href="/docs"
        className="inline-flex h-9 items-center px-0 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        Open the product docs
      </a>
    </div>
  );
}
