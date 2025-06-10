"use client";

import { useState } from "react";
import { SearchBar } from "./search-bar";
import { PrecipitationChart } from "./precipitation-chart";
import { TemperatureChart } from "./temperature-chart";
import { WeekForecast } from "./week-forecast";
import { CurrentWeather } from "./current-weather";
import { WeatherHeader } from "./weather-header";
import { getWeather } from "@/app/actions/direct-geodecoding";
import { WeatherForecastResponse } from "@/lib/types";
import { WeatherAISection } from "./ai/weather-ai-section";

export default function WeatherDashboard() {
  const [searchCity, setSearchCity] = useState("");
  const [weather, setWeather] = useState<WeatherForecastResponse | undefined>(
    undefined
  );

  async function handleSearch() {
    if (searchCity) {
      const response = await getWeather(searchCity);
      console.log(response, "--response in dashboard");
      setWeather(response);
    }
  }
  console.log(weather, "weather");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4">
      {/* Header */}
      <WeatherHeader />
      {/* Search Bar */}
      <SearchBar
        searchCity={searchCity}
        setSearchCity={setSearchCity}
        handleSearch={handleSearch}
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

          <WeatherAISection weatherData={weather} forecast={undefined} />
        </>
      )}
    </div>
  );
}
