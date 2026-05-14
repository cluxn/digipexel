/**
 * Tests for Footer newsletter form (HOME-09)
 * Spec: email input + subscribe button POSTs to /api/newsletter.php
 *       shows "You're in!" on success
 *       shows "Already subscribed" on duplicate
 */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Footer } from "../footer-section";

jest.mock("@/lib/utils", () => ({
  safeFetch: jest.fn(),
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

// framer-motion mock to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useReducedMotion: () => true,
}));

const { safeFetch } = require("@/lib/utils");

describe("Footer newsletter form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders an email input and Subscribe button", () => {
    render(<Footer />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();
  });

  it("shows success message after subscribing with new email", async () => {
    safeFetch.mockResolvedValue({ status: "success" });
    render(<Footer />);
    const input = screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => screen.getByText(/you're in/i));
  });

  it("shows already-subscribed message on duplicate", async () => {
    safeFetch.mockResolvedValue({ status: "error", message: "Already subscribed with this email" });
    render(<Footer />);
    const input = screen.getByPlaceholderText(/email/i);
    fireEvent.change(input, { target: { value: "existing@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => screen.getByText(/already subscribed/i));
  });
});
