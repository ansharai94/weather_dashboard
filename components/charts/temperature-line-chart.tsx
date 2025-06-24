import { WeatherHourly } from "@/lib/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  generateTemperatureChartProps,
  processTemperatureData,
} from "./temperature-chart-constants";

// Înregistrează componentele Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
interface TemperatureLineChart {
  forecastData: WeatherHourly[];
}
export function TemperatureLineChart({ forecastData }: TemperatureLineChart) {
  const { labels, temperatures, feelsLike } =
    processTemperatureData(forecastData);
  const { chartData, chartOptions } = generateTemperatureChartProps(
    labels,
    temperatures,
    feelsLike
  );
  return (
    <div className="-2xl p-6 shadow-xl shadow-black/10 my-5 border border-white/20">
      <div className="relative w-full h-[300px] md:h-[350px">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
