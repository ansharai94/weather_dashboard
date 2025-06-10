import { motion } from "framer-motion";

// COMPONENTA PENTRU STAREA GOALĂ
interface EmptyInsightsStateProps {
  isLoading?: boolean;
}
export function EmptyInsightsState({
  isLoading = false,
}: EmptyInsightsStateProps) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl shadow-black/10 border border-white/20 h-[600px] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 m-0">
          🧠 AI Insights
          {isLoading && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.div>
              Pregătind insights...
            </motion.span>
          )}
        </h3>
      </div>

      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full text-gray-400"
      >
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-6xl mb-4"
          >
            🤖
          </motion.div>
          <p className="text-lg font-medium mb-2">
            {isLoading
              ? "Se generează insights..."
              : "În așteptarea insights-urilor"}
          </p>
          <p className="text-sm">
            {isLoading
              ? "AI-ul analizează datele meteo..."
              : "Pune o întrebare pentru a vedea recomandări personalizate"}
          </p>

          {/* Animated dots */}
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className={`w-2 h-2 rounded-full ${
                  isLoading ? "bg-yellow-400" : "bg-blue-400"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
