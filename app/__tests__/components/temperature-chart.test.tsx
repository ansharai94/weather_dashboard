import { TemperatureChart } from "@/components/temperature-chart";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";

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
    Thermometer: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="thermometer-icon">
        {children}
      </svg>
    ),
  };
});

vi.mock("@/components/charts/temperature-line-chart", () => ({
  TemperatureLineChart: vi.fn((props) => (
    <div data-testid="temperature-line-chart" {...props} />
  )),
}));

describe("TemperatureChart", () => {
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
    {
      dt: 1750057200,
      temp: 25.12,
      feels_like: 24.89,
      pressure: 1015,
      humidity: 40,
      dew_point: 9.85,
      uvi: 3.2,
      clouds: 12,
      visibility: 10000,
      wind_speed: 5.12,
      wind_deg: 340,
      wind_gust: 7.23,
      weather: [
        {
          id: 801,
          main: "Clouds",
          description: "puține nori",
          icon: "02d",
        },
      ],
      pop: 0.15,
    },
  ];
  describe("Basic Rendering", () => {
    it("render all cards correctly", () => {
      render(<TemperatureChart forecastData={mockForecastData} />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-header")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
    });
    it("renders the header correctly", () => {
      render(<TemperatureChart forecastData={mockForecastData} />);

      const thermometer = screen.getByTestId("thermometer-icon");
      const title = screen.getByText("Temperatura pe 24h");
      expect(thermometer).toBeInTheDocument();
      expect(title).toBeInTheDocument();
    });
    it("renders the temperature line chart component", () => {
      render(<TemperatureChart forecastData={mockForecastData} />);
      expect(screen.getByTestId("temperature-line-chart")).toBeInTheDocument();
    });
  });
});
