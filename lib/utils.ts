import { clsx, type ClassValue } from "clsx";
import {
  CloudLightning,
  Zap,
  CloudRain,
  CloudDrizzle,
  Umbrella,
  Snowflake,
  Cloud,
  Eye,
  Waves,
  Wind,
  Cloudy,
  Triangle,
  Sun,
  CloudSun,
  Moon,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { WeatherCondition, WeatherIconMapping } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const weatherIconMap: Record<number, WeatherIconMapping> = {
  // THUNDERSTORM (200-232)
  200: { icon: CloudLightning, color: "#6366f1", bgColor: "bg-indigo-100" }, // thunderstorm with light rain
  201: { icon: CloudLightning, color: "#4f46e5", bgColor: "bg-indigo-200" }, // thunderstorm with rain
  202: { icon: CloudLightning, color: "#4338ca", bgColor: "bg-indigo-300" }, // thunderstorm with heavy rain
  210: { icon: Zap, color: "#8b5cf6", bgColor: "bg-purple-100" }, // light thunderstorm
  211: { icon: Zap, color: "#7c3aed", bgColor: "bg-purple-200" }, // thunderstorm
  212: { icon: Zap, color: "#6d28d9", bgColor: "bg-purple-300" }, // heavy thunderstorm
  221: { icon: CloudLightning, color: "#5b21b6", bgColor: "bg-purple-400" }, // ragged thunderstorm
  230: { icon: CloudRain, color: "#6366f1", bgColor: "bg-indigo-100" }, // thunderstorm with light drizzle
  231: { icon: CloudRain, color: "#4f46e5", bgColor: "bg-indigo-200" }, // thunderstorm with drizzle
  232: { icon: CloudRain, color: "#4338ca", bgColor: "bg-indigo-300" }, // thunderstorm with heavy drizzle

  // DRIZZLE (300-321)
  300: { icon: CloudDrizzle, color: "#06b6d4", bgColor: "bg-cyan-100" }, // light intensity drizzle
  301: { icon: CloudDrizzle, color: "#0891b2", bgColor: "bg-cyan-200" }, // drizzle
  302: { icon: CloudDrizzle, color: "#0e7490", bgColor: "bg-cyan-300" }, // heavy intensity drizzle
  310: { icon: CloudRain, color: "#06b6d4", bgColor: "bg-cyan-100" }, // light intensity drizzle rain
  311: { icon: CloudRain, color: "#0891b2", bgColor: "bg-cyan-200" }, // drizzle rain
  312: { icon: CloudRain, color: "#0e7490", bgColor: "bg-cyan-300" }, // heavy intensity drizzle rain
  313: { icon: Umbrella, color: "#0891b2", bgColor: "bg-cyan-200" }, // shower rain and drizzle
  314: { icon: Umbrella, color: "#0e7490", bgColor: "bg-cyan-300" }, // heavy shower rain and drizzle
  321: { icon: CloudDrizzle, color: "#0891b2", bgColor: "bg-cyan-200" }, // shower drizzle

  // RAIN (500-531)
  500: { icon: CloudRain, color: "#3b82f6", bgColor: "bg-blue-100" }, // light rain
  501: { icon: CloudRain, color: "#2563eb", bgColor: "bg-blue-200" }, // moderate rain
  502: { icon: CloudRain, color: "#1d4ed8", bgColor: "bg-blue-300" }, // heavy intensity rain
  503: { icon: CloudRain, color: "#1e40af", bgColor: "bg-blue-400" }, // very heavy rain
  504: { icon: CloudRain, color: "#1e3a8a", bgColor: "bg-blue-500" }, // extreme rain
  511: { icon: Snowflake, color: "#3b82f6", bgColor: "bg-blue-200" }, // freezing rain
  520: { icon: Umbrella, color: "#3b82f6", bgColor: "bg-blue-100" }, // light intensity shower rain
  521: { icon: Umbrella, color: "#2563eb", bgColor: "bg-blue-200" }, // shower rain
  522: { icon: Umbrella, color: "#1d4ed8", bgColor: "bg-blue-300" }, // heavy intensity shower rain
  531: { icon: CloudRain, color: "#1e40af", bgColor: "bg-blue-400" }, // ragged shower rain

  // SNOW (600-622)
  600: { icon: Snowflake, color: "#e5e7eb", bgColor: "bg-gray-100" }, // light snow
  601: { icon: Snowflake, color: "#d1d5db", bgColor: "bg-gray-200" }, // snow
  602: { icon: Snowflake, color: "#9ca3af", bgColor: "bg-gray-300" }, // heavy snow
  611: { icon: Snowflake, color: "#6b7280", bgColor: "bg-gray-400" }, // sleet
  612: { icon: CloudDrizzle, color: "#e5e7eb", bgColor: "bg-gray-100" }, // light shower sleet
  613: { icon: CloudDrizzle, color: "#d1d5db", bgColor: "bg-gray-200" }, // shower sleet
  615: { icon: Cloud, color: "#9ca3af", bgColor: "bg-gray-200" }, // light rain and snow
  616: { icon: Cloud, color: "#6b7280", bgColor: "bg-gray-300" }, // rain and snow
  620: { icon: Snowflake, color: "#e5e7eb", bgColor: "bg-gray-100" }, // light shower snow
  621: { icon: Snowflake, color: "#d1d5db", bgColor: "bg-gray-200" }, // shower snow
  622: { icon: Snowflake, color: "#9ca3af", bgColor: "bg-gray-300" }, // heavy shower snow

  // ATMOSPHERE (700-781)
  701: { icon: Eye, color: "#9ca3af", bgColor: "bg-gray-200" }, // mist
  711: { icon: Waves, color: "#6b7280", bgColor: "bg-gray-300" }, // smoke
  721: { icon: Eye, color: "#a3a3a3", bgColor: "bg-neutral-200" }, // haze
  731: { icon: Wind, color: "#d97706", bgColor: "bg-amber-200" }, // sand/dust whirls
  741: { icon: Cloudy, color: "#9ca3af", bgColor: "bg-gray-200" }, // fog
  751: { icon: Wind, color: "#d97706", bgColor: "bg-amber-300" }, // sand
  761: { icon: Wind, color: "#92400e", bgColor: "bg-amber-400" }, // dust
  762: { icon: Triangle, color: "#dc2626", bgColor: "bg-red-200" }, // volcanic ash
  771: { icon: Wind, color: "#4b5563", bgColor: "bg-gray-300" }, // squalls
  781: { icon: Wind, color: "#dc2626", bgColor: "bg-red-300" }, // tornado

  // CLEAR (800)
  800: { icon: Sun, color: "#f59e0b", bgColor: "bg-yellow-100" }, // clear sky

  // CLOUDS (801-804)
  801: { icon: CloudSun, color: "#f59e0b", bgColor: "bg-yellow-100" }, // few clouds: 11-25%
  802: { icon: Cloudy, color: "#9ca3af", bgColor: "bg-gray-100" }, // scattered clouds: 25-50%
  803: { icon: Cloudy, color: "#6b7280", bgColor: "bg-gray-200" }, // broken clouds: 51-84%
  804: { icon: Cloudy, color: "#4b5563", bgColor: "bg-gray-300" }, // overcast clouds: 85-100%
};

export const getWeatherIcon = (
  weatherCode: number,
  isNight: boolean = false
): WeatherIconMapping => {
  const mapping = weatherIconMap[weatherCode];

  if (!mapping) {
    // Fallback pentru coduri necunoscute
    return { icon: Cloud, color: "#9ca3af", bgColor: "bg-gray-200" };
  }

  // Ajustează icon-ul pentru noaptea (doar pentru cer senin și puține nori)
  if (isNight) {
    if (weatherCode === 800) {
      return { icon: Moon, color: "#ddd6fe", bgColor: "bg-violet-100" }; // clear sky at night
    }
    if (weatherCode === 801) {
      return { icon: Moon, color: "#c4b5fd", bgColor: "bg-violet-200" }; // few clouds at night
    }
  }

  return mapping;
};
export const isNightTime = (iconCode: string): boolean => {
  return iconCode.endsWith("n");
};

// Funcție helper pentru a obține toate informațiile necesare pentru afișare
export const getWeatherDisplay = (weather: WeatherCondition) => {
  const isNight = isNightTime(weather.icon);
  const iconMapping = getWeatherIcon(weather.id, isNight);

  return {
    ...iconMapping,
    isNight,
    description: weather.description,
    main: weather.main,
  };
};
