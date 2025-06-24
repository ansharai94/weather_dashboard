import { WeekForecast } from "@/components/week-forecast";
import { CommonProps, DailyWeatherForecast, ImportOriginal } from "@/lib/types";
import { fireEvent, render, screen } from "@testing-library/react";
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
    CardContent: ({ className, children }: CommonProps) => (
      <div className={className} data-testid="card-content">
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
  };
});
const MockWeatherIcon = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <svg
    className={className}
    data-testid="weather-icon"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);
vi.mock("@/lib/utils", async (importOriginal: ImportOriginal) => {
  const actual = importOriginal();
  return {
    ...actual,
    getWeatherDisplay: vi.fn(() => ({
      icon: MockWeatherIcon,
      description: "Sunny",
    })),
  };
});

describe("WeekForecast", () => {
  const mockDailyData: DailyWeatherForecast[] = [
    {
      dt: 1750070400, // Timestamp Unix pentru ziua 1
      sunrise: 1750023600, // 06:00
      sunset: 1750074000, // 20:00
      moonrise: 1750030800,
      moonset: 1750080000,
      moon_phase: 0.25, // Prima pătrime
      summary: "Zi însorită cu temperaturi plăcute",
      temp: {
        day: 25.5,
        min: 18.2,
        max: 28.7,
        night: 20.1,
        eve: 24.3,
        morn: 19.8,
      },
      feels_like: {
        day: 26.1,
        night: 20.5,
        eve: 24.8,
        morn: 20.2,
      },
      pressure: 1015,
      humidity: 65,
      dew_point: 18.5,
      wind_speed: 3.2,
      wind_deg: 210,
      wind_gust: 5.1,
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01d",
        },
      ],
      clouds: 5,
      pop: 0.1, // 10% probabilitate de precipitații
      uvi: 8.5,
      // rain și snow sunt opționale, le omitem pentru această zi
    },
    {
      dt: 1750156800, // Ziua 2
      sunrise: 1750110000,
      sunset: 1750160400,
      moonrise: 1750117200,
      moonset: 1750166400,
      moon_phase: 0.3,
      summary: "Parțial înnorat cu posibile ploi ușoare",
      temp: {
        day: 22.3,
        min: 15.8,
        max: 26.1,
        night: 17.9,
        eve: 21.7,
        morn: 16.5,
      },
      feels_like: {
        day: 22.8,
        night: 18.3,
        eve: 22.1,
        morn: 17.0,
      },
      pressure: 1018,
      humidity: 70,
      dew_point: 16.2,
      wind_speed: 2.8,
      wind_deg: 180,
      wind_gust: 4.3,
      weather: [
        {
          id: 801,
          main: "Clouds",
          description: "few clouds",
          icon: "02d",
        },
      ],
      clouds: 20,
      pop: 0.15,
      uvi: 7.2,
    },
    {
      dt: 1750243200, // Ziua 3
      sunrise: 1750196400,
      sunset: 1750246800,
      moonrise: 1750203600,
      moonset: 1750252800,
      moon_phase: 0.35,
      summary: "Zi ploioasă cu temperaturi mai scăzute",
      temp: {
        day: 20.1,
        min: 12.5,
        max: 23.8,
        night: 14.2,
        eve: 19.3,
        morn: 13.7,
      },
      feels_like: {
        day: 20.5,
        night: 14.6,
        eve: 19.7,
        morn: 14.1,
      },
      pressure: 1022,
      humidity: 75,
      dew_point: 15.1,
      wind_speed: 4.1,
      wind_deg: 150,
      wind_gust: 6.2,
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10d",
        },
      ],
      clouds: 80,
      pop: 0.8, // 80% probabilitate de precipitații
      uvi: 4.3,
      rain: 2.5, // 2.5mm ploaie
    },
  ];
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders the main structure", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("card-header")).toBeInTheDocument();
      expect(screen.getByTestId("card-content")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toBeInTheDocument();
    });
    it("displays the correct title", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByText("Prognoza pe 7 zile")).toBeInTheDocument();
    });
    it("renders weather icon foreach day", () => {
      render(<WeekForecast daily={mockDailyData} />);
      const weatherIcons = screen.getAllByTestId("weather-icon");
      expect(weatherIcons).toHaveLength(mockDailyData.length);
    });
  });

  describe("Data display", () => {
    it("displays temperatureranges for each day", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByText("29/18")).toBeInTheDocument();
      expect(screen.getByText("26/16")).toBeInTheDocument();
      expect(screen.getByText("24/13")).toBeInTheDocument();
    });
    it("displays formatted weekday names in Romanian", () => {
      render(<WeekForecast daily={mockDailyData} />);
      const dayElements = screen.getAllByText(
        /^(luni|marți|miercuri|joi|vineri|sâmbătă|duminică)/i
      );
      expect(dayElements.length).toBeGreaterThan(0);
      expect(dayElements).toHaveLength(mockDailyData.length);
    });
    it("display pressure for selected day(Initially first day)", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByText("1015")).toBeInTheDocument();
      expect(screen.getByText("Presiune (hPa)")).toBeInTheDocument();
    });

    it("display UV index for selected day", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByText("9")).toBeInTheDocument(); // Math.round(8.5)
      expect(screen.getByText("Indice UV")).toBeInTheDocument();
    });
    it("display the sunrise and sunset times", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByText("Răsărit")).toBeInTheDocument();
      expect(screen.getByText("Apus")).toBeInTheDocument();
      const timeElements = screen.getAllByText(/^\d{2}:\d{2}$/);
      expect(timeElements.length).toBeGreaterThanOrEqual(2);
    });
  });
  describe("Interactive Behaviour", () => {
    it("changes selected day when clicking on the weather icon", () => {
      render(<WeekForecast daily={mockDailyData} />);
      expect(screen.getByText("1015")).toBeInTheDocument();
      const weatherIcons = screen.getAllByTestId("weather-icon");
      fireEvent.click(weatherIcons[1]);
      expect(screen.getByText("1018")).toBeInTheDocument();
      expect(screen.getByText("7")).toBeInTheDocument();
    });
    it("maintains correct state when clicking multiple times", () => {
      render(<WeekForecast daily={mockDailyData} />);
      const weatherIcons = screen.getAllByTestId("weather-icon");
      fireEvent.click(weatherIcons[1]);
      expect(screen.getByText("1018")).toBeInTheDocument();
      fireEvent.click(weatherIcons[0]);
      expect(screen.getByText("1015")).toBeInTheDocument();
      fireEvent.click(weatherIcons[2]);
      expect(screen.getByText("1022")).toBeInTheDocument();
    });
  });
});
