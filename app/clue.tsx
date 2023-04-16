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
  order: number;
  total: number;
}

export const Clue = forwardRef<HTMLDivElement, ClueProps>(
  ({ clueText, order, total }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={
          " bg-slate-950 bg-opacity-40 border border-slate-900 backdrop-blur-lg rounded text-white shadow-md w-full flex"
        }
        layout="size"
        initial="hidden"
        animate="visible"
        variants={variants}
      >
        <div className="p-4 flex-1">{clueText}</div>
        <div className="p-4">
          {order + 1}/{total}
        </div>
      </motion.div>
    );
  }
);

Clue.displayName = "Clue";

export default Clue;
