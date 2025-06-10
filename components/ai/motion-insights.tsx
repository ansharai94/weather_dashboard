import { IAdditionalTips } from "@/lib/types";
import { motion } from "framer-motion";

interface MotionInsights {
  insights: IAdditionalTips[];
  showInsights: boolean;
}
export function MotionInsights({ insights, showInsights }: MotionInsights) {
  return (
    <motion.div
      key="insights-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {insights?.map((insight, index) => (
        <motion.div
          key={insight.id}
          initial={{ opacity: 0, x: -30, scale: 0.95 }}
          animate={{
            opacity: showInsights ? 1 : 0.5,
            x: 0,
            scale: showInsights ? 1 : 0.95,
          }}
          transition={{
            duration: 0.5,
            delay: showInsights ? index * 0.1 : 0,
            ease: "easeOut",
          }}
          whileHover={{
            y: -2,
            scale: 1.02,
            transition: { duration: 0.2 },
          }}
          className={`flex gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg border-l-4 ${insight.bgColor} ${insight.borderColor}`}
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${insight.iconBg}`}
          >
            {insight.icon}
          </motion.div>

          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-lg mb-2 m-0">
              {insight.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mb-2 m-0">
              {insight.content}
            </p>
            <div className="text-xs font-semibold text-blue-600">
              Încredere: {insight.confidence}%
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
