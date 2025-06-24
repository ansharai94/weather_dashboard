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
interface GeoDecode extends Geolocation {
  name: string;
  local_names: {
    [key: string]: string;
  };
  country: string;
}
interface Geolocation {
  lat: number;
  lon: number;
}
const BASE_URL = "http://api.openweathermap.org";

async function getCoordinatesByCity(city: string) {
  try {
    const url = `${BASE_URL}/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.WEATHER_DASHBOARD_API}&lang=ro`;
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const geolocation = (await response.json()) as GeoDecode[];
    const location = geolocation.find((location) => {
      const normalizedLocation = normalizeDiacritics(
        location.local_names["ro"]
      );
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
export async function getWeatherByCity(city: string) {
  const location = await getCoordinatesByCity(city);
  if (location) {
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
export async function getWeatherByLocation({ lat, lon }: Geolocation) {
  const weatherByCoordinates = await getLocationByCoordinates({
    lat,
    lon,
  });
  const location = await getLocationName({ lat, lon });
  return {
    location,
    ...weatherByCoordinates,
  };
}
async function getLocationName({ lat, lon }: Geolocation) {
  const url = `${BASE_URL}/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${process.env.WEATHER_DASHBOARD_API}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log(data, "data");

  if (data.length > 0) {
    return `${data[0].name}, ${data[0].country}`;
  }
  return "Locație necunoscută";
}
