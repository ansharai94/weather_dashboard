"use client";

import { useState } from "react";
import { SearchBar } from "./search-bar";
import { PrecipitationChart } from "./precipitation-chart";
import { TemperatureChart } from "./temperature-chart";
import { WeekForecast } from "./week-forecast";
import { CurrentWeather } from "./current-weather";
import { WeatherHeader } from "./weather-header";
import {
  getWeatherByCity,
  getWeatherByLocation,
} from "@/app/actions/direct-geodecoding";
import { WeatherForecastResponse } from "@/lib/types";
import { WeatherAISection } from "./ai/weather-ai-section";

export default function WeatherDashboard() {
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState<WeatherForecastResponse | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);

  async function handleSearch() {
    if (searchCity) {
      setIsLoading(true);
      const response = await getWeatherByCity(searchCity);
      setIsLoading(false);
      setWeather(response);
    }
  }
  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const { latitude, longitude } = coords;
        setIsGeolocationLoading(true);
        const response = await getWeatherByLocation({
          lat: latitude,
          lon: longitude,
        });
        setWeather(response);
        setIsGeolocationLoading(false);
      });
    }
  };
  console.log(isLoading, "isLoading");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      {/* Header */}
      <WeatherHeader />
      {/* Search Bar */}
      <SearchBar
        isLoading={isLoading}
        isGeolocationLoading={isGeolocationLoading}
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        handleSearch={handleSearch}
        handleGeolocation={handleGeolocation}
      />
      {weather && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Current Weather */}
            <CurrentWeather
              location={weather.location}
              current={weather.current}
            />
            {/* 7-Day Forecast */}
            <WeekForecast daily={weather.daily} />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Chart */}
            <TemperatureChart forecastData={weather.hourly} />
            {/* Precipitation Chart */}
            <PrecipitationChart forecastData={weather.hourly} />
          </div>

          <WeatherAISection weatherData={weather} />
        </>
      )}
    </div>
  );
}
