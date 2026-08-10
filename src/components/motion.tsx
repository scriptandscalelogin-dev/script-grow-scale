import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hydration-safe reduced-motion flag. Always false on the server and during the
 * first client render, so SSR markup and client markup match exactly.
 */
function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ---------------- Reveal: fade + rise, once ---------------- */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "aside" | "footer";
  hoverLift?: boolean;
};

export function Reveal({ children, className, delay = 0, as = "div", hoverLift = false }: RevealProps) {
  const reduced = useReducedMotionSafe();
  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={
        hoverLift && !reduced
          ? { y: -4, boxShadow: "0 12px 24px -8px rgba(0,0,0,0.18)", transition: { duration: 0.15, ease: "easeOut" } }
          : undefined
      }
      transition={
        reduced ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }
      }
    >
      {children}
    </Comp>
  );
}

/* ---------------- CountUp ---------------- */

type CountUpProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({ to, prefix = "", suffix = "", duration = 2, className }: CountUpProps) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) {
      setValue(to);
      return;
    }
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------------- Magnetic primary CTA ---------------- */

/**
 * Nudges a single interactive element toward the pointer. No-op on touch
 * devices and for reduced-motion users.
 */
export function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 20, mass: 0.4 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const PAD = 24;
    const MAX = 6;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const within =
        e.clientX >= r.left - PAD &&
        e.clientX <= r.right + PAD &&
        e.clientY >= r.top - PAD &&
        e.clientY <= r.bottom + PAD;
      if (!within) {
        x.set(0);
        y.set(0);
        return;
      }
      x.set(Math.max(-MAX, Math.min(MAX, (e.clientX - cx) * 0.25)));
      y.set(Math.max(-MAX, Math.min(MAX, (e.clientY - cy) * 0.35)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      x.set(0);
      y.set(0);
    };
  }, [enabled, x, y]);

  return (
    <motion.span ref={ref} className={cn("inline-block", className)} style={{ x: sx, y: sy }}>
      {children}
    </motion.span>
  );
}

/* ---------------- ShineOnce: single light sweep, no loop ---------------- */

export function ShineOnce({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotionSafe();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={cn("relative inline-block overflow-hidden", className)}>
      {children}
      {!reduced && inView && (
        <motion.span
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)",
          }}
          initial={{ x: "-120%" }}
          animate={{ x: "120%" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </span>
  );
}