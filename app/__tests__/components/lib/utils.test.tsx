import { CommonProps, ImportOriginal } from "@/lib/types";
import {
  cn,
  formatWeatherContext,
  getTime,
  getWeatherDisplay,
  getWeatherIcon,
  isNightTime,
  parseAndValidateJSON,
} from "@/lib/utils";
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  Eye,
  Moon,
  Snowflake,
} from "lucide-react";

vi.mock("lucide-react", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    CloudLightning: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Zap: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    CloudRain: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    CloudDrizzle: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Umbrella: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Snowflake: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Cloud: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Eye: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Waves: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Wind: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Cloudy: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Triangle: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Sun: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    CloudSun: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
    Moon: ({ children, className }: CommonProps) => (
      <svg className={className}>{children}</svg>
    ),
  };
});

vi.mock("tailwind-merge", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    twMerge: vi.fn((inputClasses) => `${inputClasses} tailwind-classes`),
  };
});

vi.mock("clsx", async (importOriginal: ImportOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    clsx: vi.fn((...input) => input.join(" ").split(",").join(" ")),
  };
});

describe("lib/utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe(" cn function", () => {
    it("cn function should return a string of css classes", () => {
      const result = cn("first", "second");
      expect(result).toBe("first second tailwind-classes");
    });
  });
  describe("getWeather", () => {
    it("getWeather should return the Cloud icon if not present in mapping", () => {
      const result = getWeatherIcon(100);
      expect(result.icon).toBe(Cloud);
      expect(result.color).toBe("#9ca3af");
      expect(result.bgColor).toBe("bg-gray-200");
    });
    it("getWeather should return moon icon if is night", () => {
      const result800 = getWeatherIcon(800, true);
      expect(result800.icon).toBe(Moon);
      expect(result800.color).toBe("#ddd6fe");
      expect(result800.bgColor).toBe("bg-violet-100");

      const result801 = getWeatherIcon(801, true);
      expect(result801.icon).toBe(Moon);
      expect(result801.color).toBe("#c4b5fd");
      expect(result801.bgColor).toBe("bg-violet-200");
    });
    it("getWeather should return ATMOSPHERE icon ", () => {
      const result = getWeatherIcon(701);
      expect(result.icon).toBe(Eye);
      expect(result.color).toBe("#9ca3af");
      expect(result.bgColor).toBe("bg-gray-200");
    });
    it("getWeather should return SNOW icon ", () => {
      const result = getWeatherIcon(600);
      expect(result.icon).toBe(Snowflake);
      expect(result.color).toBe("#e5e7eb");
      expect(result.bgColor).toBe("bg-gray-100");
    });
    it("getWeather should return RAIN icon ", () => {
      const result = getWeatherIcon(500);
      expect(result.icon).toBe(CloudRain);
      expect(result.color).toBe("#3b82f6");
      expect(result.bgColor).toBe("bg-blue-100");
    });
    it("getWeather should return DRIZZLE icon ", () => {
      const result = getWeatherIcon(300);
      expect(result.icon).toBe(CloudDrizzle);
      expect(result.color).toBe("#06b6d4");
      expect(result.bgColor).toBe("bg-cyan-100");
    });
    it("getWeather should return THUNDERSTORM icon ", () => {
      const result = getWeatherIcon(200);
      expect(result.icon).toBe(CloudLightning);
      expect(result.color).toBe("#6366f1");
      expect(result.bgColor).toBe("bg-indigo-100");
    });
  });
  describe("isNightTime", () => {
    it("should return true if the icon contains n in the code", () => {
      const result = isNightTime("800n");
      expect(result).toBe(true);
    });
    it("should return false if the icon contains n in the code", () => {
      const result = isNightTime("800");
      expect(result).toBe(false);
    });
  });
  describe("getWeatherDisplay", () => {
    it("should return weather data ", () => {
      const mockWeather = {
        icon: "200",
        description: "ploaie puternică",
        main: "Rain",
        id: 200,
      };
      const result = getWeatherDisplay(mockWeather);
      expect(result.isNight).toBe(false);
      expect(result.main).toBe("Rain");
      expect(result.description).toBe("ploaie puternică");
      expect(result.color).toBe("#6366f1");
      expect(result.bgColor).toBe("bg-indigo-100");
      expect(result.icon).toBe(CloudLightning);
    });
  });
  describe("getTime", () => {
    it("should format correct the time ", () => {
      const result = getTime(1750056847);
      expect(result.split(":")[0]).toHaveLength(2);
      expect(result.split(":")[1]).toHaveLength(2);
      expect(result.split(":")).toHaveLength(2);
    });
  });
  describe("parseAndValidateJSON", () => {
    it("should  throw an error if not response is there ", () => {
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      const result = parseAndValidateJSON(undefined);
      expect(result.content).toBe(mockErrorResult.content);
      expect(result.recommendation.title).toBe(
        mockErrorResult.recommendation.title
      );
      expect(result.recommendation.text).toBe(
        mockErrorResult.recommendation.text
      );
      expect(result.additional_tips).toHaveLength(1);
      expect(result.confidence).toBe("0%");
    });
    it("should parse and return a valid object", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          title: "🧥 Îmbrăcăminte Recomandată:",
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "👗",
            title: "Îmbrăcăminte Confortabilă",
            content:
              "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
            confidence: 90,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
          {
            id: 2,
            type: "info",
            icon: "🧥",
            title: "Jachetă Ușoară",
            content:
              "O jachetă subțire pentru seara târzie; poate fi ușor de purtat.",
            confidence: 85,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
          {
            id: 3,
            type: "health",
            icon: "💧",
            title: "Hidratare Adequată",
            content: "Bea apă suficient; minimum 2L pe zi este ideal.",
            confidence: 95,
            bgColor: "bg-emerald-50",
            borderColor: "border-l-emerald-500",
            iconBg: "bg-white/70",
          },
          {
            id: 4,
            type: "activity",
            icon: "🎉",
            title: "Distracție Plăcută!",
            content:
              "... asigură-te că te relaxezi și te bucuri de compania colegilor!",
            confidence: 92,
            bgColor: "bg-purple-50",
            borderColor: "border-l-purple-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: 92,
      };

      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      expect(result.additional_tips).toHaveLength(4);
      expect(result.recommendation.title).toBe(
        mockResponse.recommendation.title
      );
      expect(result.recommendation.text).toBe(mockResponse.recommendation.text);
      expect(result.content).toBe(mockResponse.text);
      expect(result.confidence).toBe(mockResponse.confidence);
      console.log(result, "result");
    });
    it("should return  the fallbackResponse when a field from the required fields is missing", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "👗",
            title: "Îmbrăcăminte Confortabilă",
            content:
              "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
            confidence: 90,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
      };
      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      expect(result.content).toBe(mockResponse.text);
      expect(result.recommendation).toEqual(mockErrorResult.recommendation);
      expect(result.additional_tips).toEqual(mockErrorResult.additional_tips);
      expect(result.confidence).toBe("0%");
    });
    it("should  throw an error and return the default data if recommendation title is missing", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "👗",
            title: "Îmbrăcăminte Confortabilă",
            content:
              "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
            confidence: 90,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "100%",
      };
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      expect(result.recommendation.title).toBe(
        mockErrorResult.recommendation.title
      );
      expect(result.recommendation.text).toBe(
        mockErrorResult.recommendation.text
      );
      expect(result.additional_tips).toHaveLength(1);
      expect(result.confidence).toBe("0%");
    });
    it("should throw an error and return the fallback response", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          title: "Cum sa te imbraci",
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: {
          id: 1,
          type: "info",
          icon: "👗",
          title: "Îmbrăcăminte Confortabilă",
          content:
            "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
          confidence: 90,
          bgColor: "bg-blue-50",
          borderColor: "border-l-blue-500",
          iconBg: "bg-white/70",
        },
        confidence: "100%",
      };
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      expect(result.recommendation.title).toBe(
        mockErrorResult.recommendation.title
      );
      expect(result.recommendation.text).toBe(
        mockErrorResult.recommendation.text
      );
      expect(result.additional_tips).toHaveLength(1);
      expect(result.confidence).toBe("0%");
    });
    it("should throw an error and return the fallback response when a field from additional tips is missing", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          title: "Cum sa te imbraci",
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "👗",
            title: "Îmbrăcăminte Confortabilă",
            content:
              "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
            confidence: 90,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
          },
        ],
        confidence: "100%",
      };
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      expect(result.recommendation.title).toBe(
        mockErrorResult.recommendation.title
      );
      expect(result.recommendation.text).toBe(
        mockErrorResult.recommendation.text
      );
      expect(result.additional_tips).toHaveLength(1);
      expect(result.confidence).toBe("0%");
    });
    it("should throw an error and return the fallback response when a field from additional tips icon is not valid", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          title: "Cum sa te imbraci",
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: [
          {
            id: 1,
            type: "infoq",
            icon: "👗",
            title: "Îmbrăcăminte Confortabilă",
            content:
              "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
            confidence: 90,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "border-l-blue-500",
          },
        ],
        confidence: "100%",
      };
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      expect(result.recommendation.title).toBe(
        mockErrorResult.recommendation.title
      );
      expect(result.recommendation.text).toBe(
        mockErrorResult.recommendation.text
      );
      expect(result.additional_tips).toHaveLength(1);
      expect(result.confidence).toBe("0%");
    });
    it("should throw an error and return the fallback response when confidence is >98  ", () => {
      const mockResponse = {
        text: "🌤️ La ora 19:00, temperatura va fi de 23°C, iar cerul va fi senin. Vântul de 25 km/h va aduce o senzație plăcută, dar este bine să te îmbraci confortabil, având în vedere că ești însărcinată. Te sfătuiesc să optezi pentru o rochie sau o bluză ușoară din bumbac și pantaloni confortabili, care să nu strângă. O jachetă subțire ar fi utilă pentru seara târzie, când temperatura scade la 20°C sau chiar mai jos.",
        recommendation: {
          title: "Cum sa te imbraci",
          text: "Rochie din bumbac sau bluză lejeră cu pantaloni confortabili; adaugă o jachetă subțire.",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "👗",
            title: "Îmbrăcăminte Confortabilă",
            content:
              "Rochie lejeră din bumbac; asigură-te că este suficient de lungă.",
            confidence: 99,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "border-l-blue-500",
          },
        ],
        confidence: "100%",
      };
      const mockErrorResult = {
        content: "Răspuns primit, dar în format neașteptat.",
        recommendation: {
          title: "🛠️ Eroare tehnică:",
          text: "Te rog încearcă din nou peste câteva secunde",
        },
        additional_tips: [
          {
            id: 1,
            type: "info",
            icon: "🔧",
            title: "Reîncercare",
            content: "Verifică conexiunea și încearcă din nou",
            confidence: 70,
            bgColor: "bg-blue-50",
            borderColor: "border-l-blue-500",
            iconBg: "bg-white/70",
          },
        ],
        confidence: "0%",
      };
      const result = parseAndValidateJSON(JSON.stringify(mockResponse));
      expect(result.recommendation.title).toBe(
        mockErrorResult.recommendation.title
      );
      expect(result.recommendation.text).toBe(
        mockErrorResult.recommendation.text
      );
      expect(result.additional_tips).toHaveLength(1);
      expect(result.confidence).toBe("0%");
    });
  });

  describe("formatWeatherContext", () => {
    const mockWeatherData = {
      location: "Brăila, RO",
      lat: 45.2989,
      lon: 27.9654,
      timezone: "Europe/Bucharest",
      timezone_offset: 10800,
      current: {
        dt: 1750679578,
        sunrise: 1750645240,
        sunset: 1750701595,
        temp: 30.63,
        feels_like: 29.28,
        pressure: 1014,
        humidity: 29,
        dew_point: 10.58,
        uvi: 6.9,
        clouds: 0,
        visibility: 10000,
        wind_speed: 3.54,
        wind_deg: 307,
        wind_gust: 7.11,
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "cer senin",
            icon: "01d",
          },
        ],
      },
      minutely: [],
      hourly: [
        {
          dt: 1750676400,
          temp: 30.57,
          feels_like: 29.14,
          pressure: 1014,
          humidity: 28,
          dew_point: 10,
          uvi: 8.13,
          clouds: 0,
          visibility: 10000,
          wind_speed: 3.73,
          wind_deg: 307,
          wind_gust: 8.36,
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "cer senin",
              icon: "01d",
            },
          ],
          pop: 0,
        },
        {
          dt: 1750680000,
          temp: 30.63,
          feels_like: 29.28,
          pressure: 1014,
          humidity: 29,
          dew_point: 10.58,
          uvi: 6.9,
          clouds: 0,
          visibility: 10000,
          wind_speed: 3.54,
          wind_deg: 307,
          wind_gust: 7.11,
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "cer senin",
              icon: "01d",
            },
          ],
          pop: 0,
        },
        {
          dt: 1750683600,
          temp: 30.67,
          feels_like: 29.32,
          pressure: 1014,
          humidity: 29,
          dew_point: 10.61,
          uvi: 5.06,
          clouds: 1,
          visibility: 10000,
          wind_speed: 3.1,
          wind_deg: 295,
          wind_gust: 5.68,
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "cer senin",
              icon: "01d",
            },
          ],
          pop: 0,
        },
        {
          dt: 1750687200,
          temp: 30.73,
          feels_like: 29.37,
          pressure: 1014,
          humidity: 29,
          dew_point: 10.67,
          uvi: 3.17,
          clouds: 3,
          visibility: 10000,
          wind_speed: 2.51,
          wind_deg: 287,
          wind_gust: 4.69,
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "cer senin",
              icon: "01d",
            },
          ],
          pop: 0,
        },
        {
          dt: 1750690800,
          temp: 30.74,
          feels_like: 29.47,
          pressure: 1013,
          humidity: 30,
          dew_point: 11.18,
          uvi: 1.62,
          clouds: 4,
          visibility: 10000,
          wind_speed: 1.94,
          wind_deg: 300,
          wind_gust: 3.76,
          weather: [
            {
              id: 800,
              main: "Clear",
              description: "cer senin",
              icon: "01d",
            },
          ],
          pop: 0,
        },
        {
          dt: 1750694400,
          temp: 30.46,
          feels_like: 29.27,
          pressure: 1013,
          humidity: 31,
          dew_point: 11.44,
          uvi: 0.66,
          clouds: 11,
          visibility: 10000,
          wind_speed: 1.28,
          wind_deg: 0,
          wind_gust: 2.26,
          weather: [
            {
              id: 801,
              main: "Clouds",
              description: "câțiva nori",
              icon: "02d",
            },
          ],
          pop: 0,
        },
      ],
      daily: [],
      alerts: [],
    };
    it("should format the weather data ", () => {
      const result = formatWeatherContext(mockWeatherData);
      expect(result).toContain(`CONTEXT METEO ACTUAL:
📍 Locație: Brăila, RO
🌡️ Temperatura: 31°C (senzație 29°C)
💧 Umiditate: 29%
💨 Vânt: 13 km/h
☁️ Condiții: cer senin
👁️ Vizibilitate: 10 km
☀️ UV Index: 6.9
`);
    });
    it("should format the weather. data without displaying the UV Index", () => {
      const result = formatWeatherContext({
        ...mockWeatherData,
        current: { ...mockWeatherData.current, uvi: 0 },
      });
      expect(result).toContain(`CONTEXT METEO ACTUAL:
📍 Locație: Brăila, RO
🌡️ Temperatura: 31°C (senzație 29°C)
💧 Umiditate: 29%
💨 Vânt: 13 km/h
☁️ Condiții: cer senin
👁️ Vizibilitate: 10 km
`);
    });
    it("should format the weather data with alerts when temperature is < -10", () => {
      const result = formatWeatherContext({
        ...mockWeatherData,
        current: { ...mockWeatherData.current, temp: 40 },
      });

      expect(result).toContain(`CONTEXT METEO ACTUAL:
📍 Locație: Brăila, RO
🌡️ Temperatura: 40°C (senzație 29°C)
💧 Umiditate: 29%
💨 Vânt: 13 km/h
☁️ Condiții: cer senin
👁️ Vizibilitate: 10 km
☀️ UV Index: 6.9

PROGNOZA URMĂTOARELE 6 ORE:
14:00: 31°C, Clear
15:00: 31°C, Clear
16:00: 31°C, Clear
17:00: 31°C, Clear
18:00: 31°C, Clear
19:00: 30°C, Clouds

🚨 ALERTE: Căldură extremă

Răspunde pe baza acestor date actuale.`);
    });

    it("should format the weather data with alerts", () => {
      const mockHour = {
        dt: 1750694400,
        temp: 30.46,
        feels_like: 29.27,
        pressure: 1013,
        humidity: 31,
        dew_point: 11.44,
        uvi: 0.66,
        clouds: 11,
        visibility: 10000,
        wind_speed: 1.28,
        wind_deg: 0,
        wind_gust: 2.26,
        weather: [
          {
            id: 801,
            main: "Clouds",
            description: "câțiva nori",
            icon: "02d",
          },
        ],
        pop: 9,
      };
      const result = formatWeatherContext({
        ...mockWeatherData,
        current: { ...mockWeatherData.current, temp: -11, wind_speed: 20 },
        hourly: [...mockWeatherData.hourly.slice(0, 5), mockHour],
      });

      expect(result).toContain(`CONTEXT METEO ACTUAL:
📍 Locație: Brăila, RO
🌡️ Temperatura: -11°C (senzație 29°C)
💧 Umiditate: 29%
💨 Vânt: 72 km/h
☁️ Condiții: cer senin
👁️ Vizibilitate: 10 km
☀️ UV Index: 6.9

PROGNOZA URMĂTOARELE 6 ORE:
14:00: 31°C, Clear
15:00: 31°C, Clear
16:00: 31°C, Clear
17:00: 31°C, Clear
18:00: 31°C, Clear
19:00: 30°C, Clouds

🚨 ALERTE: Ger intens, Vânt puternic, Probabilitate mare de precipitații

Răspunde pe baza acestor date actuale.`);
    });
  });
});
