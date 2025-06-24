import { TemperatureLineChart } from "@/components/charts/temperature-line-chart";
import { ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import {
  processTemperatureData,
  generateTemperatureChartProps,
} from "@/components/charts/temperature-chart-constants";
vi.mock("react-chartjs-2", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Line: ({ data, options, ...props }: any) => (
    <div
      data-testid="line-chart"
      data-chart-data={JSON.stringify(data)}
      data-chart-options={JSON.stringify(options)}
      {...props}
    />
  ),
}));
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

vi.mock("@/components/charts/temperature-chart-constants", () => ({
  processTemperatureData: vi.fn(),
  generateTemperatureChartProps: vi.fn(),
}));
describe("TemperatureLineChart ", () => {
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
  const mockProcessedData = {
    labels: ["12:00", "13:00"],
    temperatures: [23.78, 25.12],
    feelsLike: [23.36, 24.89],
  };
  const mockChartConfig = {
    chartData: {
      labels: ["12:00", "13:00"],
      datasets: [
        {
          label: "Temperatura",
          data: [23.78, 25.12],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
        },
        {
          label: "Senzația termică",
          data: [23.36, 24.89],
          borderColor: "rgb(239, 68, 68)",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
        },
      ],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Variația temperaturii pe ore",
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(processTemperatureData).mockReturnValue(mockProcessedData);
    // @ts-expect-error interface issues for mockChartConfig
    vi.mocked(generateTemperatureChartProps).mockReturnValue(mockChartConfig);
  });

  describe("Basic rendering", () => {
    it("renders the chart container", () => {
      render(<TemperatureLineChart forecastData={mockForecastData} />);
      const container = screen.getByTestId("line-chart").parentElement;
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("relative", "w-full");
    });

    it("renders the line chart component", () => {
      render(<TemperatureLineChart forecastData={mockForecastData} />);
      const lineChart = screen.getByTestId("line-chart");
      expect(lineChart).toBeInTheDocument();
    });
  });

  describe("Data Processing", () => {
    it("calls processTemperatureData with corect forecast data", () => {
      render(<TemperatureLineChart forecastData={mockForecastData} />);
      expect(processTemperatureData).toHaveBeenCalledTimes(1);
      expect(processTemperatureData).toHaveBeenCalledWith(mockForecastData);
    });
    it("calls generateTemperatureChartProps with processed data", () => {
      render(<TemperatureLineChart forecastData={mockForecastData} />);
      expect(generateTemperatureChartProps).toHaveBeenCalledTimes(1);
      expect(generateTemperatureChartProps).toHaveBeenCalledWith(
        mockProcessedData.labels,
        mockProcessedData.temperatures,
        mockProcessedData.feelsLike
      );
    });
    it("passes correct data to Line chart component", () => {
      render(<TemperatureLineChart forecastData={mockForecastData} />);

      const lineChart = screen.getByTestId("line-chart");
      const chartData = JSON.parse(
        lineChart.getAttribute("data-chart-data") || "{}"
      );
      const chartOptions = JSON.parse(
        lineChart.getAttribute("data-chart-options") || "{}"
      );
      expect(chartData).toEqual(mockChartConfig.chartData);
      expect(chartOptions).toEqual(mockChartConfig.chartOptions);
    });
  });
});
