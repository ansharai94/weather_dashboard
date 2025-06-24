import { MotionInsights } from "@/components/ai/motion-insights";
import { CommonProps, IAdditionalTips, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    motion: {
      div: ({
        children,
        className,
        initial,
        animate,
        exit,
        transition,
        whileHover,
        ...props
      }: CommonProps) => (
        <div
          className={className}
          data-testid="motion-div"
          data-initial={JSON.stringify(initial)}
          data-animate={JSON.stringify(animate)}
          data-exit={JSON.stringify(exit)}
          data-transition={JSON.stringify(transition)}
          data-while-hover={JSON.stringify(whileHover)}
          {...props}
        >
          {children}
        </div>
      ),
    },
  };
});
const mockInsights: IAdditionalTips[] = [
  {
    id: "tip-1",
    title: "Hidratează-te suficient",
    content:
      "Vremea caldă poate duce la deshidratare rapidă. Bea apă în mod regulat.",
    confidence: 85,
    icon: "💧",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-400",
    iconBg: "bg-blue-100",
  },
  {
    id: "tip-2",
    title: "Protejează-te de soare",
    content:
      "Indicele UV este ridicat. Folosește cremă cu SPF și ochelari de soare.",
    confidence: 92,
    icon: "☀️",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-400",
    iconBg: "bg-yellow-100",
  },
  {
    id: "tip-3",
    title: "Îmbracă-te lejer",
    content:
      "Temperatura va fi ridicată. Alege haine ușoare și de culori deschise.",
    confidence: 78,
    icon: "👕",
    bgColor: "bg-green-50",
    borderColor: "border-green-400",
    iconBg: "bg-green-100",
  },
];
describe("MotionInsights", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders container with correct motion properties", () => {
      render(<MotionInsights insights={mockInsights} showInsights={true} />);
      const containers = screen.getAllByTestId("motion-div");
      const mainContainer = containers[0]; // Primul este containerul principal
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass("space-y-4");
      expect(mainContainer).toHaveAttribute("data-initial", '{"opacity":0}');
      expect(mainContainer).toHaveAttribute("data-animate", '{"opacity":1}');
      expect(mainContainer).toHaveAttribute("data-exit", '{"opacity":0}');
    });
    it("renders all insights cards", () => {
      render(<MotionInsights insights={mockInsights} showInsights={true} />);
      mockInsights.forEach((insight) => {
        expect(screen.getByText(insight.title)).toBeInTheDocument();
        expect(screen.getByText(insight.content)).toBeInTheDocument();
        expect(
          screen.getByText(`Încredere: ${insight.confidence}%`)
        ).toBeInTheDocument();
        expect(screen.getByText(insight.icon)).toBeInTheDocument();
      });
    });
    it("renders correct number of motion divs", () => {
      render(<MotionInsights insights={mockInsights} showInsights={true} />);

      const motionDivs = screen.getAllByTestId("motion-div");
      expect(motionDivs).toHaveLength(7); // 1 + (2 * 3 insights)
    });
  });

  describe("Conditional Animations", () => {
    it("applies correct animations when showInsights is true ", () => {
      render(<MotionInsights insights={mockInsights} showInsights={true} />);
      const motionDivs = screen.getAllByTestId("motion-div");
      const insightCards = motionDivs.slice(1, 4);

      insightCards.forEach((card) => {
        if (card.className.includes("flex gap-4")) {
          const animateData = JSON.parse(
            card.getAttribute("data-animate") || "{}"
          );
          expect(animateData.opacity).toBe(1);
          expect(animateData.x).toBe(0);
          expect(animateData.scale).toBe(1);
        }
      });
    });
    it("applies correct animations when showInsights is false", () => {
      render(<MotionInsights insights={mockInsights} showInsights={false} />);
      const motionDivs = screen.getAllByTestId("motion-div");
      const insightCards = motionDivs.slice(1, 4);
      insightCards.forEach((card) => {
        if (card.className.includes("flex gap-4")) {
          const animateData = JSON.parse(
            card.getAttribute("data-animate") || "{}"
          );
          expect(animateData.opacity).toBe(0.5);
          expect(animateData.x).toBe(0);
          expect(animateData.scale).toBe(0.95);
        }
      });
    });
  });
});
