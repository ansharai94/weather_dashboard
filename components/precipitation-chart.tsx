import { CloudRain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { WeatherHourly } from "@/lib/types";
import { PrecipitationBarChart } from "./charts/precipitation-bar-chart";

interface PrecipitationChart {
  forecastData: WeatherHourly[];
}
export function PrecipitationChart({ forecastData }: PrecipitationChart) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <CloudRain className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-gray-800">Precipitații</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <PrecipitationBarChart forecastData={forecastData} />
      </CardContent>
    </Card>
  );
}
