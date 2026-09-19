"use client";

import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function BlurText({ text, delay = 0, className = "" }: BlurTextProps) {
  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
      whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {text}
    </motion.div>
  );
}
