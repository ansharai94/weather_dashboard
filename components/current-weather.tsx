import { MapPin, Sun, Wind, Droplets, Thermometer, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { ICurrentWeather } from "@/lib/types";

export function CurrentWeather({ location, current }: ICurrentWeather) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            <span className="font-semibold text-gray-800">{location}</span>
          </div>
          <Sun className="w-12 h-12 text-yellow-500" />
        </div>

        <div className="text-6xl font-light text-blue-500 mb-6">
          {`${current?.temp}°C`}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Vânt</div>
              <div className="font-semibold">{`${current.wind_speed} km/h`}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-gray-600">Umiditate</div>
              <div className="font-semibold">{`${current?.humidity}%`}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-red-500" />
            <div>
              <div className="text-gray-600">Senzație</div>
              <div className="font-semibold">{`${current.feels_like}°C`}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Vizibilitate</div>
              <div className="font-semibold">
                {`${current.visibility / 1000} km`}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
