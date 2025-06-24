import {
  getWeatherByCity,
  getWeatherByLocation,
} from "@/app/actions/direct-geodecoding";
import WeatherDashboard from "@/components/weather-dashboard";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

interface MockSearchBar {
  handleSearch: () => void;
  handleGeolocation: () => void;
  setSearchCity: (city: string) => void;
}
vi.mock("@/components/search-bar", () => ({
  SearchBar: ({
    handleSearch,
    handleGeolocation,
    setSearchCity,
  }: MockSearchBar) => (
    <div data-testid="search-bar">
      <button data-testid="search-button" onClick={handleSearch}>
        Search
      </button>
      <button data-testid="geo-button" onClick={handleGeolocation}>
        Geo
      </button>
      <button data-testid="set-city" onClick={() => setSearchCity("București")}>
        Set City
      </button>
    </div>
  ),
}));

vi.mock("@/components/weather-header", () => ({
  WeatherHeader: () => <div data-testid="weather-header" />,
}));

vi.mock("@/components/current-weather", () => ({
  CurrentWeather: () => <div data-testid="current-weather" />,
}));

vi.mock("@/components/week-forecast", () => ({
  WeekForecast: () => <div data-testid="week-forecast" />,
}));

vi.mock("@/components/temperature-chart", () => ({
  TemperatureChart: () => <div data-testid="temperature-chart" />,
}));

vi.mock("@/components/precipitation-chart", () => ({
  PrecipitationChart: () => <div data-testid="precipitation-chart" />,
}));

vi.mock("@/components/ai/weather-ai-section", () => ({
  WeatherAISection: () => <div data-testid="weather-ai-section" />,
}));

vi.mock("@/app/actions/direct-geodecoding", () => ({
  getWeatherByCity: vi.fn(),
  getWeatherByLocation: vi.fn(),
}));
// Mock pentru geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
});
const mockWeatherData = {
  location: "București",
  current: { temp: 23 },
  hourly: [],
  daily: [],
};

describe("WeatherDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getWeatherByCity).mockResolvedValue(mockWeatherData);
    vi.mocked(getWeatherByLocation).mockResolvedValue(mockWeatherData);
  });

  it("renders header and search bar always", () => {
    render(<WeatherDashboard />);

    expect(screen.getByTestId("weather-header")).toBeInTheDocument();
    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("does not render weather components initially", () => {
    render(<WeatherDashboard />);

    expect(screen.queryByTestId("current-weather")).not.toBeInTheDocument();
    expect(screen.queryByTestId("week-forecast")).not.toBeInTheDocument();
    expect(screen.queryByTestId("temperature-chart")).not.toBeInTheDocument();
    expect(screen.queryByTestId("precipitation-chart")).not.toBeInTheDocument();
    expect(screen.queryByTestId("weather-ai-section")).not.toBeInTheDocument();
  });

  it("calls handleSearch and renders weather components", async () => {
    render(<WeatherDashboard />);
    fireEvent.click(screen.getByTestId("set-city"));
    fireEvent.click(screen.getByTestId("search-button"));

    await waitFor(() => {
      expect(getWeatherByCity).toHaveBeenCalledWith("București");
      expect(screen.getByTestId("current-weather")).toBeInTheDocument();
      expect(screen.getByTestId("week-forecast")).toBeInTheDocument();
      expect(screen.getByTestId("temperature-chart")).toBeInTheDocument();
      expect(screen.getByTestId("precipitation-chart")).toBeInTheDocument();
      expect(screen.getByTestId("weather-ai-section")).toBeInTheDocument();
    });
  });
  it("calls handleGeolocation and renders weather components", async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((callback) => {
      callback({
        coords: {
          latitude: 44.4268,
          longitude: 26.1025,
        },
      });
    });
    render(<WeatherDashboard />);
    fireEvent.click(screen.getByTestId("geo-button"));
    await waitFor(() => {
      expect(getWeatherByLocation).toHaveBeenCalledWith({
        lat: 44.4268,
        lon: 26.1025,
      });
    });
  });
});
