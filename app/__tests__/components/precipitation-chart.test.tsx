import { PrecipitationChart } from "@/components/precipitation-chart";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/ui/card", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Card: ({ className, children }: CommonProps) => (
      <div className={className} data-testid="card">
        {children}
      </div>
    ),
    CardHeader: ({ className, children }: CommonProps) => (
      <div className={className} data-testid="card-header">
        {children}
      </div>
    ),
    CardTitle: ({ className, children }: CommonProps) => (
      <div className={className} data-testid="card-title">
        {children}
      </div>
    ),
    CardContent: ({ className, children }: CommonProps) => (
      <div className={className} data-testid="card-content">
        {children}
      </div>
    ),
  };
});

vi.mock("lucide-react", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    CloudRain: ({ className }: CommonProps) => (
      <svg className={className} data-testid="cloud-rain-icon"></svg>
    ),
  };
});

vi.mock("@/components/charts/precipitation-bar-chart", () => ({
  PrecipitationBarChart: ({ forecastData }: CommonProps) => (
    <div data-testid="precipitation-bar-chart">
      <div data-testid="forecast-length">{forecastData.length}</div>
    </div>
  ),
}));

describe("PrecipitationChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const mockForecastData = [
    {
      dt: 1750053600,
      temp: 23.78,
      feels_like: 23.36,
      pressure: 1016,
      humidity: 44,
      dew_point: 10.81,
      uvi: 2.4,
      clouds: 6,
      visibility: 10000,
      wind_speed: 4.55,
      wind_deg: 355,
      wind_gust: 6.65,
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "cer senin",
          icon: "01d",
        },
      ],
      pop: 0,
    },
  ];
  describe("Basic rendering", () => {
    it("should render all the cards components", () => {
      render(<PrecipitationChart forecastData={mockForecastData} />);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-header")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
      expect(screen.getByTestId("card-title").textContent).toBe("Precipitații");
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });
    it("should render correctly the PrecipitationBarChart", () => {
      render(<PrecipitationChart forecastData={mockForecastData} />);
      expect(screen.getByTestId("precipitation-bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("forecast-length").textContent).toBe("1");
    });
    it("should display CloudRain icon", () => {
      render(<PrecipitationChart forecastData={mockForecastData} />);
      expect(screen.getByTestId("cloud-rain-icon")).toBeInTheDocument();
    });
  });
});
