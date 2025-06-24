import {
  generateTemperatureChartProps,
  processTemperatureData,
} from "@/components/charts/temperature-chart-constants";
import { ImportOriginal, WeatherHourly } from "@/lib/types";
import { vi } from "vitest";

vi.mock("@/lib/utils", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getTime: vi.fn((dt: number) => {
      const date = new Date(dt * 1000);
      return date.toLocaleTimeString("ro-RO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }),
  };
});

describe("Temperature chart constants", () => {
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
    {
      dt: 1750057200,
      temp: 23.94,
      feels_like: 23.51,
      pressure: 1016,
      humidity: 43,
      dew_point: 10.61,
      uvi: 4.08,
      clouds: 7,
      visibility: 10000,
      wind_speed: 4.47,
      wind_deg: 350,
      wind_gust: 6.03,
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
      dt: 1750060800,
      temp: 24.21,
      feels_like: 23.78,
      pressure: 1016,
      humidity: 42,
      dew_point: 10.5,
      uvi: 5.84,
      clouds: 7,
      visibility: 10000,
      wind_speed: 4.7,
      wind_deg: 348,
      wind_gust: 5.72,
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
      dt: 1750064400,
      temp: 24.86,
      feels_like: 24.45,
      pressure: 1016,
      humidity: 40,
      dew_point: 10.35,
      uvi: 7.23,
      clouds: 7,
      visibility: 10000,
      wind_speed: 4.18,
      wind_deg: 347,
      wind_gust: 5.12,
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
  const mockLabels = ["12:00", "13:00", "14:00", "15:00", "16:00"];

  const mockTemperatures = [28, 29, 30, 31, 32];
  const mockFeelsLike = [28.5, 29.5, 30.5, 31.5, 32.5];
  const mockLabelContext = {
    dataset: {
      label: "Senzație termică (°C)",
    },
    parsed: {
      y: 24.1,
    },
    dataIndex: 0,
    datasetIndex: 1,
  };
  const mockTitleContext = [{ label: "18:00" }];

  it("should return correct values for chartData, chartOptions", () => {
    const { chartData, chartOptions } = generateTemperatureChartProps(
      mockLabels,
      mockTemperatures,
      mockFeelsLike
    );
    const labelCallback = chartOptions.plugins?.tooltip?.callbacks?.label;
    const titleCallback = chartOptions.plugins?.tooltip?.callbacks?.title;
    const ticksCallback = chartOptions.scales?.y?.ticks?.callback;

    expect(labelCallback(mockLabelContext)).toBe(
      "Senzație termică (°C): 24.1°C"
    );
    expect(titleCallback(mockTitleContext)).toBe("Ora: 18:00");
    expect(ticksCallback(28)).toBe("28°C");

    // console.log(chartOptions.plugins?.tooltip?.callbacks);
    expect(chartData.labels).toEqual(mockLabels);
    expect(chartData.datasets).toHaveLength(2);
    expect(chartOptions.plugins?.title?.text).toBe(
      "🌡️ Temperatura pe următoarele 24 ore"
    );
  });
  describe("processTemperatureData", () => {
    it("should return labels, temperatures ,feelsLike from calling processTemperatureData", () => {
      const { labels, temperatures, feelsLike } =
        processTemperatureData(mockForecastData);

      expect(labels).toEqual(["09:00", "10:00", "11:00", "12:00"]);
      expect(feelsLike).toEqual([23, 24, 24, 24]);
      expect(temperatures).toEqual([24, 24, 24, 25]);
    });
    it("should return empty arrays inside labels, temperatures, feelsLike when calling processTemperatureDate with []", () => {
      const { labels, temperatures, feelsLike } = processTemperatureData();
      expect(labels).toEqual([]);
      expect(feelsLike).toEqual([]);
      expect(temperatures).toEqual([]);
    });
    it("should slice to max 8 items", () => {
      const longData = Array.from({ length: 10 }, (_, i) => ({
        dt: 1750000000 + i * 3600,
        pop: 0.5,
        weather: [{ main: "Rain", description: "", icon: "", id: 500 }],
      }));
      const { labels, temperatures, feelsLike } = processTemperatureData(
        longData as WeatherHourly[]
      );
      expect(labels).toHaveLength(8);
      expect(feelsLike).toHaveLength(8);
      expect(temperatures).toHaveLength(8);
    });
  });
});
