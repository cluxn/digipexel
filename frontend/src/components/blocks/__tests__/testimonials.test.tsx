/**
 * Tests for Testimonials component (HOME-08)
 * Spec: fetches from /api/testimonials.php on mount
 *       renders first 9 testimonials split across 3 columns
 *       falls back to hardcoded data if API fails
 */
import { render, screen, waitFor } from "@testing-library/react";
import { Testimonials } from "../testimonials";

jest.mock("@/lib/utils", () => ({
  safeFetch: jest.fn(),
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

// Mock motion/react to avoid animation issues in tests
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock TestimonialsColumn to render testimonial names for easy assertion
jest.mock("@/components/ui/testimonials-columns-1", () => ({
  TestimonialsColumn: ({ testimonials }: any) => (
    <div>
      {testimonials.map((t: any, i: number) => (
        <div key={i} data-testid="testimonial-item">
          <span>{t.name}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  ),
}));

const { safeFetch } = require("@/lib/utils");

const mockTestimonials = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  name: `Test User ${i + 1}`,
  role: "Manager",
  company: "Acme Corp",
  content: `Testimonial content ${i + 1}`,
  image_url: "https://i.pravatar.cc/150",
}));

describe("Testimonials", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders testimonials from API when fetch succeeds", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: mockTestimonials });
    render(<Testimonials />);
    await waitFor(() => screen.getByText("Test User 1"));
    expect(screen.getByText("Test User 1")).toBeInTheDocument();
  });

  it("renders fallback data when API fails", async () => {
    safeFetch.mockResolvedValue({ status: "error" });
    render(<Testimonials />);
    await waitFor(() => screen.getAllByText(/Aarav Mehta|Priya Nair|Kabir Singh/));
    // At least one fallback testimonial name appears
    expect(screen.getAllByText(/Aarav Mehta|Priya Nair|Kabir Singh/).length).toBeGreaterThan(0);
  });

  it("fetches from /api/testimonials.php", async () => {
    safeFetch.mockResolvedValue({ status: "success", data: mockTestimonials });
    render(<Testimonials />);
    await waitFor(() => expect(safeFetch).toHaveBeenCalledWith("/api/testimonials.php"));
  });
});
