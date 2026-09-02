"use client";

import { useRef, useEffect, useState } from "react";
import { useAnimation, motion, Variants } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function BlurText({ text, delay = 0, className = "" }: BlurTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  const defaultVariants: Variants = {
    hidden: { filter: "blur(10px)", opacity: 0, y: 10 },
    visible: { filter: "blur(0px)", opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={defaultVariants}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
