import { render, screen } from "@testing-library/react";
import Home from "../page";

vi.mock("@/components/weather-dashboard", () => ({
  default: function MockWeatherDashboard() {
    return (
      <div data-testid="weather-dashboard">Weather Dashboard Component</div>
    );
  },
}));
describe("Home Page", () => {
  it("matches snapshot", () => {
    render(<Home />);
    expect(screen.getByTestId("weather-dashboard")).toBeInTheDocument();
  });
  it("matches snapshot", () => {
    const { container } = render(<Home />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
