import { WeatherHourly } from "@/lib/types";
import { getTime } from "@/lib/utils";
import { ChartOptions } from "chart.js";

export function generateTemperatureChartProps(
  labels: string[],
  temperatures: number[],
  feelsLike: number[]
) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temperatures,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(75, 192, 192)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4, // Face linia mai curbată
        fill: true, // Umple zona de sub linie
      },
      {
        label: "Senzație termică (°C)",
        data: feelsLike,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.05)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        borderDash: [5, 5], // Linie punctată
      },
    ],
  };

  // Opțiuni pentru grafic
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: "Arial, sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "🌡️ Temperatura pe următoarele 24 ore",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: 20,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return `Ora: ${context[0].label}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}°C`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Ora",
          font: {
            weight: "bold",
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Temperatura (°C)",
          font: {
            weight: "bold",
          },
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: function (value) {
            return value + "°C";
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: "white",
      },
    },
  };
  return { chartData, chartOptions };
}

export function processTemperatureData(forecastData: WeatherHourly[]) {
  const next24Hours = forecastData?.slice(0, 8) || [];
  const labels: string[] = [];
  const temperatures: number[] = [];
  const feelsLike: number[] = [];
  next24Hours.forEach((item) => {
    const label = getTime(item.dt);
    const temperature = Math.round(item.temp);
    const feelLike = Math.round(item.feels_like);
    labels.push(label);
    temperatures.push(temperature);
    feelsLike.push(feelLike);
  });

  return { labels, temperatures, feelsLike };
}
