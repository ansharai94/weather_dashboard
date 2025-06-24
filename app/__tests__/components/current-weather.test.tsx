import { CurrentWeather } from "@/components/current-weather";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";

vi.mock("./u/card", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Card: ({ className, children }: CommonProps) => (
      <div className={className} data-testid="weather-card">
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
    MapPin: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="map-pin-icon">
        {children}
      </svg>
    ),
    Sun: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="sun-icon">
        {children}
      </svg>
    ),
    Wind: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="wind-icon">
        {children}
      </svg>
    ),
    Droplets: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="droplets-icon">
        {children}
      </svg>
    ),
    Thermometer: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="termometer-icon">
        {children}
      </svg>
    ),
    Eye: ({ className, children }: CommonProps) => (
      <svg className={className} data-testid="eye-icon">
        {children}
      </svg>
    ),
  };
});

describe("Current Weather", () => {
  const defaultProps = {
    location: "Braila",
    current: {
      clouds: 7,
      dew_point: 10.61,
      dt: 1750056847,
      feels_like: 23.51,
      humidity: 43,
      pressure: 1016,
      sunrise: 1750040380,
      sunset: 1750096685,
      temp: 23.94,
      uvi: 4.08,
      visibility: 10000,
      weather: [
        { description: "cer senin", icon: "01d", id: 800, main: "Clear" },
      ],
      wind_deg: 350,
      wind_gust: 6.03,
      wind_speed: 4.47,
      rain: [],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Location Display", () => {
    it("renders location with MapPin icon", () => {
      render(<CurrentWeather {...defaultProps} />);
      const location = screen.getByText("Braila");
      const mapPin = screen.getByTestId("map-pin-icon");

      expect(mapPin).toBeInTheDocument();
      expect(location).toBeInTheDocument();
    });

    it("renders Sun icon in the header", () => {
      render(<CurrentWeather {...defaultProps} />);
      const sunIcon = screen.getByTestId("sun-icon");
      expect(sunIcon).toBeInTheDocument();
    });
  });
  describe("Temperature Dsiplay", () => {
    it("renders main temperature correclty", () => {
      render(<CurrentWeather {...defaultProps} />);
      const temperature = screen.getByText(`23.94°C`);
      expect(temperature).toBeInTheDocument();
      expect(Number(temperature.textContent?.split("°C")[0])).toBe(23.94);
    });
    it("renders feels like temperature with correct label", () => {
      render(<CurrentWeather {...defaultProps} />);
      const feelsLikeValue = screen.getByText(`23.51°C`);
      const feelsLikeLabel = screen.getByText("Senzație");
      const thermometerIcon = screen.getByTestId("termometer-icon");

      expect(feelsLikeLabel).toBeInTheDocument();
      expect(feelsLikeValue).toBeInTheDocument();
      expect(thermometerIcon).toBeInTheDocument();
      expect(Number(feelsLikeValue.textContent?.split("°C")[0])).toBe(23.51);
    });
  });
  describe("Weather Metrics", () => {
    it("renders wind information correctly", () => {
      render(<CurrentWeather {...defaultProps} />);
      const windSpeed = screen.getByText(`4.47 km/h`);
      const windLabel = screen.getByText("Vânt");
      const windIcon = screen.getByTestId("wind-icon");

      expect(windSpeed).toBeInTheDocument();
      expect(windIcon).toBeInTheDocument();
      expect(windLabel).toBeInTheDocument();
      expect(Number(windSpeed.textContent?.split(" ")[0])).toBe(4.47);
    });
    it("renders humidity information correctly", () => {
      render(<CurrentWeather {...defaultProps} />);
      const humidityValue = screen.getByText(`43%`);
      const humidityLabel = screen.getByText(`Umiditate`);
      const dropletsIcon = screen.getByTestId("droplets-icon");

      expect(humidityValue).toBeInTheDocument();
      expect(humidityLabel).toBeInTheDocument();
      expect(dropletsIcon).toBeInTheDocument();
      expect(Number(humidityValue.textContent?.split("%")[0])).toBe(43);
    });
    it("renders visibility information correctly", () => {
      render(<CurrentWeather {...defaultProps} />);
      const visibility = screen.getByText(`10 km`);
      const eyeIcon = screen.getByTestId("eye-icon");
      const visibilityLabel = screen.getByText("Vizibilitate");

      expect(visibility).toBeInTheDocument();
      expect(visibilityLabel).toBeInTheDocument();
      expect(eyeIcon).toBeInTheDocument();
      expect(Number(visibility.textContent?.split(" ")[0])).toBe(10);
    });
  });
});
