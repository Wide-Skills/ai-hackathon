import { RiArrowLeftSLine } from "@remixicon/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";
import { Button } from "@/components/ui/button";
import {
  AuthContentWrapper,
  AuthVisuals,
} from "@/features/auth/components/auth-visuals";
import { getSession } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen bg-background selection:bg-secondary selection:text-foreground lg:grid lg:grid-cols-[440px_1fr]">
      <AuthVisuals />

      {/* Main Form Content */}
      <div className="relative flex min-h-screen flex-col justify-center bg-[#fafafa]/30 px-8 lg:px-24 xl:px-32">
        <Button
          render={<Link href="/" />}
          className="absolute top-8 left-8 h-9 px-4 font-normal text-[13px] hover:bg-background/80"
          variant="ghost"
        >
          <RiArrowLeftSLine className="mr-2 h-3.5 w-3.5" />
          Back to Home
        </Button>

        <div className="mx-auto w-full max-w-[400px]">
          <AuthContentWrapper>{children}</AuthContentWrapper>
        </div>
      </div>
    </main>
  );
}
