import { FloatingMessage } from "@/components/ai/floating-message";
import { CommonProps, ImportOriginal, Message } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    motion: {
      div: ({
        className,
        children,
        initial,
        animate,
        exit,
        transition,
        style,
        ...props
      }: CommonProps) => (
        <div
          className={className}
          data-testid="motion-div"
          initial={JSON.stringify(initial)}
          animate={JSON.stringify(animate)}
          exit={JSON.stringify(exit)}
          transition={JSON.stringify(transition)}
          style={style}
          {...props}
        >
          {children}
        </div>
      ),
    },
  };
});

const mockMessage: Message = {
  id: 1750242173341,
  role: "assistant",
  time: "13:22",
  content:
    "🌤️ În Brăila, vremea este plăcută, cu o temperatură de 27°C și un UV Index de 8.37, ceea ce indică un risc ridicat de expunere la soare. Vântul de 15 km/h va oferi o senzație mai plăcută. Este o zi ideală pentru activități în aer liber, dar trebuie să ai grijă la protecția solară. Iată câteva sugestii pentru planificare pe parcursul zilei:",
  recommendation: {
    title: "🗓️ Planificarea activităților:",
    text: "Evita expunerea directă între 11:00-16:00. Hidratare constantă și SPF 50+!",
  },
  additional_tips: [
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
      content:
        "Între orele 11:00-16:00, caută umbră sau activități în interior.",
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
  ],
  confidence: ">90%",
};
describe("Floating Message", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render 2 motion divs", () => {
      render(<FloatingMessage message={mockMessage} />);
      const motionDivs = screen.getAllByTestId("motion-div");
      expect(motionDivs).toHaveLength(2);
    });
    it("should display the animate properties correctly when innerWidth is bigger than 1024", () => {
      Object.defineProperty(global.window, "innerWidth", {
        value: 1500,
        configurable: true,
      });
      render(<FloatingMessage message={mockMessage} />);
      const motionDivs = screen.getAllByTestId("motion-div");
      const firstMotionDiv = motionDivs[0];
      const animate = JSON.parse(
        firstMotionDiv.getAttribute("animate") || "{}"
      );
      expect(animate.x).toBe(500);
      expect(animate.y).toBe(100);
    });
    it("should display the animate properties correctly when innerWidth is smaller than 1024", () => {
      Object.defineProperty(global.window, "innerWidth", {
        value: 500,
        configurable: true,
      });
      render(<FloatingMessage message={mockMessage} />);
      const motionDivs = screen.getAllByTestId("motion-div");
      const firstMotionDiv = motionDivs[0];
      const animate = JSON.parse(
        firstMotionDiv.getAttribute("animate") || "{}"
      );

      expect(animate.x).toBe(50);
      expect(animate.y).toBe(150);
    });
    it("should display the title and the first 100 caracters from content", () => {
      render(<FloatingMessage message={mockMessage} />);
      const substring = mockMessage.content.substring(0, 100);
      const content = screen.getByText(`${substring}...`);
      expect(content).toBeInTheDocument();
      const title = screen.getByText(mockMessage.recommendation?.title);
      expect(title).toBeInTheDocument();
    });
  });
});
