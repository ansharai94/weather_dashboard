import { Thermometer } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function TemperatureChart() {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <Thermometer className="w-5 h-5 text-red-500" />
        <CardTitle className="text-gray-800">Temperatura pe 24h</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-blue-500 text-sm">
            Grafic interactiv cu temperatura
            <br />
            (Chart.js sau Recharts)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
