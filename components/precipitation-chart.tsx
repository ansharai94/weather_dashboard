import { CloudRain } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export function PrecipitationChart() {
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-2">
        <CloudRain className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-gray-800">Precipitații</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-blue-500 text-sm">
            Grafic precipitații
            <br />
            pe următoarele ore
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
