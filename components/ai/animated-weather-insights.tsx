import { IAdditionalTips } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { MotionInsights } from "./motion-insights";
import { WeatherInsightsSkeleton } from "./weather-insights-skeleton";

// Updated interface to include loading state
interface AnimatedWeatherInsightsProps {
  insights: IAdditionalTips[];
  showInsights: boolean;
  isLoading?: boolean;
}
export function AnimatedWeatherInsights({
  insights,
  showInsights,
  isLoading,
}: AnimatedWeatherInsightsProps) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl shadow-black/10 border border-white/20 h-[600px] overflow-y-auto">
      {/* Header cu indicator de status */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 m-0 flex items-center gap-3">
          🧠 AI Insights
          <AnimatePresence>
            {showInsights && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                ✨ Actualizat
              </motion.span>
            )}
          </AnimatePresence>
        </h3>
      </div>

      {/* Insights Grid cu stagger animation */}
      <div className="space-y-4 mb-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            // Loading skeleton
            <WeatherInsightsSkeleton />
          ) : (
            <MotionInsights insights={insights} showInsights={showInsights} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
