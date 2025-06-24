import { PrecipitationType, WeatherHourly } from "@/lib/types";
import { getTime } from "@/lib/utils";
import { ChartOptions } from "chart.js";

export function generatePrecipitationChartProps(
  labels: string[],
  precipitationProbability: number[],
  precipitationTypes: PrecipitationType[],
  estimatedPrecipitation: number[],
  next24Hours: WeatherHourly[]
) {
  // Funcție pentru culoarea barei în funcție de POP și tip
  const getBarColor = (
    probability: number,
    type: "snow" | "sleet" | "rain" | "none"
  ) => {
    if (probability === 0) return "rgba(200, 200, 200, 0.3)";

    const intensity = probability / 100;

    switch (type) {
      case "snow":
        return `rgba(147, 197, 253, ${0.3 + intensity * 0.5})`;
      case "sleet":
        return `rgba(156, 163, 175, ${0.3 + intensity * 0.5})`; // Gri pentru lapoviță
      case "rain":
      default:
        return `rgba(59, 130, 246, ${0.3 + intensity * 0.5})`;
    }
  };
  const chartData = {
    labels,
    datasets: [
      {
        label: "Probabilitatea precipitațiilor (%)",
        data: precipitationProbability,
        backgroundColor: precipitationProbability.map((prob, index) =>
          getBarColor(prob, precipitationTypes[index])
        ),
        borderColor: precipitationProbability.map((prob, index) => {
          const baseColor = getBarColor(prob, precipitationTypes[index]);
          return baseColor.replace(/[\d.]+\)$/, "1)");
        }),
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 30,
        maxBarThickness: 40,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: "🌧️ Probabilitatea Precipitațiilor pe 24h",
        font: { size: 16, weight: "bold" },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          title: (context) => `Ora: ${context[0].label}`,
          label: (context) => {
            const probability = context.parsed.y;
            const type = precipitationTypes[context.dataIndex];
            const weatherDesc =
              next24Hours[context.dataIndex]?.weather[0]?.description || "";

            let precipType = "Precipitații";
            switch (type) {
              case "rain":
                precipType = "Ploaie";
                break;
              case "snow":
                precipType = "Zăpadă";
                break;
              case "sleet":
                precipType = "Lapoviță";
                break;
            }

            return [
              `${precipType}: ${probability.toFixed(0)}% probabilitate`,
              `Descriere: ${weatherDesc}`,
              `Cantitate estimată: ~${
                estimatedPrecipitation[context.dataIndex]
              } mm`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Ora",
          font: { weight: "bold" },
        },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        max: 100,
        display: true,
        title: {
          display: true,
          text: "Probabilitate (%)",
          font: { weight: "bold" },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
          stepSize: 20,
        },
      },
    },
  };

  return {
    chartData,
    chartOptions,
  };
}

export function calcEstimatedPrecipitation(
  item: WeatherHourly,
  index: number,
  precipitationTypes: PrecipitationType
) {
  const pop = item.pop;
  const type = precipitationTypes[index];

  if (pop === 0 || type === "none") return 0;

  // Estimare bazată pe POP și tipul vremii
  // Acestea sunt estimări - API-ul One Call nu oferă cantități exacte în versiunea gratuită
  let baseAmount = 0;

  switch (type) {
    case "rain":
      baseAmount = pop * 5; // Max ~5mm pentru 100% POP
      break;
    case "snow":
      baseAmount = pop * 3; // Zăpadă
      break;
    case "sleet":
      baseAmount = pop * 4; // Lapoviță
      break;
  }

  return Number(baseAmount.toFixed(1));
}
export function getPrecipitationTypes(item: WeatherHourly): PrecipitationType {
  const weatherMain = item.weather[0]?.main?.toLowerCase();

  switch (weatherMain) {
    case "rain":
      return "rain";
    case "snow":
      return "snow";
    case "sleet":
      return "sleet";
    default:
      return "none";
  }
}

export function processData(forecastData: WeatherHourly[]) {
  const next24Hours = forecastData?.slice(0, 8) || [];
  const labels: string[] = [];
  const precipitationProbability: number[] = [];
  const precipitationTypes: PrecipitationType[] = [];
  const estimatedPrecipitation: number[] = [];

  next24Hours.forEach((item, index) => {
    const label = getTime(item.dt);
    const precipitationProbab = item.pop * 100;
    const precipitationType = getPrecipitationTypes(item);
    const estimatedPrecip = calcEstimatedPrecipitation(
      item,
      index,
      precipitationType
    );

    labels.push(label);
    precipitationProbability.push(precipitationProbab);
    precipitationTypes.push(precipitationType);
    estimatedPrecipitation.push(estimatedPrecip);
  });

  return {
    labels,
    precipitationProbability,
    precipitationTypes,
    estimatedPrecipitation,
    next24Hours,
  };
}
