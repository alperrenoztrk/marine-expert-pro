import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, createContext, useContext } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "left" | "right" | "none";
  kind?: "slide" | "fade";
  className?: string;
  /**
   * Forwarded from AnimatePresence via `custom`.
   * Lets exiting pages use the newest transition intent.
   */
  custom?: Partial<TransitionSpec>;
}

type TransitionSpec = {
  kind: "slide" | "fade";
  direction: "left" | "right" | "none";
};

const PageTransitionDepthContext = createContext(0);

const normalizeTransition = (input?: Partial<TransitionSpec>): TransitionSpec => ({
  kind: input?.kind ?? "fade",
  direction: input?.direction ?? "none",
});

export const PageTransition = ({ children, direction = "none", kind = "fade", className, custom }: PageTransitionProps) => {
  const depth = useContext(PageTransitionDepthContext);
  const prefersReducedMotion = useReducedMotion();

  // We already wrap the entire router with a single transition layer.
  // Any nested PageTransition usages (e.g. per-route wrappers) become a no-op to avoid double animations.
  if (depth > 0) {
    return <>{children}</>;
  }

  const transition = normalizeTransition({ direction, kind });
  const transitionCustom = normalizeTransition({ ...transition, ...custom });

  const variants = {
    initial: (custom?: Partial<TransitionSpec>) => {
      const t = normalizeTransition(custom ?? transitionCustom);
      const isSlide = t.kind === "slide" && t.direction !== "none" && !prefersReducedMotion;

      return {
        opacity: 0,
        x: isSlide ? (t.direction === "left" ? -64 : 64) : 0,
        y: !isSlide && !prefersReducedMotion ? 10 : 0,
        scale: prefersReducedMotion ? 1 : 0.985,
        filter: prefersReducedMotion ? "none" : "blur(6px)",
      };
    },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: (custom?: Partial<TransitionSpec>) => {
      const t = normalizeTransition(custom ?? transitionCustom);
      const isSlide = t.kind === "slide" && t.direction !== "none" && !prefersReducedMotion;

      return {
        opacity: 0,
        x: isSlide ? (t.direction === "left" ? 64 : -64) : 0,
        y: !isSlide && !prefersReducedMotion ? -10 : 0,
        scale: prefersReducedMotion ? 1 : 0.985,
        filter: prefersReducedMotion ? "none" : "blur(8px)",
      };
    },
  };

  return (
    <PageTransitionDepthContext.Provider value={depth + 1}>
      <motion.div
        custom={transitionCustom}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={
          prefersReducedMotion
            ? { duration: 0.16, ease: "easeOut" }
            : transition.kind === "slide"
              ? { type: "spring", stiffness: 420, damping: 38, mass: 0.9 }
              : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
        }
        className={["w-full", className].filter(Boolean).join(" ")}
        style={{ willChange: "transform, opacity, filter" }}
      >
        {children}
      </motion.div>
    </PageTransitionDepthContext.Provider>
  );
};
