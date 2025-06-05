import { Sun } from "lucide-react";

export function WeatherHeader() {
  return (
    <div className="text-center text-white mb-6">
      <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
        <Sun className="w-8 h-8 text-yellow-300" />
        Weather Dashboard
      </h1>
      <p className="text-blue-100">
        Verifică vremea în timp real și prognoza pe 7 zile
      </p>
    </div>
  );
}
