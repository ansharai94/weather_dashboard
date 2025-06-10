import { motion } from "framer-motion";

interface AnimatedContainerProps {
  children: React.ReactNode;
  isVisible?: boolean;
  className?: string;
  duration?: number;
}

export function AnimatedContainer({
  children,
  isVisible = true,
  className,
  duration = 0.5,
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0.3, scale: 0.98 }}
      animate={{
        opacity: isVisible ? 1 : 0.3,
        scale: isVisible ? 1 : 0.98,
      }}
      transition={{ duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
