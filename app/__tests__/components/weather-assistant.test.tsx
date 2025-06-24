import { invokeOpenAi } from "@/app/actions/openai";
import { WeatherAssistant } from "@/components/ai/weather-assistant";
import { Message } from "@/lib/types";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("@/app/actions/openai", () => ({
  invokeOpenAi: vi.fn(),
}));
vi.mock("@/lib/utils", () => ({
  formatWeatherContext: vi.fn().mockReturnValue("Formatted weather context"),
  parseAndValidateJSON: vi.fn().mockReturnValue({
    content: "Ai response content",
  }),
}));

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: vi.fn(),
  writable: true,
});

const mockQuickActions = [
  "🌡️ Analize ale vremii actuale",
  "👕 Recomandări de îmbrăcăminte",
  "🏃‍♂️ Sfaturi pentru activități outdoor",
  "⚠️ Alerte pentru schimbări meteo",
  "📅 Planificarea pe baza prognozei",
];

describe("WeatherAssistant", () => {
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
  const mockMessages: Message[] = [
    {
      id: 1,
      role: "system",
      content:
        "Bună! 👋 Sunt WeatherBot, asistentul tău meteo personalizat! Cu ce te pot ajuta ?",
      time: "16:34",
    },
    {
      id: 1750340083365,
      role: "user",
      content: "Planificarea pe baza prognozei",
      time: "16:35",
    },
  ];
  const mockSetMessages = vi.fn();
  const mockSetInputValue = vi.fn();
  const mockSetIsTyping = vi.fn();

  const defaulProps: WeatherAssistant = {
    weatherData: mockWeatherData,
    messages: mockMessages,
    setMessages: mockSetMessages,
    inputValue: "Test input",
    setInputValue: mockSetInputValue,
    isTyping: false,
    setIsTyping: mockSetIsTyping,
  };
  const mockSuccessResponse = {
    status: 200,
    message: {
      role: "assistant" as const,
      content: JSON.stringify({
        content: "AI response about weather",
        additional_tips: [
          {
            id: 1,
            type: "activity",
            icon: "🌳",
            title: "Test Tip",
            content: "Test tip content",
            confidence: 85,
            bgColor: "bg-blue-50",
            borderColor: "border-blue-400",
            iconBg: "bg-blue-100",
          },
        ],
      }),
    },
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(invokeOpenAi).mockReturnValue(mockSuccessResponse);
  });

  describe("Basic rendering", () => {
    it("header section should display correctly", () => {
      render(<WeatherAssistant {...defaulProps} />);
      expect(screen.getByRole("heading")).toBeInTheDocument();
      expect(screen.getByRole("heading").textContent).toBe(
        "Weather AI Assistant"
      );
      expect(screen.getByText("Online • Gata să te ajut")).toBeInTheDocument();
      const allButtons = screen.getAllByRole("button");
      expect(allButtons[0].textContent).toBe("💡");
      expect(allButtons[1].textContent).toBe("⚙️");
    });
    it("should display corectly messages section", () => {
      const { debug } = render(<WeatherAssistant {...defaulProps} />);
      expect(screen.getByText("👤")).toBeInTheDocument();
      const robotIcons = screen
        .getByText("👤")
        .parentElement?.parentElement?.querySelectorAll(
          ".bg-gradient-to-r.from-indigo-500"
        );
      expect(robotIcons).toHaveLength(1);
      expect(screen.getByText(mockMessages[0].content)).toBeInTheDocument();
      expect(screen.getByText(mockMessages[1].content)).toBeInTheDocument();

      expect(screen.getByText(mockMessages[0].time)).toBeInTheDocument();
      expect(screen.getByText(mockMessages[1].time)).toBeInTheDocument();
      debug();
    });
    it("should display animation with  🤖 when user is typing", () => {
      render(<WeatherAssistant {...defaulProps} isTyping={true} />);
      const robotIconsInsideIsTyping = screen
        .getByText("👤")
        .parentElement?.parentElement?.querySelector(
          ".w-9.h-9.bg-gradient-to-r"
        );
      expect(robotIconsInsideIsTyping).toBeInTheDocument();
      expect(robotIconsInsideIsTyping?.textContent).toBe("🤖");
    });
    it("should display the quick actions ", () => {
      render(<WeatherAssistant {...defaulProps} />);

      mockQuickActions.forEach((action) => {
        expect(screen.getByText(action)).toBeInTheDocument();
      });
    });
    it("should display the input", () => {
      render(<WeatherAssistant {...defaulProps} />);
      const input = screen.getByPlaceholderText(
        "Întreabă AI-ul despre vreme..."
      );
      expect(input).toBeInTheDocument();
      expect(input.className).toContain("flex-1 px-4");
      expect(input).toHaveValue("Test input");
      expect(
        input.parentElement?.querySelector(".text-lg")
      ).toBeInTheDocument();
      expect(input.parentElement?.querySelector(".text-lg")?.textContent).toBe(
        "➤"
      );
    });
  });
  describe("User Interaction", () => {
    it("calls setInputValue when typing in input field", () => {
      render(<WeatherAssistant {...defaulProps} />);
      const input = screen.getByPlaceholderText(
        "Întreabă AI-ul despre vreme..."
      );
      fireEvent.change(input, { target: { value: "Cum sa ma imbrac?" } });
      expect(mockSetInputValue).toHaveBeenCalledWith("Cum sa ma imbrac?");
    });
    it("sends message when enterkey is pressed", async () => {
      render(<WeatherAssistant {...defaulProps} />);
      const input = screen.getByPlaceholderText(
        "Întreabă AI-ul despre vreme..."
      );
      fireEvent.keyDown(input, { key: "Enter", shiftKey: false });
      expect(mockSetMessages).toHaveBeenCalledWith([
        ...mockMessages,
        expect.objectContaining({ role: "user", content: "Test input" }),
      ]);
      expect(mockSetInputValue).toHaveBeenCalledWith("");
    });
    it("sends message when send button is clicked", async () => {
      render(<WeatherAssistant {...defaulProps} />);
      const sendButton = screen.getByRole("button", { name: "➤" });
      fireEvent.click(sendButton);
      expect(mockSetMessages).toHaveBeenCalledWith([
        ...mockMessages,
        expect.objectContaining({ role: "user", content: "Test input" }),
      ]);
    });

    it("handles quick action clicks correctly", () => {
      render(<WeatherAssistant {...defaulProps} />);
      const quickAction = screen.getByText(mockQuickActions[0]);
      fireEvent.click(quickAction);

      expect(mockSetMessages).toHaveBeenCalledWith([
        ...mockMessages,
        expect.objectContaining({
          role: "user",
          content: "️ Analize ale vremii actuale",
        }),
      ]);
    });
  });
  describe("API Integration", () => {
    it("successfully processes AI response", async () => {
      render(<WeatherAssistant {...defaulProps} />);
      const sendButton = screen.getByRole("button", { name: "➤" });
      fireEvent.click(sendButton);
      expect(mockSetIsTyping).toHaveBeenCalledWith(true);
      await waitFor(() => {
        expect(invokeOpenAi).toHaveBeenCalledTimes(1);
      });
      expect(mockSetMessages).toHaveBeenCalledTimes(2);
    });

    it("handle API errors ", async () => {
      vi.mocked(invokeOpenAi).mockRejectedValue(new Error("API Error"));
      render(<WeatherAssistant {...defaulProps} />);
      const sendButton = screen.getByRole("button", { name: "➤" });
      fireEvent.click(sendButton);
      await waitFor(() => {
        expect(mockSetIsTyping).toHaveBeenCalledWith(false);
      });
      expect(mockSetMessages).toHaveBeenLastCalledWith(expect.any(Function));
      const setMessagesCallback = mockSetMessages.mock.calls.slice(-1)[0][0];
      const errorResult = setMessagesCallback([]);
      expect(errorResult).toEqual([
        expect.objectContaining({
          role: "assistant",
          content:
            "Îmi pare rău, am întâmpinat o problemă tehnică. Te rog încearcă din nou. 🔧",
        }),
      ]);
    });
    it("no request is made when input is empty ", () => {
      render(<WeatherAssistant {...defaulProps} inputValue="" />);
      const input = screen.getByPlaceholderText(
        "Întreabă AI-ul despre vreme..."
      );
      fireEvent.keyDown(input, { key: "Enter", shiftKey: false });

      expect(mockSetIsTyping).not.toHaveBeenCalled();
      expect(mockSetMessages).not.toHaveBeenCalled();
    });
  });
});
