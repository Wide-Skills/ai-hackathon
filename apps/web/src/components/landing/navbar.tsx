import type { Route } from "next";
import Link from "next/link";
import type React from "react";
import { Button } from "../ui/button";

interface NavbarProps {
  session?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ session }) => {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-[52px] items-center border-line border-b bg-background/92 backdrop-blur-md">
      <div className="container-meridian flex w-full items-center justify-between">
        <Link href="/" className="group flex items-center gap-[6px]">
          <div className="size-[16px] rounded-micro bg-primary" />
          <span className="font-medium font-sans text-[15px] text-primary tracking-[-0.3px]">
            Umurava AI
          </span>
        </Link>

        <div className="hidden items-center gap-comfortable md:flex">
          {[
            { label: "Capabilities", href: "#features" },
            { label: "Process", href: "#process" },
            { label: "Scale", href: "#scale" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href as Route}
              className="font-normal font-sans text-[13px] text-ink-muted transition-colors hover:text-ink-full"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={"/docs" as Route}
            className="font-normal font-sans text-[13px] text-ink-muted transition-colors hover:text-ink-full"
          >
            Docs
          </Link>
        </div>

        <div className="flex items-center gap-comfortable">
          {session ? (
            <Link
              href={"/dashboard" as Route}
              className="font-normal font-sans text-[13px] text-ink-muted transition-colors hover:text-ink-full"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={"/auth" as Route}
                className="font-normal font-sans text-[13px] text-ink-muted transition-colors hover:text-ink-full"
              >
                Sign in
              </Link>
              <Button
                variant="default"
                size="default"
                render={<Link href={"/auth" as Route} />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
