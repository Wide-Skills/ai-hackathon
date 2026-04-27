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
    <main className="relative min-h-screen bg-canvas selection:bg-primary-alpha selection:text-primary lg:grid lg:grid-cols-[440px_1fr]">
      <AuthVisuals />

      {/* main form content */}
      <div className="relative flex min-h-screen flex-col justify-center bg-bg px-6 sm:px-8 lg:px-24 xl:px-32">
        <Link
          href="/"
          className="group absolute top-8 left-6 flex items-center gap-base font-medium font-sans text-[13px] text-ink-muted transition-colors hover:text-ink-full sm:top-10 sm:left-10"
        >
          <RiArrowLeftSLine className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>

        <div className="mx-auto w-full max-w-[400px]">
          <AuthContentWrapper>{children}</AuthContentWrapper>
        </div>
      </div>
    </main>
  );
}
