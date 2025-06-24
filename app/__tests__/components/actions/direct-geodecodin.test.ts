import {
  getWeatherByCity,
  getWeatherByLocation,
} from "@/app/actions/direct-geodecoding";
import { vi } from "vitest";

global.fetch = vi.fn();

process.env.WEATHER_DASHBOARD_API = "test-api-key-12345";

describe("direct geocoding server actions", () => {
  const mockGeocodingResponse = [
    {
      name: "Brăila",
      local_names: {
        ro: "Brăila",
        en: "Braila",
      },
      lat: 45.2692,
      lon: 27.9574,
      country: "RO",
    },
    {
      name: "Bucuresti",
      local_names: {
        ro: "București",
        en: "Bucharest",
      },
      lat: 44.4268,
      lon: 26.1025,
      country: "RO",
    },
  ];

  const mockWeatherResponse = {
    lat: 45.2692,
    lon: 27.9574,
    timezone: "Europe/Bucharest",
    timezone_offset: 10800,
    current: {
      dt: 1750056847,
      sunrise: 1750040380,
      sunset: 1750096685,
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
      rain: [],
    },
    hourly: [
      {
        dt: 1750053600,
        temp: 23.78,
        feels_like: 23.36,
        pressure: 1016,
        humidity: 44,
        weather: [
          { id: 800, main: "Clear", description: "cer senin", icon: "01d" },
        ],
        pop: 0,
      },
    ],
    daily: [
      {
        dt: 1750070400,
        sunrise: 1750023600,
        sunset: 1750074000,
        temp: {
          day: 25.5,
          min: 18.2,
          max: 28.7,
          night: 20.1,
          eve: 24.3,
          morn: 19.8,
        },
        weather: [
          { id: 800, main: "Clear", description: "cer senin", icon: "01d" },
        ],
        clouds: 5,
        pop: 0.1,
        uvi: 8.5,
      },
    ],
  };

  const mockReverseGeocodingResponse = [
    {
      name: "Brăila",
      local_names: {
        ro: "Brăila",
        en: "Braila",
      },
      lat: 45.2692,
      lon: 27.9574,
      country: "RO",
      state: "Brăila",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Diacritics Normalization", () => {
    it("finds romanian city with diacritics correctly", async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockGeocodingResponse),
        } as Response)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockWeatherResponse),
        } as Response);

      const result = await getWeatherByCity("braila");
      expect(result?.location).toBe("Brăila, RO");
      expect(result?.current?.temp).toBe(23.94);
    });
  });
  describe("getWeatherByCity", () => {
    it("successfully gets weather for Romanian city", async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockGeocodingResponse),
        } as Response)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockWeatherResponse),
        } as Response);
      await getWeatherByCity("braila");
      expect(fetch).toBeCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        "http://api.openweathermap.org/geo/1.0/direct?q=braila&limit=5&appid=test-api-key-12345&lang=ro"
      );
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        "http://api.openweathermap.org/data/3.0/onecall?lat=45.2692&lon=27.9574&units=metric&lang=ro&appid=test-api-key-12345"
      );
    });
    it("handles geocoding API errors", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        status: 401,
        json: () => Promise.resolve({}),
      } as Response);

      await expect(getWeatherByCity("Brăila")).rejects.toThrow(
        "HTTP error! status: 401"
      );
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    it("handles weather API erros after successful geocoding", async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockGeocodingResponse),
        } as Response)
        .mockResolvedValueOnce({
          status: 500,
          json: () => Promise.resolve({}),
        } as Response);

      await expect(getWeatherByCity("braila")).rejects.toThrow(
        "HTTP error! status: 500"
      );
    });
    it("handles network errors", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("Network error"));

      await expect(getWeatherByCity("Brăila")).rejects.toThrow("Network error");
    });
  });
  describe("GetWeatherByLocation", () => {
    it("successfully gets weather and location name by coordinates", async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockWeatherResponse),
        } as Response)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockReverseGeocodingResponse),
        } as Response);
      const coordinates = { lat: 45.2692, lon: 27.9574 };

      const result = await getWeatherByLocation(coordinates);
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        location: "Brăila, RO",
        ...mockWeatherResponse,
      });
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        "http://api.openweathermap.org/data/3.0/onecall?lat=45.2692&lon=27.9574&units=metric&lang=ro&appid=test-api-key-12345"
      );

      // Reverse geocoding call
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        "http://api.openweathermap.org/geo/1.0/reverse?lat=45.2692&lon=27.9574&limit=1&appid=test-api-key-12345"
      );
    });
    it("handles weather API errors in getWeatherByLocation", async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockReverseGeocodingResponse),
        } as Response)
        .mockResolvedValueOnce({
          status: 403,
          json: () => Promise.resolve({}),
        } as Response);
      const coordinates = { lat: 45.2692, lon: 27.9574 };
      await expect(getWeatherByLocation(coordinates)).rejects.toThrow(
        "HTTP error! status: 403"
      );
      expect(fetch).toHaveBeenCalledTimes(2);
    });
    it("handles unknown location", async () => {
      vi.mocked(fetch)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve(mockWeatherResponse),
        } as Response)
        .mockResolvedValueOnce({
          status: 200,
          json: () => Promise.resolve([]),
        } as Response);

      const result = await getWeatherByLocation({ lat: 0.0, lon: 0.0 });
      expect(result.location).toBe("Locație necunoscută");
    });
  });
});
