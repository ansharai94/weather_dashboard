import { WeatherHeader } from "@/components/weather-header";
import { ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";

vi.mock("lucide-react", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Sun: ({ className }: { className: string }) => (
      <svg className={className} data-testid="sun-icon" />
    ),
  };
});

describe("WeatherHeader", () => {
  describe("Basic rendering", () => {
    it("should display correctly h1", () => {
      render(<WeatherHeader />);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
    it("should display sun icon and the text", () => {
      render(<WeatherHeader />);
      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
      expect(screen.getByText("Weather Dashboard")).toBeInTheDocument();
    });
    it("should display the paragraph", () => {
      render(<WeatherHeader />);
      expect(
        screen.getByText("Verifică vremea în timp real și prognoza pe 7 zile")
      );
    });
  });
});
