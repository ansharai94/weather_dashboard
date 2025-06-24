import { AnimatedWeatherInsights } from "@/components/ai/animated-weather-insights";
import { CommonProps, IAdditionalTips, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { AnimatePresence } from "framer-motion";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    motion: {
      span: ({ className, children, ...props }: CommonProps) => (
        <span className={className} {...props} data-testid="motion-span">
          {children}
        </span>
      ),
    },
    AnimatePresence: ({ mode, children }: CommonProps) => (
      <div mode={mode} data-testid="animate-presence">
        {children}
      </div>
    ),
  };
});
vi.mock("@/components/ai/motion-insights", () => ({
  MotionInsights: ({ insights, showInsights }: CommonProps) => (
    <div
      insights={insights}
      showInsights={showInsights}
      data-testid="motion-insights"
    ></div>
  ),
}));
vi.mock("@/components/ai/weather-insights-skeleton", () => ({
  WeatherInsightsSkeleton: () => (
    <div data-testid="weather-insights-skeleton"></div>
  ),
}));
const mockInsights: IAdditionalTips[] = [
  {
    id: 1,
    type: "planning",
    icon: "⏰",
    title: "Activități Matinale",
    content: "Plimbări ușoare între 08:00-10:00, temperaturi plăcute.",
    confidence: 90,
    bgColor: "bg-red-50",
    borderColor: "border-l-red-500",
    iconBg: "bg-white/70",
  },
  {
    id: 2,
    type: "planning",
    icon: "⏰",
    title: "Evitarea Soarelui Puternic",
    content: "Între orele 11:00-16:00, caută umbră sau activități în interior.",
    confidence: 95,
    bgColor: "bg-red-50",
    borderColor: "border-l-red-500",
    iconBg: "bg-white/70",
  },
  {
    id: 3,
    type: "activity",
    icon: "🌳",
    title: "Vizită la Parcul Monument",
    content:
      "Perfect pentru plimbări, ideal între orele 10:00-11:30 sau după ora 17:00.",
    confidence: 92,
    bgColor: "bg-purple-50",
    borderColor: "border-l-purple-500",
    iconBg: "bg-white/70",
  },
  {
    id: 4,
    type: "health",
    icon: "☀️",
    title: "Protecție Solară Intensivă",
    content:
      "**SPF 50+** aplicat la fiecare două ore, ochelari UV400 necesari!",
    confidence: 96,
    bgColor: "bg-emerald-50",
    borderColor: "border-l-emerald-500",
    iconBg: "bg-white/70",
  },
];

describe("AnimatedWeatherInsights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic rendering", () => {
    it("render motion span if showInsights is true", () => {
      render(
        <AnimatedWeatherInsights
          insights={mockInsights}
          showInsights={true}
          isLoading={false}
        />
      );
      const heading = screen.getByRole("heading");
      expect(screen.getByTestId("motion-span")).toBeInTheDocument();
      expect(heading.textContent).toBe("🧠 AI Insights✨ Actualizat");
    });
    it("renders heading 3 without motion span when showInsights is false ", () => {
      render(
        <AnimatedWeatherInsights
          insights={mockInsights}
          showInsights={false}
          isLoading={false}
        />
      );
      expect(screen.queryByTestId("motion-span")).toBe(null);
      expect(screen.getByRole("heading").textContent).toBe("🧠 AI Insights");
    });
    it("renders all AnimatePresence components", () => {
      render(
        <AnimatedWeatherInsights
          insights={mockInsights}
          showInsights={true}
          isLoading={false}
        />
      );
      const animatePresence = screen.getAllByTestId("animate-presence");
      expect(animatePresence).toHaveLength(2);
    });
    it("renders AnimatePresence with mode wait", () => {
      render(
        <AnimatedWeatherInsights
          insights={mockInsights}
          showInsights={true}
          isLoading={false}
        />
      );
      const animatePresence = screen.getAllByTestId("animate-presence");

      expect(animatePresence[1].getAttribute("mode")).toBe("wait");
    });
    it("renders WeatherInsightsSkeleton when isLoading is true", () => {
      render(
        <AnimatedWeatherInsights
          insights={mockInsights}
          showInsights={true}
          isLoading={true}
        />
      );
      expect(
        screen.getByTestId("weather-insights-skeleton")
      ).toBeInTheDocument();
      expect(screen.queryByTestId("motion-insights")).toBe(null);
    });
    it("renders MotionInsights when isLoading is false", () => {
      render(
        <AnimatedWeatherInsights
          insights={mockInsights}
          showInsights={true}
          isLoading={false}
        />
      );
      expect(screen.getByTestId("motion-insights")).toBeInTheDocument();
      expect(screen.queryByTestId("weather-insights-skeleton")).toBe(null);
    });
  });
});
