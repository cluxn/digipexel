/**
 * Tests for WhatsAppButton component (HOME-10)
 * Spec: fetches /api/settings.php?key=whatsapp_number
 *       hidden when value is empty or API fails
 *       visible and links to wa.me/{digits} when number is set
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

  it("renders nothing when API returns empty number", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: { key: "whatsapp_number", value: "" } });
    const { container } = render(<WhatsAppButton />);
    await waitFor(() => expect(safeFetch).toHaveBeenCalled());
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when API fails", async () => {
    safeFetch.mockResolvedValue({ status: "error" });
    const { container } = render(<WhatsAppButton />);
    await waitFor(() => expect(safeFetch).toHaveBeenCalled());
    expect(container.firstChild).toBeNull();
  });

  it("renders a link to wa.me when number is set", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: { key: "whatsapp_number", value: "+91-9876543210" } });
    render(<WhatsAppButton />);
    await waitFor(() => screen.getByRole("link", { name: /whatsapp/i }));
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("href", "https://wa.me/919876543210");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("strips non-digit characters from the number", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: { key: "whatsapp_number", value: "+1 (555) 123-4567" } });
    render(<WhatsAppButton />);
    await waitFor(() => screen.getByRole("link", { name: /whatsapp/i }));
    const link = screen.getByRole("link", { name: /whatsapp/i });
    expect(link).toHaveAttribute("href", "https://wa.me/15551234567");
  });
});
