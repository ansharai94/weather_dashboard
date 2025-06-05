import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DailyWeatherForecast } from "@/lib/types";
import { getWeatherDisplay } from "@/lib/utils";
import { useState } from "react";

interface WeekForecast {
  daily: DailyWeatherForecast[];
}
export function WeekForecast({ daily }: WeekForecast) {
  const [day, selectDay] = useState(0);
  const selectedDayForecast = daily[day];
  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-gray-800">Prognoza pe 7 zile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-8 gap-4 mb-6">
          {daily.map((item, index) => {
            const { icon: IconComponent } = getWeatherDisplay(item.weather[0]);
            const currentDate = new Date(item.dt * 1000).toLocaleDateString(
              "ro-RO",
              { weekday: "long" }
            );
            const temp = `${Math.round(item.temp.max)}/${Math.round(
              item.temp.min
            )}`;

            return (
              <div key={index} className="text-center">
                {/* {item.day} */}
                <div className="text-sm text-gray-600 mb-2">{currentDate}</div>
                <IconComponent
                  className="w-8 h-8 mx-auto mb-2 text-yellow-500"
                  onClick={() => selectDay(index)}
                />
                {/* {item.temp} */}
                <div className="text-sm font-semibold">{temp}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {selectedDayForecast.pressure}
            </div>
            <div className="text-sm text-gray-600">Presiune (hPa)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(selectedDayForecast.uvi)}
            </div>
            <div className="text-sm text-gray-600">Indice UV</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-500">
              {new Date(selectedDayForecast.sunrise * 1000)
                .toLocaleTimeString("ro-RO")
                .slice(0, 5)}
            </div>

            <div className="text-sm text-gray-600">Răsărit</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-500">
              {new Date(selectedDayForecast.sunset * 1000)
                .toLocaleTimeString("ro-RO")
                .slice(0, 5)}
            </div>
            <div className="text-sm text-gray-600">Apus</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
