import { AnimatedContainer } from "@/components/ai/animated-container";
import { CommonProps, ImportOriginal } from "@/lib/types";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("framer-motion", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    motion: {
      div: ({
        initial,
        animate,
        transition,
        className,
        children,
        ...props
      }: CommonProps) => (
        <div
          // @ts-expect-error error due to motion props
          initial={JSON.stringify(initial)}
          animate={JSON.stringify(animate)}
          transition={JSON.stringify(transition)}
          className={JSON.stringify(className)}
          data-testid="motion-div"
          {...props}
        >
          {children}
        </div>
      ),
    },
  };
});
describe("AnimatedContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("Basic randering", () => {
    it("should render the correct children", () => {
      render(<AnimatedContainer>Test data</AnimatedContainer>);
      expect(screen.getByText("Test data")).toBeInTheDocument();
    });
    it("should display the animate correctly when isVisible is true", () => {
      const { debug } = render(
        <AnimatedContainer>Test data</AnimatedContainer>
      );
      debug();
      const animate = JSON.parse(
        screen.getByTestId("motion-div").getAttribute("animate") || "{}"
      );
      expect(animate.opacity).toBe(1);
      expect(animate.scale).toBe(1);
    });
    it("should display the animate correctly when isVisible is true", () => {
      const { debug } = render(
        <AnimatedContainer isVisible={false}>Test data</AnimatedContainer>
      );
      debug();
      const animate = JSON.parse(
        screen.getByTestId("motion-div").getAttribute("animate") || "{}"
      );
      expect(animate.opacity).toBe(0.3);
      expect(animate.scale).toBe(0.98);
    });
  });
});
