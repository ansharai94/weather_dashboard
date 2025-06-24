import { ImportOriginal, WeatherHourly } from "./../../../lib/types";
import {
  calcEstimatedPrecipitation,
  generatePrecipitationChartProps,
  getPrecipitationTypes,
  processData,
} from "@/components/charts/precipitation-chart-constants";
import { PrecipitationType } from "@/lib/types";
import { getTime } from "@/lib/utils";

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

describe("Precipitation chart constant", () => {
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
  const mockProbabilities = [0, 50, 100, 100, 100];
  const mockTypes: PrecipitationType[] = ["none", "rain", "snow", "sleet"];

  const mockEstimated = [0, 2.5, 3.0, 1, 5];

  const mockNext24Hours = [
    {
      dt: 1750053600,
      pop: 0,
      weather: [
        { main: "Clear", description: "cer senin", icon: "01d", id: 800 },
      ],
    },
    {
      dt: 1750057200,
      pop: 0.5,
      weather: [{ main: "Rain", description: "averse", icon: "10d", id: 500 }],
    },
    {
      dt: 1750060800,
      pop: 1,
      weather: [
        { main: "Snow", description: "ninsoare", icon: "13d", id: 600 },
      ],
    },
    {
      dt: 175006160,
      pop: 1,
      weather: [
        { main: "Sleet", description: "lapovita", icon: "13d", id: 700 },
      ],
    },
    {
      dt: 175006960,
      pop: 1,
      weather: [{ main: "Sleet", description: "", icon: "13d", id: 700 }],
    },
  ];

  describe("generatePrecipitationChartProps", () => {
    const { chartData, chartOptions } = generatePrecipitationChartProps(
      mockLabels,
      mockProbabilities,
      mockTypes,
      mockEstimated,
      mockNext24Hours
    );
    it("should return valid chartData and chartOptions", () => {
      expect(chartData.labels).toEqual(mockLabels);
      expect(chartData.datasets[0].data).toEqual(mockProbabilities);
      expect(chartData.datasets[0].backgroundColor).toEqual([
        "rgba(200, 200, 200, 0.3)", // none
        "rgba(59, 130, 246, 0.55)", // rain (0.5 pop)
        "rgba(147, 197, 253, 0.8)", // snow (1.0 pop)
        "rgba(156, 163, 175, 0.8)", // sleet (1.0 pop)
        "rgba(59, 130, 246, 0.8)",
      ]);
      expect(chartData.datasets[0].borderColor).toEqual([
        "rgba(200, 200, 200, 1)",
        "rgba(59, 130, 246, 1)",
        "rgba(147, 197, 253, 1)",
        "rgba(156, 163, 175, 1)",
        "rgba(59, 130, 246, 1)",
      ]);
      expect(chartOptions.plugins?.title?.text).toContain("🌧️");
      expect(chartOptions.scales?.y?.max).toBe(100);
    });

    it("should format tooltip.label correctly for all types", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-asserted-optional-chain
      const callback: any = chartOptions.plugins?.tooltip?.callbacks?.label!;
      const ctx = (i: number) => ({
        parsed: { y: mockProbabilities[i] },
        dataIndex: i,
      });

      expect(callback(ctx(0))).toEqual([
        "Precipitații: 0% probabilitate",
        "Descriere: cer senin",
        "Cantitate estimată: ~0 mm",
      ]);
      expect(callback(ctx(1))).toEqual([
        "Ploaie: 50% probabilitate",
        "Descriere: averse",
        "Cantitate estimată: ~2.5 mm",
      ]);
      expect(callback(ctx(2))).toEqual([
        "Zăpadă: 100% probabilitate",
        "Descriere: ninsoare",
        "Cantitate estimată: ~3 mm",
      ]);
      expect(callback(ctx(3))).toEqual([
        "Lapoviță: 100% probabilitate",
        "Descriere: lapovita",
        "Cantitate estimată: ~1 mm",
      ]);
      expect(callback(ctx(4))).toEqual([
        "Precipitații: 100% probabilitate",
        "Descriere: ",
        "Cantitate estimată: ~5 mm",
      ]);
    });
    it("should format ticks as percentage in y axis", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tickCallback: any = chartOptions.scales?.y?.ticks?.callback;
      expect(tickCallback(0)).toBe("0%");
      expect(tickCallback(40)).toBe("40%");
      expect(tickCallback(100)).toBe("100%");
    });
  });
  describe("processData", () => {
    it("should returnlabels, precipitationProbability, precipitationTypes,estimatedPrecipitation,next24Hours", () => {
      const {
        labels,
        precipitationProbability,
        precipitationTypes,
        estimatedPrecipitation,
        next24Hours,
      } = processData(mockForecastData);
      expect(labels).toEqual(["09:00", "10:00", "11:00", "12:00"]);
      expect(precipitationProbability).toEqual([0, 0, 0, 0]);
      expect(precipitationTypes).toEqual(["none", "none", "none", "none"]);
      expect(estimatedPrecipitation).toEqual([0, 0, 0, 0]);
      expect(next24Hours).toHaveLength(4);
    });
    it("if forecastData is empty the output should be empty ", () => {
      const {
        labels,
        precipitationProbability,
        precipitationTypes,
        estimatedPrecipitation,
        next24Hours,
      } = processData();
      expect(labels).toEqual([]);
      expect(precipitationProbability).toEqual([]);
      expect(precipitationTypes).toEqual([]);
      expect(estimatedPrecipitation).toEqual([]);
      expect(next24Hours).toEqual([]);
    });
    it("should slice to max 8 items", () => {
      const longData = Array.from({ length: 10 }, (_, i) => ({
        dt: 1750000000 + i * 3600,
        pop: 0.5,
        weather: [{ main: "Rain", description: "", icon: "", id: 500 }],
      }));

      const result = processData(longData as WeatherHourly[]);
      expect(result.next24Hours).toHaveLength(8);
      expect(getTime).toHaveBeenCalledTimes(8);
    });
  });
  describe("getPrecipitationTypes", () => {
    it("should return a string ,snow | sleet | rain | none ", () => {
      const weather = getPrecipitationTypes(mockForecastData[0]);
      expect(weather).toBe("none");
      const snowData = {
        ...mockForecastData[0],
        weather: [
          {
            id: 800,
            main: "Snow",
            description: "ninsoare",
            icon: "01d",
          },
        ],
      };
      const sleetData = {
        ...mockForecastData[0],
        weather: [
          {
            id: 800,
            main: "Sleet",
            description: "lapovita",
            icon: "01d",
          },
        ],
      };
      const rainData = {
        ...mockForecastData[0],
        weather: [
          {
            id: 800,
            main: "rain",
            description: "ploaie",
            icon: "01d",
          },
        ],
      };
      expect(getPrecipitationTypes(snowData)).toBe("snow");
      expect(getPrecipitationTypes(sleetData)).toBe("sleet");
      expect(getPrecipitationTypes(rainData)).toBe("rain");
    });
  });
  describe("calcEstimatedPrecipitation", () => {
    it("should return the estimated precipitaton ", () => {
      expect(
        calcEstimatedPrecipitation(mockForecastData[0], 0, mockTypes)
      ).toBe(0);
      expect(
        calcEstimatedPrecipitation(
          { ...mockForecastData[0], pop: 1 },
          1,
          mockTypes
        )
      ).toBe(5);
      expect(
        calcEstimatedPrecipitation(
          { ...mockForecastData[0], pop: 0.5 },
          2,
          mockTypes
        )
      ).toBe(1.5);
      expect(
        calcEstimatedPrecipitation(
          { ...mockForecastData[0], pop: 0.5 },
          3,
          mockTypes
        )
      ).toBe(2);
    });
  });
});
