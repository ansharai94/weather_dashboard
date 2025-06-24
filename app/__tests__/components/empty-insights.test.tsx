import { EmptyInsightsState } from "@/components/ai/empty-insights";
import { ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    motion: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      span: ({ ...props }: any) => (
        <span {...props} data-testid="motion-span"></span>
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      div: ({ ...props }: any) => (
        <div {...props} data-testid="motion-div"></div>
      ),
    },
  };
});

describe("EmptyInsightsState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render the only the AI Insights inside the h3 when isloading is false", () => {
      const { debug } = render(<EmptyInsightsState isLoading={false} />);
      debug();
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("🧠 AI Insights");
    });
    it("should render additional text inside the h3 element when isLoading is true", () => {
      render(<EmptyInsightsState isLoading={true} />);
      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
      expect(heading.textContent).toBe("🧠 AI Insights⚡Pregătind insights...");
    });
  });
});
