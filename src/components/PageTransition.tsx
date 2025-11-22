import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "left" | "right" | "none";
}

export const PageTransition = ({ children, direction = "none" }: PageTransitionProps) => {
  const variants = {
    initial: {
      opacity: 0,
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1], // ease-out cubic-bezier
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
