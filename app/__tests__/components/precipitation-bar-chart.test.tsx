import { PrecipitationBarChart } from "@/components/charts/precipitation-bar-chart";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";

vi.mock("chart.js", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Chart: {
      register: vi.fn(),
    },
    CategoryScale: ({}) => <div></div>,
    LinearScale: ({}) => <div></div>,
    PointElement: ({}) => <div></div>,
    LineElement: ({}) => <div></div>,
    Title: ({}) => <div></div>,
    Tooltip: ({}) => <div></div>,
    Legend: ({}) => <div></div>,
    Filler: ({}) => <div></div>,
  };
});
vi.mock("react-chartjs-2", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Bar: ({ data, options }: CommonProps) => (
      <div data-testid="bar">
        <div data-testid="bar-data-length">{data.labels.length}</div>
        <div data-testid="bar-options-length">
          {Object.keys(options).length}
        </div>
      </div>
    ),
  };
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
describe("PrecipitationBarChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Basic rendering", () => {
    it("Should render the correct elements in the header", () => {
      render(<PrecipitationBarChart forecastData={mockForecastData} />);
      expect(screen.getByRole("heading").textContent).toBe(
        "🌧️ Precipitații pe 24h"
      );
      expect(screen.getByText("Ploaie")).toBeInTheDocument();
      expect(screen.getByText("Zăpadă")).toBeInTheDocument();
      expect(screen.getByText("Furtună")).toBeInTheDocument();
      expect(screen.getByText("Altele")).toBeInTheDocument();
    });
    it("should render the Bar correctly", () => {
      render(<PrecipitationBarChart forecastData={mockForecastData} />);
      expect(screen.getByTestId("bar")).toBeInTheDocument();
      expect(screen.getByTestId("bar-data-length")).toBeInTheDocument();
      expect(screen.getByTestId("bar-data-length").textContent).toBe("1");
      expect(screen.getByTestId("bar-options-length")).toBeDefined();
      expect(screen.getByTestId("bar-options-length").textContent).toBe("4");
    });
    it("should render the statistics correctly", () => {
      render(<PrecipitationBarChart forecastData={mockForecastData} />);
      expect(
        screen.getByText("Probabilitate max").parentElement?.textContent
      ).toBe("0%Probabilitate max");
      expect(screen.getByText("Medie 24h").parentElement?.textContent).toBe(
        "0%Medie 24h"
      );
      expect(
        screen.getByText("Ore cu precipitații").parentElement?.textContent
      ).toBe("0Ore cu precipitații");
      expect(screen.getByText("Total estimat").parentElement?.textContent).toBe(
        "~0.0 mmTotal estimat"
      );
      expect(
        screen.queryByText("Probabilitate mare de precipitații!")
      ).not.toBeInTheDocument();
    });
    it("when maxProbability > 70 alert section should be visible", () => {
      const { rerender } = render(
        <PrecipitationBarChart forecastData={mockForecastData} />
      );
      expect(
        screen.queryByText("Probabilitate mare de precipitații!")
      ).not.toBeInTheDocument();
      const nextForecastData = [{ ...mockForecastData[0], pop: 100 }];
      rerender(<PrecipitationBarChart forecastData={nextForecastData} />);
      expect(
        screen.getByText("Probabilitate mare de precipitații!")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Se recomandă să ai umbrelă la îndemână.")
      ).toBeInTheDocument();
    });
  });
});
