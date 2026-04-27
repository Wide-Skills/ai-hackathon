import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthView } from "./auth-view";

const {
  signInMagicLinkMock,
  signInSocialMock,
  toastErrorMock,
  toastSuccessMock,
} = vi.hoisted(() => ({
  signInMagicLinkMock: vi.fn(),
  signInSocialMock: vi.fn(),
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      magicLink: signInMagicLinkMock,
      social: signInSocialMock,
    },
  },
}));

describe("AuthView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits a magic link request with the seeded recruiter email", async () => {
    signInMagicLinkMock.mockResolvedValue({});

    render(<AuthView />);

    fireEvent.click(
      screen.getByRole("button", { name: /request magic link/i }),
    );

    await waitFor(() => {
      expect(signInMagicLinkMock).toHaveBeenCalledWith({
        name: "Saddy Nkurunziza",
        email: "saddynkurunziza8@gmail.com",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/dashboard",
      });
    });
  });

  it("starts a Google social sign-in flow", async () => {
    signInSocialMock.mockResolvedValue({});

    render(<AuthView />);

    fireEvent.click(
      screen.getByRole("button", { name: /continue with google/i }),
    );

    await waitFor(() => {
      expect(signInSocialMock).toHaveBeenCalledWith({
        provider: "google",
        callbackURL: "/dashboard",
        newUserCallbackURL: "/dashboard",
      });
    });
  });
});
