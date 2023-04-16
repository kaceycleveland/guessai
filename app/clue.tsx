"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";

const variants = {
  visible: {
    y: "0%",
    opacity: 1,
    height: "auto",
  },
  hidden: {
    y: "200%",
    opacity: 0,
    height: 0,
  },
};

export interface ClueProps {
  clueText: string;
}

export const Clue = forwardRef<HTMLDivElement, ClueProps>(
  ({ clueText }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={
          " bg-slate-950 bg-opacity-40 border border-slate-900 backdrop-blur-lg rounded text-white shadow-md w-full"
        }
        layout="size"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        <div className="p-4">{clueText}</div>
      </motion.div>
    );
  }
);

Clue.displayName = "Clue";

export default Clue;
