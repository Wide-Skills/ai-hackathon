import { RiArrowLeftSLine } from "@remixicon/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";
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
      <div className="relative flex min-h-screen flex-col justify-center bg-white px-8 lg:px-24 xl:px-32">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center gap-1.5 rounded-full border border-primary/30 bg-white px-4 py-2 text-[13px] font-medium text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary/5"
        >
          <RiArrowLeftSLine className="h-3.5 w-3.5" />
          Back to Home
        </Link>

        <div className="mx-auto w-full max-w-[400px]">
          <AuthContentWrapper>{children}</AuthContentWrapper>
        </div>
      </div>
    </main>
  );
}
