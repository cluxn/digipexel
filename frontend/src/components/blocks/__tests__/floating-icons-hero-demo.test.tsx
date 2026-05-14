/**
 * Tests for FloatingIconsHeroDemo component (HOME-01)
 * Spec: fetches from /api/site_content.php?section=hero on mount
 *       renders API heading when fetch succeeds
 *       falls back to hardcoded "Automate" heading when API fails
 */
import { render, screen, waitFor } from "@testing-library/react";
import FloatingIconsHeroDemo from "../floating-icons-hero-demo";

jest.mock("@/lib/utils", () => ({
  safeFetch: jest.fn(),
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => children,
  useReducedMotion: () => true,
}));

// Mock complex UI sub-components that depend on context/animations
jest.mock("@/components/ui/floating-icons-hero-section", () => ({
  FloatingIconsHero: ({ title, titleHighlight, subtitle }: any) => (
    <div data-testid="hero">
      <span>{title}</span>
      <span>{titleHighlight}</span>
      <p>{subtitle}</p>
    </div>
  ),
}));

jest.mock("@/components/ui/navbar-menu", () => ({
  Menu: ({ children }: any) => <nav>{children}</nav>,
  MenuItem: ({ children, item }: any) => <div>{item}{children}</div>,
  ServiceMenu: () => <div>ServiceMenu</div>,
  WorkMenu: () => <div>WorkMenu</div>,
  InsightsMenu: () => <div>InsightsMenu</div>,
}));

jest.mock("next/link", () => {
  const Link = ({ children, href }: any) => <a href={href}>{children}</a>;
  Link.displayName = "Link";
  return Link;
});

const { safeFetch } = require("@/lib/utils");

describe("FloatingIconsHeroDemo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders API heading when fetch succeeds", async () => {
    safeFetch.mockResolvedValue({
      status: "success",
      data: {
        heading: "Scale Fast",
        titleHighlight: "with AI workflows",
        subtitle: "Custom subtitle from admin",
        ctaText: "Get Started",
        ctaHref: "/contact-us",
        iconSlots: [{ slot: 1, icon: "openai", label: "OpenAI" }],
      },
    });
    render(<FloatingIconsHeroDemo />);
    await waitFor(() => screen.getByText("Scale Fast"));
    expect(screen.getByText("Scale Fast")).toBeInTheDocument();
  });

  it("renders fallback heading 'Automate' when API fails", async () => {
    safeFetch.mockResolvedValue({ status: "error" });
    render(<FloatingIconsHeroDemo />);
    await waitFor(() => screen.getByText("Automate"));
    expect(screen.getByText("Automate")).toBeInTheDocument();
  });
});
