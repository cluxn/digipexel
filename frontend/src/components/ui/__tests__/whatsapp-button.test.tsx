/**
 * Tests for WhatsAppButton component (HOME-10 / SET-04)
 * Spec: fetches full settings from /api/settings.php
 *       hidden when whatsapp_enabled is "false"
 *       visible and links to wa.me/{digits} when enabled and number set
 *       falls back to default number when API fails (stays visible)
 */
import { render, screen, waitFor } from "@testing-library/react";
import { WhatsAppButton } from "../whatsapp-button";

// Mock safeFetch
jest.mock("@/lib/utils", () => ({
  safeFetch: jest.fn(),
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

const { safeFetch } = require("@/lib/utils");

describe("WhatsAppButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when whatsapp_enabled is false", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: { whatsapp_enabled: "false", whatsapp_number: "911234567890" } });
    const { container } = render(<WhatsAppButton />);
    // Wait for the state update that hides the button
    await waitFor(() => expect(container.firstChild).toBeNull());
  });

  it("renders button with fallback number when API fails", async () => {
    safeFetch.mockResolvedValue({ status: "error" });
    render(<WhatsAppButton />);
    await waitFor(() => expect(safeFetch).toHaveBeenCalled());
    expect(screen.getByRole("link", { name: /whatsapp/i })).toBeInTheDocument();
  });

  it("renders a link to wa.me when number is set", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: { whatsapp_enabled: "true", whatsapp_number: "+91-9876543210" } });
    render(<WhatsAppButton />);
    // Wait for the state update with the fetched number (not the default fallback)
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute("href", "https://wa.me/919876543210")
    );
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute("target", "_blank");
  });

  it("strips non-digit characters from the number", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: { whatsapp_enabled: "true", whatsapp_number: "+1 (555) 123-4567" } });
    render(<WhatsAppButton />);
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute("href", "https://wa.me/15551234567")
    );
  });
});
