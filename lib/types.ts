export interface ICurrentWeather {
  location: string;
  current: Current;
}

interface Rain {
  [key: string]: number;
}

interface Current {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  rain: Rain[];
  sunrise: number;
  sunset: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: WeatherCondition[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}

export interface WeatherIconMapping {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  color: string;
  bgColor?: string;
}

export interface WeatherCondition {
  /** ID-ul unic al condiției meteo (ex: 502, 800) */
  id: number;

  /** Categoria principală a vremii (ex: "Rain", "Clear", "Clouds") */
  main: string;

  /** Descrierea detaliată a vremii (ex: "ploaie puternică", "cer senin") */
  description: string;

  /** Codul icon-ului pentru afișare (ex: "10d", "01d") */
  icon: string;
}

// Interface pentru temperaturile zilei
export interface Temperature {
  /** Temperatura în timpul zilei (°C) */
  day: number;

  /** Temperatura minimă din zi (°C) */
  min: number;

  /** Temperatura maximă din zi (°C) */
  max: number;

  /** Temperatura în timpul nopții (°C) */
  night: number;

  /** Temperatura seara (°C) */
  eve: number;

  /** Temperatura dimineața (°C) */
  morn: number;
}

// Interface pentru temperaturile resimțite
export interface FeelsLike {
  /** Temperatura resimțită în timpul zilei (°C) */
  day: number;

  /** Temperatura resimțită în timpul nopții (°C) */
  night: number;

  /** Temperatura resimțită seara (°C) */
  eve: number;

  /** Temperatura resimțită dimineața (°C) */
  morn: number;
}

// Interface pentru prognoza zilnică
export interface DailyWeatherForecast {
  /** Timestamp Unix pentru data prognozei */
  dt: number;

  /** Timestamp Unix pentru răsăritul soarelui */
  sunrise: number;

  /** Timestamp Unix pentru apusul soarelui */
  sunset: number;

  /** Timestamp Unix pentru răsăritul lunii */
  moonrise: number;

  /** Timestamp Unix pentru apusul lunii */
  moonset: number;

  /** Faza lunii (0-1, unde 0 și 1 = lună nouă, 0.5 = lună plină) */
  moon_phase: number;

  /** Rezumatul vremii pentru ziua respectivă */
  summary: string;

  /** Temperaturile pentru diferite momente ale zilei */
  temp: Temperature;

  /** Temperaturile resimțite pentru diferite momente ale zilei */
  feels_like: FeelsLike;

  /** Presiunea atmosferică (hPa) */
  pressure: number;

  /** Umiditatea (%) */
  humidity: number;

  /** Punctul de rouă (°C) */
  dew_point: number;

  /** Viteza vântului (m/s) */
  wind_speed: number;

  /** Direcția vântului (grade) */
  wind_deg: number;

  /** Rafale de vânt (m/s) */
  wind_gust: number;

  /** Condițiile meteo (poate fi un array cu mai multe condiții) */
  weather: WeatherCondition[];

  /** Acoperirea cu nori (%) */
  clouds: number;

  /** Probabilitatea de precipitații (0-1) */
  pop: number;

  /** Indicele UV */
  uvi: number;

  /** Cantitatea de ploaie (mm) - opțional, doar dacă se prevede ploaie */
  rain?: number;

  /** Cantitatea de zăpadă (mm) - opțional, doar dacă se prevede ninsoare */
  snow?: number;
}

// Interface pentru răspunsul complet al API-ului (dacă este un array de prognoze)
export interface WeatherForecastResponse {
  /** Array-ul cu prognozele zilnice */
  daily: DailyWeatherForecast[];
  location: string;
  current: Current;
  hourly: WeatherHourly[];
}

// Interface pentru răspunsul complet One Call API (cu toate datele)
export interface OneCallWeatherResponse {
  /** Latitudinea locației */
  lat: number;

  /** Longitudinea locației */
  lon: number;

  /** Fusul orar al locației */
  timezone: string;

  /** Offset-ul fusului orar în secunde */
  timezone_offset: number;

  /** Datele meteo actuale (opțional) */
  current?: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: WeatherCondition[];
    rain?: {
      "1h": number;
    };
    snow?: {
      "1h": number;
    };
  };

  /** Prognoza pe minute pentru următoarea oră (opțional) */
  minutely?: {
    dt: number;
    precipitation: number;
  }[];

  /** Prognoza pe ore pentru următoarele 48 de ore (opțional) */
  hourly?: {
    dt: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust?: number;
    weather: WeatherCondition[];
    pop: number;
    rain?: {
      "1h": number;
    };
    snow?: {
      "1h": number;
    };
  }[];

  /** Prognoza zilnică pentru următoarele 8 zile */
  daily: DailyWeatherForecast[];

  /** Alertele meteo (opțional) */
  alerts?: {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
  }[];
}

// Type pentru afișarea vremii cu informații suplimentare
export interface WeatherDisplayData {
  /** Data formatată pentru afișare */
  date: string;

  /** Ziua săptămânii */
  dayOfWeek: string;

  /** Temperatura principală pentru afișare */
  temperature: number;

  /** Temperatura minimă */
  tempMin: number;

  /** Temperatura maximă */
  tempMax: number;

  /** Descrierea în română */
  description: string;

  /** Icon-ul pentru afișare */
  icon: string;

  /** ID-ul condiției meteo */
  weatherId: number;

  /** Probabilitatea de precipitații în procente */
  chanceOfRain: number;

  /** Viteza vântului formatată */
  windSpeed: string;

  /** Umiditatea formatată */
  humidity: string;

  /** Este ziua curentă? */
  isToday?: boolean;
}

// Type helpers pentru lucrul cu datele
export type WeatherMain =
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Mist"
  | "Smoke"
  | "Haze"
  | "Dust"
  | "Fog"
  | "Sand"
  | "Ash"
  | "Squall"
  | "Tornado"
  | "Clear"
  | "Clouds";

export type WeatherIconCode =
  | "01d"
  | "01n"
  | "02d"
  | "02n"
  | "03d"
  | "03n"
  | "04d"
  | "04n"
  | "09d"
  | "09n"
  | "10d"
  | "10n"
  | "11d"
  | "11n"
  | "13d"
  | "13n"
  | "50d"
  | "50n";

export interface WeatherHourly {
  clouds: number;
  dew_point: number;
  dt: number;
  feels_like: number;
  humidity: number;
  pop: number;
  pressure: number;
  temp: number;
  uvi: number;
  visibility: number;
  weather: WeatherCondition[];
  wind_deg: number;
  wind_gust: number;
  wind_speed: number;
}
export interface IAdditionalTips {
  id: number;
  type: "priority" | "warning" | "info" | "activity" | "health" | "planning";
  icon: string;
  title: string;
  content: string;
  confidence: number;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}
type Role = "assistant" | "user" | "system";

export interface Recommendation {
  title: string;
  text: string;
}
export interface Message {
  id: number;
  role: Role;
  content: string;
  time: string;
  recommendation?: Recommendation;
  additional_tips?: IAdditionalTips[];
  confidence?: string;
  warning?: string;
}
