import type { Metadata } from "next";

import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { cn } from "@/lib/utils";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Umurava AI | High-Fidelity Talent Screening",
  description:
    "The world's first recruitment platform that justifies its choices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        instrumentSerif.variable,
        geistSans.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-screen font-sans">
        <Providers>
          <div className="relative flex h-svh flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
