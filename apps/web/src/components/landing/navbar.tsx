import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

interface NavbarProps {
  session?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ session }) => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-[72px] items-center border-border border-b bg-white/90 backdrop-blur-md">
      <div className="container-tight flex items-center justify-between">
        <Link href="/" className="group flex items-center">
          <Image
            src="/favicon/logo.png"
            alt="Umurava Talent"
            width={220}
            height={56}
            priority
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="hidden items-center gap-[28px] md:flex">
          <Link
            href={"/docs" as Route}
            className="font-medium text-[13px] text-black tracking-[0.1px] transition-colors hover:text-primary"
          >
            Docs
          </Link>
          {["Rankings", "Enterprise", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="font-medium text-[13px] text-black tracking-[0.1px] transition-colors hover:text-primary"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {session ? (
            <Link
              href="/dashboard"
              className="font-medium text-[13px] text-black tracking-[0.1px] transition-colors hover:text-primary"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth"
                className="font-medium text-[13px] text-black tracking-[0.1px] transition-colors hover:text-primary"
              >
                Sign in
              </Link>
              <Link href="/auth">
                <button className="h-[36px] rounded-full border border-primary bg-white px-5 text-[13px] text-primary shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/5 active:scale-[0.98]">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
