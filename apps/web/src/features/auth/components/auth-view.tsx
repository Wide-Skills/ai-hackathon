"use client";

import React from "react";
import Link from "next/link";
import { AtSignIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { AuthDivider } from "@/components/auth-divider";
import { authClient } from "@/lib/auth-client";

const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669 C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62 c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401 c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
  </svg>
);

const GithubIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const AppleIcon = (props: React.ComponentProps<"svg">) => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M17.057 12.763c.024-1.87 1.004-3.597 2.597-4.576-1.009-1.442-2.64-2.323-4.399-2.378-1.851-.194-3.645 1.107-4.588 1.107-.961 0-2.413-1.088-3.977-1.056-2.062.031-3.934 1.172-4.935 2.971-2.131 3.69-.542 9.114 1.5 12.097 1.022 1.461 2.215 3.092 3.778 3.035 1.529-.063 2.1-.975 3.945-.975 1.828 0 2.364.975 3.958.938 1.64-.027 2.674-1.467 3.66-2.942.734-1.041 1.299-2.191 1.673-3.408-1.688-.702-3.015-2.611-3.012-4.727zm-3.011-8.916c.894-1.074 1.335-2.454 1.228-3.847-1.366.144-2.629.797-3.535 1.829-.895 1.019-1.349 2.351-1.261 3.705 1.364.107 2.679-.471 3.568-1.687z" />
  </svg>
);

export function AuthView() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="font-display text-[32px] font-light tracking-tight text-foreground">
          Sign In or Join Now.
        </h1>
        <p className="text-[16px] text-muted-foreground leading-relaxed">
          Access the next generation of recruitment orchestration.
        </p>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full h-11 rounded-full border-border hover:bg-secondary/50 font-normal"
          onClick={async () => {
            await authClient.signIn.social({
              provider: "google",
              callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            });
          }}
        >
          <GoogleIcon className="h-4 w-4 mr-3" />
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full h-11 rounded-full border-border hover:bg-secondary/50 font-normal">
          <AppleIcon className="h-4 w-4 mr-3" />
          Continue with Apple
        </Button>
        <Button variant="outline" className="w-full h-11 rounded-full border-border hover:bg-secondary/50 font-normal">
          <GithubIcon className="h-4 w-4 mr-3" />
          Continue with GitHub
        </Button>
      </div>

      <AuthDivider>or continue with email</AuthDivider>

      <form className="space-y-4">
        <div className="space-y-2">
          <p className="text-[12px] text-muted-foreground font-medium ml-1">Work Email</p>
          <InputGroup className="h-11 rounded-full border-border bg-background focus-within:ring-info/20 px-1 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <InputGroupAddon align="inline-start" className="pl-4">
              <AtSignIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="name@company.com"
              type="email"
              className="text-[14px]"
            />
          </InputGroup>
        </div>

        <Button className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:scale-[1.01] transition-transform active:scale-[0.98] font-normal">
          Continue
        </Button>
      </form>

      <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[320px]">
        By clicking continue, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-foreground">Terms</Link>
        {" "}and{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-foreground">Privacy Policy</Link>.
      </p>
    </div>
  );
}
