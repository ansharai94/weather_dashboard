import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImportOriginal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/utils", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    cn: vi.fn(),
  };
});

describe("Card component basic rendering", () => {
  const mockedCardClassName = "bg-white/90 backdrop-blur-sm";

  beforeEach(() => {
    vi.clearAllMocks();
  });
  vi.mocked(cn).mockImplementationOnce((...classes) => `${classes}`);
  it("Card should render with combinated className", () => {
    render(<Card className={mockedCardClassName}>Card</Card>);
    const card = screen.getByText("Card");
    expect(card.classList.value).toBe(
      "rounded-lg border bg-card text-card-foreground shadow-sm,bg-white/90 backdrop-blur-sm"
    );
  });
  it("CardHeader should render with corect className", () => {
    vi.mocked(cn).mockImplementationOnce((...classes) => `${classes}`);
    render(<CardHeader className={mockedCardClassName}>CardHeader</CardHeader>);
    const cardHeader = screen.getByText("CardHeader");
    console.log(cardHeader.classList.value);
    expect(cardHeader.classList.value).toBe(
      "flex flex-col space-y-1.5 p-6,bg-white/90 backdrop-blur-sm"
    );
  });
  it("CardTitle should render with corect className", () => {
    vi.mocked(cn).mockImplementationOnce((...classes) => `${classes}`);
    render(<CardTitle className={mockedCardClassName}>CardTitle</CardTitle>);
    const cardTitle = screen.getByText("CardTitle");
    expect(cardTitle.classList.value).toBe(
      "text-2xl font-semibold leading-none tracking-tight,bg-white/90 backdrop-blur-sm"
    );
  });
  it("CardDescription should render with corect className", () => {
    vi.mocked(cn).mockImplementationOnce((...classes) => `${classes}`);
    render(
      <CardDescription className={mockedCardClassName}>
        CardDescription
      </CardDescription>
    );
    const cardDescription = screen.getByText("CardDescription");
    expect(cardDescription.classList.value).toBe(
      "text-sm text-muted-foreground,bg-white/90 backdrop-blur-sm"
    );
  });
  it("CardContent should render with corect className", () => {
    vi.mocked(cn).mockImplementationOnce((...classes) => `${classes}`);
    render(
      <CardContent className={mockedCardClassName}>CardContent</CardContent>
    );
    const cardContent = screen.getByText("CardContent");
    expect(cardContent.classList.value).toBe(
      "p-6 pt-0,bg-white/90 backdrop-blur-sm"
    );
  });
  it("CardFooter should render with corect className", () => {
    vi.mocked(cn).mockImplementationOnce((...classes) => `${classes}`);
    render(<CardFooter className={mockedCardClassName}>CardFooter</CardFooter>);
    const cardFooter = screen.getByText("CardFooter");
    expect(cardFooter.classList.value).toBe(
      "flex items-center p-6 pt-0,bg-white/90 backdrop-blur-sm"
    );
  });
});
