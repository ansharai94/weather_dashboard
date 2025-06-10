import { WeatherHourly } from "@/lib/types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  generatePrecipitationChartProps,
  processData,
} from "./precipitation-chart-constants";

interface PrecipitationBarCart {
  forecastData: WeatherHourly[];
}

// Înregistrează componentele pentru Bar Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export function PrecipitationBarCart({ forecastData }: PrecipitationBarCart) {
  // Procesează datele pentru precipitații
  const {
    labels,
    precipitationProbability,
    precipitationTypes,
    estimatedPrecipitation,
    next24Hours,
  } = processData(forecastData);

  // Calculează statistici
  const totalPeriods = precipitationProbability.length;
  const periodsWithRain = precipitationProbability.filter((p) => p > 0).length;
  const maxProbability = Math.max(...precipitationProbability);
  const avgProbability =
    precipitationProbability.reduce((a, b) => a + b, 0) / totalPeriods;
  const totalEstimated = estimatedPrecipitation.reduce((a, b) => a + b, 0);

  const { chartData, chartOptions } = generatePrecipitationChartProps(
    labels,
    precipitationProbability,
    precipitationTypes,
    estimatedPrecipitation,
    next24Hours
  );
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl shadow-black/10 border border-white/20">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
          🌧️ Precipitații pe 24h
        </h3>

        {/* Legenda pentru tipuri */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span>Ploaie</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span>Zăpadă</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Furtună</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Altele</span>
          </div>
        </div>
      </div>

      {/* Grafic */}
      <div className="relative w-full h-[280px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Statistici */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">
            {maxProbability.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Probabilitate max</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">
            {avgProbability.toFixed(0)}%
          </div>
          <div className="text-sm text-gray-600">Medie 24h</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">
            {periodsWithRain}
          </div>
          <div className="text-sm text-gray-600">Ore cu precipitații</div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <div className="text-lg font-bold text-blue-600">
            ~{totalEstimated.toFixed(1)} mm
          </div>
          <div className="text-sm text-gray-600">Total estimat</div>
        </div>
      </div>

      {/* Alertă dacă probabilitate mare */}
      {maxProbability > 70 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-800">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold">
              Probabilitate mare de precipitații!
            </span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">
            Se recomandă să ai umbrelă la îndemână.
          </p>
        </div>
      )}
    </div>
  );
}
