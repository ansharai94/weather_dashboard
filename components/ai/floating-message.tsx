import { Message } from "@/lib/types";
import { motion } from "framer-motion";

interface FloatingMessageProps {
  message: Message;
}

export function FloatingMessage({ message }: FloatingMessageProps) {
  return (
    <motion.div
      initial={{
        x: 20,
        y: 200,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: window.innerWidth > 1024 ? 500 : 50,
        y: window.innerWidth > 1024 ? 100 : 150,
        scale: 0.7,
        opacity: 0.6,
      }}
      exit={{
        opacity: 0,
        scale: 0.5,
      }}
      transition={{
        duration: 1.2,
        ease: "easeInOut",
      }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: "20px",
        top: "300px",
      }}
    >
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 max-w-sm">
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
            🤖
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-xl text-sm">
              {`${message.content?.substring(0, 100)}...`}
            </div>
            {message.recommendation && (
              <div className="mt-2 bg-blue-50 border-l-2 border-blue-400 p-2 rounded text-xs">
                <div className="font-semibold text-blue-800">
                  {message.recommendation.title}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating indicator */}
        <motion.div
          animate={{
            y: [0, -5, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
        >
          ✨
        </motion.div>
      </div>
    </motion.div>
  );
}
