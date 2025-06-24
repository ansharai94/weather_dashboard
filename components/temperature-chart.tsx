import { Thermometer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { WeatherHourly } from "@/lib/types";
import { TemperatureLineChart } from "./charts/temperature-line-chart";

interface TemperatureChart {
  forecastData: WeatherHourly[];
}
export function TemperatureChart({ forecastData }: TemperatureChart) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <Thermometer className="w-5 h-5 text-red-500" />
        <CardTitle className="text-gray-800">Temperatura pe 24h</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <TemperatureLineChart forecastData={forecastData} />
      </CardContent>
    </Card>
  );
}
