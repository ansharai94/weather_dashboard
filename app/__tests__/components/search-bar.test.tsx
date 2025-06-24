import { SearchBar } from "@/components/search-bar";
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach } from "node:test";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { CommonProps, ImportOriginal } from "@/lib/types";
vi.mock("./components/ui/button", () => ({
  Button: ({ children, onClick, className, ...props }: CommonProps) => {
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>;
  },
}));

vi.mock("./components/ui/card", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Card: ({ children, className }: CommonProps) => (
      <div className={className}>{children}</div>
    ),
    CardContent: ({ children, className }: CommonProps) => (
      <div className={className}>{children}</div>
    ),
  };
});

vi.mock("./components/ui/input", () => ({
  Input: ({
    placeholder,
    value,
    onChange,
    className,
    ...props
  }: CommonProps) => {
    <input
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      className={className}
      {...props}
    />;
  },
}));
vi.mock("lucide-react", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MapPin: ({ className, ...props }: CommonProps) => (
      <svg className={className} data-testid="map-pin-icon" {...props} />
    ),
    Navigation: ({ className, ...props }: CommonProps) => (
      <svg className={className} data-testid="navigation-icon" {...props} />
    ),
  };
});

describe("Search bar", () => {
  const mockSetSearchCity = vi.fn();
  const mockHandleSearch = vi.fn();
  const mockHandleGeolocation = vi.fn();

  const defaultProps = {
    searchCity: "",
    setSearchCity: mockSetSearchCity,
    handleSearch: mockHandleSearch,
    handleGeolocation: mockHandleGeolocation,
    isLoading: false,
    isGeolocationLoading: false,
  };
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all essential elements", () => {
      render(<SearchBar {...defaultProps} />);
      expect(
        screen.getByPlaceholderText(
          "Caută orașul... (ex: București, Cluj-Napoca)"
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /folosește locația curentă/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /caută/i })
      ).toBeInTheDocument();
    });
    it("renders MapPin icon when not loading geolocation", () => {
      render(<SearchBar {...defaultProps} />);
      const button = screen.getByTitle("Folosește locația curentă");

      const mapPin = button.querySelector("[data-testid='map-pin-icon']");
      const navigation = button.querySelector(
        "[data-testid='navigation-icon']"
      );
      expect(mapPin).toBeInTheDocument();
      expect(navigation).not.toBeInTheDocument();
    });
    it("renders Navigatio icon when loading geolocation", () => {
      render(<SearchBar {...defaultProps} isGeolocationLoading={true} />);
      const button = screen.getByTitle("Folosește locația curentă");
      const mapPin = button.querySelector("[data-testid='map-pin-icon']");
      const navigation = button.querySelector(
        "[data-testid='navigation-icon']"
      );
      expect(navigation).toBeInTheDocument();
      expect(mapPin).not.toBeInTheDocument();
    });
  });
  describe("Input Interactions", () => {
    it("displays the current search city value", () => {
      render(<SearchBar {...defaultProps} searchCity="Braila" />);
      const input = screen.getByDisplayValue("Braila");
      expect(input).toBeInTheDocument();
    });

    it("calls setSearchCity when input value changes", async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText(
        "Caută orașul... (ex: București, Cluj-Napoca)"
      );
      await user.type(input, "Cluj");
      expect(mockSetSearchCity).toHaveBeenCalledTimes(4);
    });

    it("handles input change events correcctly", () => {
      render(<SearchBar {...defaultProps} />);
      const input = screen.getByPlaceholderText(
        "Caută orașul... (ex: București, Cluj-Napoca)"
      );
      fireEvent.change(input, { target: { value: "Timișoara" } });
      expect(mockSetSearchCity).toHaveBeenCalledWith("Timișoara");
    });
  });

  describe("Search button", () => {
    it("calls handleSearch when search button is clicked", async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const searchButton = screen.getByRole("button", { name: /caută/i });
      expect(searchButton).toBeDefined();
      await user.click(searchButton);
      expect(mockHandleSearch).toBeCalled();
      expect(mockHandleSearch).toHaveBeenCalledTimes(1);
    });

    it("search button is always enabled", () => {
      render(<SearchBar {...defaultProps} />);
      const searchButton = screen.getByRole("button", { name: /caută/i });
      expect(searchButton).toBeDefined();
      expect(searchButton).not.toBeDisabled();
    });
  });

  describe("Geolocation Button", () => {
    it("calls handleGeolocation when geolocation button is clicked", async () => {
      const user = userEvent.setup();
      render(<SearchBar {...defaultProps} />);
      const geolocationButton = screen.getByRole("button", {
        name: /folosește locația curentă/i,
      });
      expect(geolocationButton).toBeDefined();
      await user.click(geolocationButton);
      expect(mockHandleGeolocation).toHaveBeenCalledTimes(1);
    });
    it("disables geolocation button when loading ", async () => {
      render(<SearchBar {...defaultProps} isGeolocationLoading={true} />);
      const geolocationButton = screen.getByRole("button", {
        name: /folosește locația curentă/i,
      });
      expect(geolocationButton).toBeDefined();
      expect(geolocationButton).toBeDisabled();
    });
    it("enables geolocation button when not loading", () => {
      render(<SearchBar {...defaultProps} isGeolocationLoading={false} />);
      const geolocationButton = screen.getByRole("button", {
        name: /folosește locația curentă/i,
      });
      expect(geolocationButton).toBeDefined();
      expect(geolocationButton).toHaveAttribute(
        "title",
        "Folosește locația curentă"
      );
    });

    describe("Load States", () => {
      it("show spinning navigation icon during geolocation loading", () => {
        render(<SearchBar {...defaultProps} isGeolocationLoading={true} />);
        const navigationIcon = screen.getByTestId("navigation-icon");
        expect(navigationIcon).toHaveClass("animate-spin");
        expect(navigationIcon).toHaveClass("text-blue-600");
      });
      it("shows static map pin icon when not loading", () => {
        render(<SearchBar {...defaultProps} isGeolocationLoading={false} />);
        const button = screen.getByTitle("Folosește locația curentă");
        expect(button).toBeDefined();
        const mapPinIcon = button.querySelector("svg");
        expect(mapPinIcon).toBeDefined();
        expect(mapPinIcon).toHaveClass("text-gray-600");
        expect(mapPinIcon).not.toHaveClass("animate-spin");
      });

      describe("Accessibility", () => {
        it("has proper button roles ", () => {
          render(<SearchBar {...defaultProps} />);
          const buttons = screen.getAllByRole("button");
          expect(buttons).toHaveLength(2);
        });
        it("has proper input accessibility", () => {
          render(<SearchBar {...defaultProps} />);
          const input = screen.getByRole("textbox");
          expect(input).toBeInTheDocument();
        });
        it("geolocation button has descriptive title", () => {
          render(<SearchBar {...defaultProps} />);

          const geoButton = screen.getByTitle("Folosește locația curentă");
          expect(geoButton).toBeInTheDocument();
        });
      });
      describe("Edge cases", () => {
        it("handles empty search city", () => {
          render(<SearchBar {...defaultProps} searchCity="" />);

          const input = screen.getByPlaceholderText(
            "Caută orașul... (ex: București, Cluj-Napoca)"
          );
          expect(input).toHaveValue("");
        });

        it("handles long search city names", () => {
          const longCityName =
            "A very long city name that exceeds normal expectations";
          render(<SearchBar {...defaultProps} searchCity={longCityName} />);

          const input = screen.getByDisplayValue(longCityName);
          expect(input).toBeInTheDocument();
          expect(input).toHaveValue(longCityName);
        });

        it("handles special characters in city names", () => {
          const cityWithSpecialChars = "Cluj-Napoca (Regiunea Transilvania)";
          render(
            <SearchBar {...defaultProps} searchCity={cityWithSpecialChars} />
          );

          const input = screen.getByDisplayValue(cityWithSpecialChars);
          expect(input).toBeInTheDocument();
          expect(input).toHaveValue(cityWithSpecialChars);
        });
      });
    });
  });
});
