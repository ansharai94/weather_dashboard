import { WeatherAISection } from "@/components/ai/weather-ai-section";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    AnimatePresence: ({ children, isVisible }: CommonProps) => (
      <div data-testid="animate-presence" isVisible={isVisible}>
        {children}
      </div>
    ),
  };
});

vi.mock("@/components/ai/weather-assistant", () => ({
  WeatherAssistant: ({ weatherData, messages, setMessages }: any) => (
    <div data-testid="weather-assistant">
      <span data-testid="weather-data">{weatherData?.location}</span>
      <span data-testid="messages-count">{messages?.length}</span>
      <button
        data-testid="add-message-btn"
        onClick={() =>
          setMessages([
            ...messages,
            {
              id: Date.now(),
              role: "assistant",
              content: "New message",
              time: "12:00",
              additional_tips: [
                {
                  id: "tip-1",
                  title: "Test Tip",
                  content: "Test content",
                  confidence: 85,
                  icon: "💧",
                  bgColor: "bg-blue-50",
                  borderColor: "border-blue-400",
                  iconBg: "bg-blue-100",
                },
              ],
            },
          ])
        }
      >
        Add Message with Tips
      </button>
    </div>
  ),
}));

vi.mock("@/components/ai/animated-weather-insights", () => ({
  AnimatedWeatherInsights: ({ insights, showInsights, isLoading }: any) => (
    <div data-testid="animated-weather-insights">
      <span data-testid="insights-count">{insights?.length || 0}</span>
      <span data-testid="show-insights">{String(showInsights)}</span>
      <span data-testid="is-loading">{String(isLoading)}</span>
    </div>
  ),
}));

vi.mock("@/components/ai/empty-insights", () => ({
  EmptyInsightsState: ({ isLoading }: any) => (
    <div data-testid="empty-insights-state">
      <span data-testid="empty-loading">{String(isLoading)}</span>
    </div>
  ),
}));

vi.mock("@/components/ai/floating-message", () => ({
  FloatingMessage: ({ message }: any) => (
    <div data-testid="floating-message">
      <span data-testid="floating-content">{message?.content}</span>
    </div>
  ),
}));

vi.mock("@/components/ai/animated-container", () => ({
  AnimatedContainer: ({ isVisible, children }: any) => (
    <div data-testid="animated-container" data-visible={isVisible}>
      {children}
    </div>
  ),
}));
vi.useFakeTimers();
describe("WeatherAISection", () => {
  const mockWeatherData = {
    location: "București, România",
    current: {
      temp: 23.5,
      feels_like: 24.1,
      humidity: 65,
      wind_speed: 3.2,
      pressure: 1015,
      visibility: 10000,
      uvi: 5.2,
      clouds: 20,
      weather: [
        { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
      ],
      sunrise: 1750023600,
      sunset: 1750074000,
      wind_deg: 210,
      dew_point: 16.8,
      dt: 1750056847,
      wind_gust: 4.5,
      rain: [],
    },
    hourly: [],
    daily: [],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllTimers();
  });
  afterEach(() => {
    act(() => {
      vi.runOnlyPendingTimers();
    });
  });

  describe("Initial Rendering", () => {
    it("renders all main components", () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);
      expect(screen.getByTestId("weather-assistant")).toBeInTheDocument();
      expect(screen.getByTestId("animated-container")).toBeInTheDocument();
      expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    });
    it("initializez with default message", () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);
      expect(screen.getByTestId("messages-count").textContent).toBe("1");
    });
    it("passes weather data to WeatherAssistant", () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);
      expect(screen.getByTestId("weather-data").textContent).toBe(
        "București, România"
      );
    });
    it("shows the EmptyInsightsState initially", () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);
      expect(screen.getByTestId("empty-insights-state")).toBeInTheDocument();
      expect(
        screen.queryByTestId("animated-weather-insights")
      ).not.toBeInTheDocument();
    });
    it("animated container is initially not visible", () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);
      expect(screen.getByTestId("animated-container")).toHaveAttribute(
        "data-visible",
        "false"
      );
    });
  });

  describe("Weather Data Changes", () => {
    it("resets messages when weather data changes", () => {
      const { rerender } = render(
        <WeatherAISection weatherData={mockWeatherData} />
      );
      expect(screen.getByTestId("weather-data").textContent).toBe(
        "București, România"
      );
      expect(screen.getByTestId("messages-count").textContent).toBe("1");
      const nextData = {
        ...mockWeatherData,
        location: "Braila",
      };
      rerender(<WeatherAISection weatherData={nextData} />);
      expect(screen.getByTestId("messages-count").textContent).toBe("1");
      expect(screen.getByTestId("weather-data").textContent).toBe("Braila");
    });
  });
  describe("Insights Animation Sequence", () => {
    it("triggers animation sequence when new insights are added", async () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);
      const addButton = screen.getByTestId("add-message-btn");
      act(() => addButton.click());

      expect(screen.getByTestId("insights-count")).toHaveTextContent("1");
      expect(screen.getByTestId("show-insights")).toHaveTextContent("false");
      expect(screen.getByTestId("is-loading")).toHaveTextContent("true");

      expect(screen.getByTestId("floating-message")).toBeInTheDocument();
      // Avansăm timpul cu 500ms (primul setTimeout)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByTestId("show-insights")).toHaveTextContent("true");
      expect(screen.getByTestId("is-loading")).toHaveTextContent("false");

      act(() => {
        vi.advanceTimersByTime(800);
      });
      expect(screen.queryByTestId("floating-message")).not.toBeInTheDocument();
    });
    it("shows AnimatedWeatherInsights when isights are present", async () => {
      render(<WeatherAISection weatherData={mockWeatherData} />);

      act(() => {
        screen.getByTestId("add-message-btn").click();
      });
      expect(
        screen.getByTestId("animated-weather-insights")
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId("empty-insights-state")
      ).not.toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1500);
      });
      const container = screen.getByTestId("animated-container");
      expect(container).toHaveAttribute("data-visible", "true");
    });
  });
});
