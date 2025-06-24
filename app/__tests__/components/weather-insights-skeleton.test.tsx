import { WeatherInsightsSkeleton } from "@/components/ai/weather-insights-skeleton";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    motion: {
      div: ({ className, children, ...props }: CommonProps) => (
        <div className={className} {...props} data-testid="motion-div">
          {children}
        </div>
      ),
    },
  };
});

describe("WeatherInsightsSkeleton", () => {
  describe("Basic rendering", () => {
    it("everything should be rendered correctly", () => {
      render(<WeatherInsightsSkeleton />);
      expect(screen.getAllByTestId("motion-div")).toHaveLength(4);
      expect(screen.getAllByTestId("motion-div")[0].className).toBe(
        "space-y-4"
      );
      screen
        .getAllByTestId("motion-div")
        .slice(1, 3)
        .forEach((div) => {
          expect(div.className).toContain("flex gap-4");
        });
    });
  });
});
