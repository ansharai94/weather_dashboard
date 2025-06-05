"use server";
const normalizeDiacritics = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD") // Decompose characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/[ăâ]/g, "a")
    .replace(/[î]/g, "i");
};
interface GeoDecode {
  name: string;
  local_names: {
    [key: string]: string;
  };
  lat: number;
  lon: number;
  country: string;
}
const BASE_URL = "http://api.openweathermap.org";

async function getCoordinatesByCity(city: string) {
  try {
    const url = `${BASE_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.WEATHER_DASHBOARD_API}`;
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const geolocation = (await response.json()) as GeoDecode[];
    const location = geolocation.find((location) => {
      const normalizedLocation = normalizeDiacritics(location.name);
      return normalizedLocation.toLowerCase() === city.toLowerCase();
    });
    return location;
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw error;
  }
}
async function getLocationByCoordinates({
  lat,
  lon,
}: {
  lat: number;
  lon: number;
}) {
  try {
    const url = `${BASE_URL}/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=ro&appid=${process.env.WEATHER_DASHBOARD_API}`;
    const response = await fetch(url);
    console.log(response, "response");
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const weather = await response.json();
    return weather;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
}
export async function getWeather(city: string) {
  const location = await getCoordinatesByCity(city);
  if (location) {
    console.log(location, "location");
    const weatherByCoordinates = await getLocationByCoordinates({
      lat: location.lat,
      lon: location.lon,
    });
    return {
      location: `${location.name}, ${location.country}`,
      ...weatherByCoordinates,
    };
  }
}
