import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlatformDocs } from "./platform-docs";

describe("PlatformDocs", () => {
  it("shows the seeded recruiter credentials and core commands", () => {
    render(<PlatformDocs />);

    expect(
      screen.getByRole("heading", {
        name: /how the talent screening platform works/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("saddynkurunziza8@gmail.com")).toBeInTheDocument();
    expect(
      screen.getByText(/magic link, google, or github/i),
    ).toBeInTheDocument();
    expect(screen.getByText("pnpm seed")).toBeInTheDocument();
    expect(screen.getByText("pnpm test")).toBeInTheDocument();
  });
});
